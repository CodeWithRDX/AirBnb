from datetime import date
from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from apps.listings.models import Listing
from .models import Booking

def check_booking_availability(listing_id, check_in, check_out, exclude_booking_id=None):
    """
    Checks if a listing is available for the given date range.
    Overlap condition:
        new_check_in < existing_check_out AND new_check_out > existing_check_in
    Only PENDING and CONFIRMED bookings block dates. CANCELLED bookings do not block.
    """
    query = Booking.objects.filter(
        listing_id=listing_id,
        status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED],
        check_in__lt=check_out,
        check_out__gt=check_in
    )
    if exclude_booking_id:
        query = query.exclude(id=exclude_booking_id)
        
    return not query.exists()


def create_booking_service(guest, listing_id, check_in, check_out, guests_count):
    """
    Transactional creation of a booking with row locking to prevent race conditions.
    Recalculates all pricing server-side to guarantee integrity.
    """
    if check_in >= check_out:
        raise ValidationError("Check-out date must be after check-in date.")
        
    if check_in < date.today():
        raise ValidationError("Check-in date cannot be in the past.")

    with transaction.atomic():
        # Acquire row lock on target listing to handle concurrent reservation attempts
        try:
            listing = Listing.objects.select_for_update().get(id=listing_id)
        except Listing.DoesNotExist:
            raise ValidationError("Listing does not exist.")

        if guests_count > listing.max_guests:
            raise ValidationError(f"Guest count ({guests_count}) exceeds listing capacity of {listing.max_guests}.")

        # Check date overlap
        is_available = check_booking_availability(listing.id, check_in, check_out)
        if not is_available:
            raise ValidationError("The requested dates are no longer available for this property.")

        # Calculate stay metrics
        nights = (check_out - check_in).days
        subtotal = listing.price_per_night * Decimal(nights)
        cleaning_fee = listing.cleaning_fee
        service_fee = listing.service_fee
        total_price = subtotal + cleaning_fee + service_fee

        booking = Booking.objects.create(
            listing=listing,
            guest=guest,
            check_in=check_in,
            check_out=check_out,
            guests=guests_count,
            nights=nights,
            subtotal=subtotal,
            cleaning_fee=cleaning_fee,
            service_fee=service_fee,
            total_price=total_price,
            status=Booking.Status.CONFIRMED
        )

        return booking
