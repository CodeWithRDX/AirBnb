import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import User
from apps.listings.models import Listing, ListingImage, Amenity
from apps.bookings.models import Booking
from apps.reviews.models import Review
from apps.favorites.models import Favorite

class Command(BaseCommand):
    help = "Seeds the database with realistic Airbnb marketplace listings, users, bookings, and reviews."

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding process...")

        with transaction.atomic():
            # Clear existing non-superuser data
            Review.objects.all().delete()
            Booking.objects.all().delete()
            Favorite.objects.all().delete()
            ListingImage.objects.all().delete()
            Listing.objects.all().delete()
            Amenity.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

            # 1. Create Users
            self.stdout.write("Creating users...")
            
            # Superuser / Admin
            if not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser(
                    email="admin@example.com",
                    password="adminpassword",
                    name="System Administrator"
                )

            # Hosts
            host1 = User.objects.create_user(
                email="sarah@example.com",
                password="password123",
                name="Sarah Jenkins",
                role=User.Role.HOST,
                profile_image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                bio="Superhost with 8 years of hospitality experience across Europe and Asia. Passionate about architecture and local culture."
            )
            host2 = User.objects.create_user(
                email="marcus@example.com",
                password="password123",
                name="Marcus Vance",
                role=User.Role.HOST,
                profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                bio="Architect & luxury real estate designer. Creating unforgettable stays."
            )
            host3 = User.objects.create_user(
                email="raushan@example.com",
                password="password123",
                name="Raushan Kumar",
                role=User.Role.HOST,
                profile_image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
                bio="Airbnb Superhost & curator of premium living spaces across Northern India."
            )

            # Guests
            guest1 = User.objects.create_user(
                email="john@example.com",
                password="password123",
                name="John Doe",
                role=User.Role.GUEST,
                profile_image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                bio="Digital nomad & software developer exploring work-friendly escapes globally."
            )
            guest2 = User.objects.create_user(
                email="emily@example.com",
                password="password123",
                name="Emily Watson",
                role=User.Role.GUEST,
                profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                bio="Foodie and slow traveler seeking authentic local neighborhood vibes."
            )

            # 2. Create Amenities
            self.stdout.write("Creating amenities...")
            amenity_data = [
                ("Wi-Fi", "Wifi"),
                ("Kitchen", "Utensils"),
                ("Pool", "Waves"),
                ("Air conditioning", "Wind"),
                ("Free parking", "Car"),
                ("TV", "Tv"),
                ("Dedicated workspace", "Laptop"),
                ("Washing machine", "Shirt"),
                ("Heating", "Flame"),
                ("Hair dryer", "Sparkles"),
                ("Jacuzzi", "Bath"),
                ("Beachfront", "Sun"),
                ("Gym", "Dumbbell"),
                ("BBQ Grill", "Flame"),
                ("Allows pets", "Dog"),
                ("Breakfast", "Coffee")
            ]
            amenities = {}
            for name, icon in amenity_data:
                amenities[name] = Amenity.objects.create(name=name, icon=icon)

            # 3. Create Listings
            self.stdout.write("Creating property listings...")
            listings_data = [
                # Chandigarh listings
                {
                    "host": host3,
                    "title": "Apartment in Chandigarh",
                    "description": "Chic and modern aesthetic apartment located in the serene green heart of Chandigarh. Features designer interior, king size plush bed, high-speed optic fiber Wi-Fi, and private balcony overlooking trees.",
                    "property_type": "Apartment",
                    "location": "Sector 35-B, Chandigarh",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.733315,
                    "longitude": 76.779419,
                    "price_per_night": 1826.00,
                    "cleaning_fee": 300.00,
                    "service_fee": 250.00,
                    "max_guests": 2,
                    "bedrooms": 1,
                    "beds": 1,
                    "bathrooms": 1.0,
                    "rating": 4.92,
                    "review_count": 28,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Dedicated workspace", "TV"],
                    "images": [
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Home in Chandigarh",
                    "description": "Spacious duplex family villa with private garden, modern kitchen, cozy warm lounge, and secure indoor parking in prime Sector 18 Chandigarh.",
                    "property_type": "Apartment",
                    "location": "Sector 18-C, Chandigarh",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.741000,
                    "longitude": 76.785000,
                    "price_per_night": 4165.00,
                    "cleaning_fee": 500.00,
                    "service_fee": 350.00,
                    "max_guests": 6,
                    "bedrooms": 3,
                    "beds": 3,
                    "bathrooms": 3.0,
                    "rating": 4.89,
                    "review_count": 34,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Free parking", "Kitchen", "Air conditioning", "Washing machine"],
                    "images": [
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Room in Chandigarh",
                    "description": "Cozy private room with ensuite bath in a peaceful boutique homestay near Sukhna Lake. Includes delicious morning chai and breakfast.",
                    "property_type": "Apartment",
                    "location": "Sector 8-A, Chandigarh",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.747000,
                    "longitude": 76.792000,
                    "price_per_night": 2255.00,
                    "cleaning_fee": 200.00,
                    "service_fee": 150.00,
                    "max_guests": 2,
                    "bedrooms": 1,
                    "beds": 1,
                    "bathrooms": 1.0,
                    "rating": 4.86,
                    "review_count": 42,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Air conditioning", "Breakfast", "TV"],
                    "images": [
                        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Flat in Chandigarh",
                    "description": "Sun-drenched luxury 2BHK flat with panoramic city view, modular kitchen, smart TVs, and dedicated work station.",
                    "property_type": "Apartment",
                    "location": "Sector 22, Chandigarh",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.730000,
                    "longitude": 76.772000,
                    "price_per_night": 2670.00,
                    "cleaning_fee": 350.00,
                    "service_fee": 200.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "rating": 4.96,
                    "review_count": 51,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Washing machine", "Free parking"],
                    "images": [
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host2,
                    "title": "Executive Designer Suite in Chandigarh",
                    "description": "High-end luxury suite with Italian marble finish, deep soaking bathtub, workstation, and 24/7 security near Elante Mall.",
                    "property_type": "Villa",
                    "location": "Industrial Area Phase 1, Chandigarh",
                    "city": "Chandigarh",
                    "country": "India",
                    "latitude": 30.706000,
                    "longitude": 76.804000,
                    "price_per_night": 3850.00,
                    "cleaning_fee": 400.00,
                    "service_fee": 300.00,
                    "max_guests": 3,
                    "bedrooms": 1,
                    "beds": 2,
                    "bathrooms": 1.5,
                    "rating": 4.97,
                    "review_count": 19,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Jacuzzi", "Gym", "Air conditioning", "Free parking"],
                    "images": [
                        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Zirakpur listings (Nearby Chandigarh)
                {
                    "host": host3,
                    "title": "Modern 2BHK Holiday Retreat in Zirakpur",
                    "description": "Beautifully styled new apartment on VIP Road, Zirakpur. Close to Chandigarh airport, fully equipped kitchen, high speed Wi-Fi, and terrace garden.",
                    "property_type": "Apartment",
                    "location": "VIP Road, Zirakpur",
                    "city": "Zirakpur",
                    "country": "India",
                    "latitude": 30.642500,
                    "longitude": 76.817300,
                    "price_per_night": 2400.00,
                    "cleaning_fee": 250.00,
                    "service_fee": 200.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "rating": 4.91,
                    "review_count": 22,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Free parking", "TV"],
                    "images": [
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Luxury Penthouse with Skyline Terrace in Zirakpur",
                    "description": "Top-floor penthouse with private rooftop deck, BBQ grill, ambient lighting, and panoramic sunset views over Shivalik foothills.",
                    "property_type": "Villa",
                    "location": "Ambala Highway, Zirakpur",
                    "city": "Zirakpur",
                    "country": "India",
                    "latitude": 30.651000,
                    "longitude": 76.825000,
                    "price_per_night": 4800.00,
                    "cleaning_fee": 500.00,
                    "service_fee": 400.00,
                    "max_guests": 6,
                    "bedrooms": 3,
                    "beds": 4,
                    "bathrooms": 3.0,
                    "rating": 4.98,
                    "review_count": 31,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "BBQ Grill", "Air conditioning", "Free parking", "Pool"],
                    "images": [
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host2,
                    "title": "Cozy Sunshine Studio in Zirakpur",
                    "description": "Minimalist, quiet studio apartment ideal for remote workers and weekend getaways. Fast Wi-Fi, smart TV, and convenient elevator access.",
                    "property_type": "Apartment",
                    "location": "Dhakoli, Zirakpur",
                    "city": "Zirakpur",
                    "country": "India",
                    "latitude": 30.648000,
                    "longitude": 76.838000,
                    "price_per_night": 1650.00,
                    "cleaning_fee": 150.00,
                    "service_fee": 120.00,
                    "max_guests": 2,
                    "bedrooms": 1,
                    "beds": 1,
                    "bathrooms": 1.0,
                    "rating": 4.85,
                    "review_count": 16,
                    "is_guest_favorite": False,
                    "amenities": ["Wi-Fi", "Air conditioning", "Dedicated workspace", "Free parking"],
                    "images": [
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Mumbai listings
                {
                    "host": host2,
                    "title": "Bandra Seaside Heritage Penthouse",
                    "description": "Located in Mumbai's trendiest cultural hub, Carter Road, this sunlit penthouse offers expansive views of the Arabian Sea, private sea-facing terrace, wooden ceiling beams, and contemporary art collection.",
                    "property_type": "Mansion",
                    "location": "Carter Road, Bandra West",
                    "city": "Mumbai",
                    "country": "India",
                    "latitude": 19.065000,
                    "longitude": 72.825000,
                    "price_per_night": 12500.00,
                    "cleaning_fee": 1500.00,
                    "service_fee": 1200.00,
                    "max_guests": 6,
                    "bedrooms": 3,
                    "beds": 3,
                    "bathrooms": 3.0,
                    "rating": 4.95,
                    "review_count": 48,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Free parking", "TV", "Dedicated workspace"],
                    "images": [
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Juhu Sea View Modern Apartment",
                    "description": "Wake up to soothing sea breezes in upscale Juhu. Step onto the beach, enjoy gourmet restaurants nearby, and relax in luxury.",
                    "property_type": "Apartment",
                    "location": "Juhu Tara Road",
                    "city": "Mumbai",
                    "country": "India",
                    "latitude": 19.098000,
                    "longitude": 72.826000,
                    "price_per_night": 9800.00,
                    "cleaning_fee": 1000.00,
                    "service_fee": 800.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "rating": 4.89,
                    "review_count": 39,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Beachfront"],
                    "images": [
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Lonavala listings (Nearby Mumbai)
                {
                    "host": host2,
                    "title": "Hilltop Glass Villa with Private Heated Pool",
                    "description": "Perched on a scenic ridge in Lonavala with breathtaking mist-covered valley views. Features open sundeck, heated infinity pool, BBQ gazebo, and lawn.",
                    "property_type": "Villa",
                    "location": "Tungarli Hills",
                    "city": "Lonavala",
                    "country": "India",
                    "latitude": 18.755000,
                    "longitude": 73.407000,
                    "price_per_night": 16000.00,
                    "cleaning_fee": 2000.00,
                    "service_fee": 1500.00,
                    "max_guests": 8,
                    "bedrooms": 4,
                    "beds": 5,
                    "bathrooms": 4.0,
                    "rating": 4.97,
                    "review_count": 55,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Pool", "Kitchen", "BBQ Grill", "Free parking"],
                    "images": [
                        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Goa listings
                {
                    "host": host1,
                    "title": "Luxury Sunset Villa with Infinity Pool",
                    "description": "Perched on cliffs overlooking the Arabian Sea, this ultra-modern villa offers floor-to-ceiling glass walls, a private infinity edge pool, and panoramic sunset views.",
                    "property_type": "Villa",
                    "location": "Vagator Hill Road, Anjuna",
                    "city": "Goa",
                    "country": "India",
                    "latitude": 15.586000,
                    "longitude": 73.743000,
                    "price_per_night": 18500.00,
                    "cleaning_fee": 2000.00,
                    "service_fee": 1500.00,
                    "max_guests": 8,
                    "bedrooms": 4,
                    "beds": 4,
                    "bathrooms": 4.5,
                    "rating": 4.98,
                    "review_count": 62,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Pool", "Air conditioning", "Kitchen", "Free parking", "BBQ Grill"],
                    "images": [
                        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Tranquil Beachfront Wooden Cottage",
                    "description": "Step directly onto the golden sands of Palolem Beach. Features open wooden verandas, hammocks under coconut palms, and ocean wave sounds.",
                    "property_type": "Beachfront",
                    "location": "Palolem Beach South",
                    "city": "Goa",
                    "country": "India",
                    "latitude": 15.010000,
                    "longitude": 74.020000,
                    "price_per_night": 7500.00,
                    "cleaning_fee": 800.00,
                    "service_fee": 600.00,
                    "max_guests": 2,
                    "bedrooms": 1,
                    "beds": 1,
                    "bathrooms": 1.0,
                    "rating": 4.90,
                    "review_count": 44,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Air conditioning", "Beachfront", "BBQ Grill"],
                    "images": [
                        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Paris listings
                {
                    "host": host2,
                    "title": "Eiffel Tower View Designer Loft",
                    "description": "Wake up to direct iconic views of the Eiffel Tower from your sun-drenched balcony. Located in Paris's prestigious 7th arrondissement, beautifully styled with Parisian herringbone floors.",
                    "property_type": "Apartment",
                    "location": "Avenue de la Bourdonnais",
                    "city": "Paris",
                    "country": "France",
                    "latitude": 48.858400,
                    "longitude": 2.294500,
                    "price_per_night": 28000.00,
                    "cleaning_fee": 3000.00,
                    "service_fee": 2200.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "rating": 4.99,
                    "review_count": 87,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Dedicated workspace", "Heating"],
                    "images": [
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                    ]
                },

                # Tokyo listings
                {
                    "host": host3,
                    "title": "Minimalist Japanese Penthouse in Shinjuku",
                    "description": "High-standing glass penthouse featuring cedar soaking bathtub (Ofuro), minimalist Scandinavian-Japanese decor, fast fiber Wi-Fi, and 360-degree cityscape views of Tokyo skyline.",
                    "property_type": "Apartment",
                    "location": "Kabukicho 2-Chome",
                    "city": "Tokyo",
                    "country": "Japan",
                    "latitude": 35.693800,
                    "longitude": 139.703400,
                    "price_per_night": 18500.00,
                    "cleaning_fee": 2000.00,
                    "service_fee": 1500.00,
                    "max_guests": 3,
                    "bedrooms": 1,
                    "beds": 2,
                    "bathrooms": 1.0,
                    "rating": 4.94,
                    "review_count": 68,
                    "is_guest_favorite": True,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Dedicated workspace", "Washing machine"],
                    "images": [
                        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
                    ]
                }
            ]

            created_listings = []
            for data in listings_data:
                amenities_names = data.pop("amenities")
                images_urls = data.pop("images")
                
                listing = Listing.objects.create(**data)
                
                # Attach amenities
                for name in amenities_names:
                    if name in amenities:
                        listing.amenities.add(amenities[name])
                
                # Attach images
                for order, url in enumerate(images_urls):
                    ListingImage.objects.create(
                        listing=listing,
                        image_url=url,
                        display_order=order
                    )
                
                created_listings.append(listing)

            # 4. Create Bookings & Reviews
            self.stdout.write("Creating bookings & reviews...")
            today = date.today()

            b1 = Booking.objects.create(
                listing=created_listings[0],
                guest=guest1,
                check_in=today - timedelta(days=20),
                check_out=today - timedelta(days=16),
                guests=2,
                nights=4,
                subtotal=created_listings[0].price_per_night * 4,
                cleaning_fee=created_listings[0].cleaning_fee,
                service_fee=created_listings[0].service_fee,
                total_price=(created_listings[0].price_per_night * 4) + created_listings[0].cleaning_fee + created_listings[0].service_fee,
                status=Booking.Status.COMPLETED
            )
            Review.objects.create(
                listing=created_listings[0],
                user=guest1,
                booking=b1,
                rating=5,
                comment="Absolutely fabulous stay in Chandigarh! Clean, beautifully decorated, super helpful host Raushan."
            )

            b2 = Booking.objects.create(
                listing=created_listings[1],
                guest=guest2,
                check_in=today - timedelta(days=15),
                check_out=today - timedelta(days=12),
                guests=4,
                nights=3,
                subtotal=created_listings[1].price_per_night * 3,
                cleaning_fee=created_listings[1].cleaning_fee,
                service_fee=created_listings[1].service_fee,
                total_price=(created_listings[1].price_per_night * 3) + created_listings[1].cleaning_fee + created_listings[1].service_fee,
                status=Booking.Status.COMPLETED
            )
            Review.objects.create(
                listing=created_listings[1],
                user=guest2,
                booking=b2,
                rating=5,
                comment="Wonderful family home in Chandigarh. Peaceful garden and great location!"
            )

            # 5. Create Wishlists / Favorites
            self.stdout.write("Creating wishlists...")
            Favorite.objects.create(user=guest1, listing=created_listings[0])
            Favorite.objects.create(user=guest1, listing=created_listings[1])
            Favorite.objects.create(user=guest2, listing=created_listings[2])
            Favorite.objects.create(user=guest2, listing=created_listings[5])

            self.stdout.write(self.style.SUCCESS("Successfully seeded database with rich multi-city listings, users, bookings, and reviews!"))
