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
            admin_user = User.objects.create_superuser(
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
                bio="Architect & luxury real estate designer. Creating unforgettable coastal stays."
            )
            host3 = User.objects.create_user(
                email="elena@example.com",
                password="password123",
                name="Elena Rostova",
                role=User.Role.HOST,
                profile_image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                bio="Travel photographer and boutique stay curator. Welcome to your home away from home."
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
                ("BBQ Grill", "Flame")
            ]
            amenities = {}
            for name, icon in amenity_data:
                amenities[name] = Amenity.objects.create(name=name, icon=icon)

            # 3. Create Listings
            self.stdout.write("Creating property listings...")
            listings_data = [
                {
                    "host": host1,
                    "title": "Luxury Sunset Villa with Infinity Pool",
                    "description": "Perched on high cliffs overlooking the Arabian Sea, this ultra-modern villa offers floor-to-ceiling glass walls, a private infinity edge pool, gourmet chef kitchen, and panoramic sunset views.",
                    "property_type": "Villa",
                    "location": "Vagator Hill Road, Anjuna",
                    "city": "Goa",
                    "country": "India",
                    "price_per_night": 22000.00,
                    "cleaning_fee": 2500.00,
                    "service_fee": 1800.00,
                    "max_guests": 8,
                    "bedrooms": 4,
                    "beds": 4,
                    "bathrooms": 4.5,
                    "amenities": ["Wi-Fi", "Pool", "Air conditioning", "Kitchen", "Free parking", "BBQ Grill", "Dedicated workspace"],
                    "images": [
                        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host2,
                    "title": "Eiffel Tower View Designer Loft",
                    "description": "Wake up to direct iconic views of the Eiffel Tower from your sun-drenched balcony. Located in Paris's prestigious 7th arrondissement, beautifully styled with mid-century modern furniture and Parisian herringbone floors.",
                    "property_type": "Apartment",
                    "location": "Avenue de la Bourdonnais",
                    "city": "Paris",
                    "country": "France",
                    "price_per_night": 28000.00,
                    "cleaning_fee": 3000.00,
                    "service_fee": 2200.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Dedicated workspace", "Heating", "Hair dryer"],
                    "images": [
                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Minimalist Japanese Penthouse in Shinjuku",
                    "description": "High-standing glass penthouse featuring cedar soaking bathtub (Ofuro), minimalist Scandinavian-Japanese decor, fast fiber Wi-Fi, and 360-degree cityscape views of Tokyo skyline.",
                    "property_type": "Apartment",
                    "location": "Kabukicho 2-Chome",
                    "city": "Tokyo",
                    "country": "Japan",
                    "price_per_night": 18500.00,
                    "cleaning_fee": 2000.00,
                    "service_fee": 1500.00,
                    "max_guests": 3,
                    "bedrooms": 1,
                    "beds": 2,
                    "bathrooms": 1.0,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Dedicated workspace", "Washing machine", "Heating"],
                    "images": [
                        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Ubud Eco-Bamboo Sanctuary Villa",
                    "description": "Immerse yourself in nature in this open-air bamboo architectural marvel surrounded by lush emerald rice terraces and jungle river canyons. Comes with private plunge pool and organic breakfast service.",
                    "property_type": "Treehouse",
                    "location": "Abiansemal Jungle Road",
                    "city": "Bali",
                    "country": "Indonesia",
                    "price_per_night": 14500.00,
                    "cleaning_fee": 1200.00,
                    "service_fee": 1100.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "amenities": ["Wi-Fi", "Pool", "Free parking", "Kitchen", "BBQ Grill"],
                    "images": [
                        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host2,
                    "title": "Bandra Seaside Heritage Penthouse",
                    "description": "Located in Mumbai's trendiest cultural hub, Carter Road, this sunlit penthouse offers expansive views of the Arabian Sea, private sea-facing terrace, wooden ceiling beams, and contemporary art collection.",
                    "property_type": "Mansion",
                    "location": "Carter Road, Bandra West",
                    "city": "Mumbai",
                    "country": "India",
                    "price_per_night": 25000.00,
                    "cleaning_fee": 2500.00,
                    "service_fee": 2000.00,
                    "max_guests": 6,
                    "bedrooms": 3,
                    "beds": 3,
                    "bathrooms": 3.0,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Free parking", "TV", "Dedicated workspace"],
                    "images": [
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Manhattan Skyline Glass Duplex",
                    "description": "Soar above Midtown Manhattan with double-height ceiling floor-to-ceiling windows, private elevator entrance, marble kitchen island, and skyline terrace overlooking Empire State Building.",
                    "property_type": "Apartment",
                    "location": "5th Avenue & 34th St",
                    "city": "New York",
                    "country": "United States",
                    "price_per_night": 35000.00,
                    "cleaning_fee": 4000.00,
                    "service_fee": 3000.00,
                    "max_guests": 5,
                    "bedrooms": 3,
                    "beds": 3,
                    "bathrooms": 2.5,
                    "amenities": ["Wi-Fi", "Kitchen", "Air conditioning", "Gym", "TV", "Dedicated workspace", "Heating"],
                    "images": [
                        "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Alpine Luxury Chalet with Private Sauna",
                    "description": "Authentic timber chalet located directly at the foot of the Matterhorn slopes. Features wood-burning fireplace, heated indoor spa jacuzzi, ski-in/ski-out access, and gourmet raclette kitchen.",
                    "property_type": "Cabin",
                    "location": "Winkelmatten Weg",
                    "city": "Zermatt",
                    "country": "Switzerland",
                    "price_per_night": 42000.00,
                    "cleaning_fee": 4500.00,
                    "service_fee": 3500.00,
                    "max_guests": 10,
                    "bedrooms": 5,
                    "beds": 6,
                    "bathrooms": 5.0,
                    "amenities": ["Wi-Fi", "Kitchen", "Heating", "Jacuzzi", "Free parking", "BBQ Grill"],
                    "images": [
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host2,
                    "title": "Kensington Historic Townhouse Apartment",
                    "description": "Charming Georgian period flat with high ceilings, original marble fireplace, lush garden patio access, located 5 minutes walk from Hyde Park and Museum Quarter.",
                    "property_type": "Apartment",
                    "location": "Gloucester Road",
                    "city": "London",
                    "country": "United Kingdom",
                    "price_per_night": 21000.00,
                    "cleaning_fee": 2200.00,
                    "service_fee": 1800.00,
                    "max_guests": 4,
                    "bedrooms": 2,
                    "beds": 2,
                    "bathrooms": 2.0,
                    "amenities": ["Wi-Fi", "Kitchen", "Heating", "Washing machine", "TV", "Dedicated workspace"],
                    "images": [
                        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host3,
                    "title": "Tranquil Beachfront Wooden Cottage",
                    "description": "Step directly onto the golden sands of Palolem Beach. Features open wooden verandas, hammocks under coconut palms, fresh seafood grill, and soothing ocean wave sounds.",
                    "property_type": "Beachfront",
                    "location": "Palolem Beach South",
                    "city": "Goa",
                    "country": "India",
                    "price_per_night": 9500.00,
                    "cleaning_fee": 1000.00,
                    "service_fee": 800.00,
                    "max_guests": 2,
                    "bedrooms": 1,
                    "beds": 1,
                    "bathrooms": 1.0,
                    "amenities": ["Wi-Fi", "Air conditioning", "Beachfront", "BBQ Grill"],
                    "images": [
                        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                    ]
                },
                {
                    "host": host1,
                    "title": "Kyoto Traditional Ryokan & Bamboo Garden",
                    "description": "Authentic Japanese wooden townhouse (Machiya) featuring tatami mat tea rooms, private moss garden, cypress bath, and traditional sliding Shoji screens in historic Gion district.",
                    "property_type": "Countryside",
                    "location": "Gion-machi Minamigawa",
                    "city": "Kyoto",
                    "country": "Japan",
                    "price_per_night": 26000.00,
                    "cleaning_fee": 2800.00,
                    "service_fee": 2100.00,
                    "max_guests": 5,
                    "bedrooms": 2,
                    "beds": 4,
                    "bathrooms": 1.5,
                    "amenities": ["Wi-Fi", "Kitchen", "Heating", "Hair dryer", "Dedicated workspace"],
                    "images": [
                        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
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

            # Past Booking 1 (Completed with Review)
            b1 = Booking.objects.create(
                listing=created_listings[0],
                guest=guest1,
                check_in=today - timedelta(days=20),
                check_out=today - timedelta(days=16),
                guests=4,
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
                comment="Absolutely breathtaking villa! The infinity pool at sunset was unforgettable and Sarah was an exceptional host."
            )

            # Past Booking 2 (Completed with Review)
            b2 = Booking.objects.create(
                listing=created_listings[1],
                guest=guest2,
                check_in=today - timedelta(days=15),
                check_out=today - timedelta(days=12),
                guests=2,
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
                comment="The view of Eiffel Tower in the morning sipping espresso from the balcony is worth every penny. Super clean and stylish!"
            )

            # Upcoming Booking 1 (Confirmed)
            Booking.objects.create(
                listing=created_listings[0],
                guest=guest2,
                check_in=today + timedelta(days=10),
                check_out=today + timedelta(days=15),
                guests=2,
                nights=5,
                subtotal=created_listings[0].price_per_night * 5,
                cleaning_fee=created_listings[0].cleaning_fee,
                service_fee=created_listings[0].service_fee,
                total_price=(created_listings[0].price_per_night * 5) + created_listings[0].cleaning_fee + created_listings[0].service_fee,
                status=Booking.Status.CONFIRMED
            )

            # Upcoming Booking 2 (Confirmed)
            Booking.objects.create(
                listing=created_listings[2],
                guest=guest1,
                check_in=today + timedelta(days=20),
                check_out=today + timedelta(days=25),
                guests=2,
                nights=5,
                subtotal=created_listings[2].price_per_night * 5,
                cleaning_fee=created_listings[2].cleaning_fee,
                service_fee=created_listings[2].service_fee,
                total_price=(created_listings[2].price_per_night * 5) + created_listings[2].cleaning_fee + created_listings[2].service_fee,
                status=Booking.Status.CONFIRMED
            )

            # 5. Create Favorites
            self.stdout.write("Creating wishlists...")
            Favorite.objects.create(user=guest1, listing=created_listings[0])
            Favorite.objects.create(user=guest1, listing=created_listings[1])
            Favorite.objects.create(user=guest2, listing=created_listings[2])
            Favorite.objects.create(user=guest2, listing=created_listings[3])

            self.stdout.write(self.style.SUCCESS("Successfully seeded database with users, listings, bookings, reviews, and wishlists!"))
