from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User
from apps.listings.models import Listing

class ListingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.host = User.objects.create_user(
            email="host@example.com",
            password="password123",
            name="Host User",
            role=User.Role.HOST
        )
        self.guest = User.objects.create_user(
            email="guest@example.com",
            password="password123",
            name="Guest User",
            role=User.Role.GUEST
        )
        self.listing = Listing.objects.create(
            host=self.host,
            title="Beachfront Paradise",
            description="Gorgeous villa on the beach",
            property_type="Villa",
            location="Beach Road",
            city="Goa",
            country="India",
            price_per_night=10000.00,
            cleaning_fee=1000.00,
            service_fee=500.00,
            max_guests=4,
            bedrooms=2,
            beds=2,
            bathrooms=2.0
        )

    def test_list_listings(self):
        response = self.client.get('/api/listings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_filter_listings_by_city(self):
        response = self.client.get('/api/listings/?city=Goa')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

        response_empty = self.client.get('/api/listings/?city=NonExistentCity')
        self.assertEqual(response_empty.data['count'], 0)

    def test_guest_cannot_create_listing(self):
        self.client.force_authenticate(user=self.guest)
        response = self.client.post('/api/listings/', {
            'title': 'Unauthorized Listing',
            'description': 'Attempt by guest',
            'property_type': 'Apartment',
            'location': 'Street 1',
            'city': 'Goa',
            'country': 'India',
            'price_per_night': 5000.00,
            'max_guests': 2
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_host_can_create_listing(self):
        self.client.force_authenticate(user=self.host)
        response = self.client.post('/api/listings/', {
            'title': 'New Host Villa',
            'description': 'Created by authorized host',
            'property_type': 'Villa',
            'location': 'Hilltop',
            'city': 'Mumbai',
            'country': 'India',
            'price_per_night': 15000.00,
            'max_guests': 4,
            'bedrooms': 2,
            'beds': 2,
            'bathrooms': 2.0
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
