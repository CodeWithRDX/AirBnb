from datetime import date
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.listings.models import Listing
from apps.bookings.models import Booking
from apps.bookings.services import check_booking_availability, create_booking_service

class BookingAvailabilityAndOverlapTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_user(
            email="host@example.com",
            password="password123",
            name="Host User",
            role=User.Role.HOST
        )
        self.guest1 = User.objects.create_user(
            email="guest1@example.com",
            password="password123",
            name="Guest One",
            role=User.Role.GUEST
        )
        self.guest2 = User.objects.create_user(
            email="guest2@example.com",
            password="password123",
            name="Guest Two",
            role=User.Role.GUEST
        )
        self.listing = Listing.objects.create(
            host=self.host,
            title="Seaside Villa",
            description="Luxury stay",
            property_type="Villa",
            location="Beach Road",
            city="Goa",
            country="India",
            price_per_night=10000.00,
            cleaning_fee=1000.00,
            service_fee=500.00,
            max_guests=4
        )

        # Base Existing Booking: August 20 to August 25
        self.existing_booking = Booking.objects.create(
            listing=self.listing,
            guest=self.guest1,
            check_in=date(2026, 8, 20),
            check_out=date(2026, 8, 25),
            guests=2,
            nights=5,
            subtotal=50000.00,
            cleaning_fee=1000.00,
            service_fee=500.00,
            total_price=51500.00,
            status=Booking.Status.CONFIRMED
        )

    def test_case_1_overlap_inside_range_rejects(self):
        """Case 1: Existing 20-25, New 22-24 -> REJECT"""
        is_avail = check_booking_availability(
            self.listing.id, date(2026, 8, 22), date(2026, 8, 24)
        )
        self.assertFalse(is_avail)

    def test_case_2_back_to_back_checkout_checkin_allows(self):
        """Case 2: Existing 20-25, New 25-28 -> ALLOW"""
        is_avail = check_booking_availability(
            self.listing.id, date(2026, 8, 25), date(2026, 8, 28)
        )
        self.assertTrue(is_avail)

    def test_case_3_overlap_start_range_rejects(self):
        """Case 3: Existing 20-25, New 18-21 -> REJECT"""
        is_avail = check_booking_availability(
            self.listing.id, date(2026, 8, 18), date(2026, 8, 21)
        )
        self.assertFalse(is_avail)

    def test_case_4_overlap_enclosing_range_rejects(self):
        """Case 4: Existing 20-25, New 18-26 -> REJECT"""
        is_avail = check_booking_availability(
            self.listing.id, date(2026, 8, 18), date(2026, 8, 26)
        )
        self.assertFalse(is_avail)

    def test_price_calculated_serverside(self):
        """Verifies that price is recalculated on backend: 3 nights @ 10,000 + 1,000 + 500 = 31,500."""
        self.client.force_authenticate(user=self.guest2)
        response = self.client.post('/api/bookings/', {
            'listing_id': str(self.listing.id),
            'check_in': '2026-08-25',
            'check_out': '2026-08-28',
            'guests': 2
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data['subtotal']), 30000.00)
        self.assertEqual(float(response.data['cleaning_fee']), 1000.00)
        self.assertEqual(float(response.data['service_fee']), 500.00)
        self.assertEqual(float(response.data['total_price']), 31500.00)
