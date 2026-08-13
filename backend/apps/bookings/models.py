import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from apps.listings.models import Listing

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bookings')
    guest = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    
    check_in = models.DateField(db_index=True)
    check_out = models.DateField(db_index=True)
    guests = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    
    nights = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CONFIRMED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing', 'check_in', 'check_out', 'status']),
        ]

    def __str__(self):
        return f"Booking #{str(self.id)[:8]} by {self.guest.name} for {self.listing.title}"

    def clean(self):
        if self.check_in and self.check_out and self.check_in >= self.check_out:
            raise ValidationError("Check-out date must be strictly after check-in date.")
