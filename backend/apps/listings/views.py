import math
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.shortcuts import get_object_or_404
from .models import Listing, ListingImage, Amenity
from .serializers import (
    ListingListSerializer,
    ListingDetailSerializer,
    ListingCreateUpdateSerializer,
    AmenitySerializer
)
from .filters import ListingFilter
from .permissions import IsHostOrReadOnly, IsListingOwner
from apps.accounts.permissions import IsHost
from apps.accounts.models import User

# Known coordinates for fast geographic distance matching
WORLD_CITY_COORDINATES = {
    'chandigarh': (30.7333, 76.7794),
    'zirakpur': (30.6425, 76.8173),
    'mohali': (30.7046, 76.7179),
    'panchkula': (30.6942, 76.8606),
    'kharar': (30.7454, 76.6468),
    'kalka': (30.8384, 76.9367),
    'ambala': (30.3782, 76.7767),
    'pinjore': (30.7967, 76.9142),
    'shimla': (31.1048, 77.1734),
    'kasauli': (30.9013, 76.9649),
    'delhi': (28.6139, 77.2090),
    'gurgaon': (28.4595, 77.0266),
    'noida': (28.5355, 77.3910),
    'mumbai': (19.0760, 72.8777),
    'lonavala': (18.7557, 73.4091),
    'khandala': (18.7600, 73.3700),
    'pune': (18.5204, 73.8567),
    'thane': (19.2183, 72.9781),
    'navi mumbai': (19.0330, 73.0297),
    'goa': (15.2993, 74.1240),
    'anjuna': (15.5867, 73.7441),
    'panaji': (15.4909, 73.8278),
    'calangute': (15.5439, 73.7553),
    'bangalore': (12.9716, 77.5946),
    'nandi hills': (13.3702, 77.6835),
    'paris': (48.8566, 2.3522),
    'versailles': (48.8049, 2.1204),
    'tokyo': (35.6762, 139.6503),
    'yokohama': (35.4437, 139.6380),
    'kyoto': (35.0116, 135.7681),
    'london': (51.5074, -0.1278),
    'oxford': (51.7520, -1.2577),
    'new york': (40.7128, -74.0060),
    'brooklyn': (40.6782, -73.9442),
    'dubai': (25.2048, 55.2708),
    'sharjah': (25.3463, 55.4209),
    'abu dhabi': (24.4539, 54.3773),
    'barcelona': (41.3879, 2.1699),
    'sitges': (41.2372, 1.8059),
    'rome': (41.9028, 12.4964),
    'tivoli': (41.9608, 12.7989),
    'amsterdam': (52.3676, 4.9041),
    'sydney': (-33.8688, 151.2093),
    'singapore': (1.3521, 103.8198),
    'bali': (-8.3405, 115.0920),
}

NEARBY_PAIRS = {
    'chandigarh': 'Zirakpur',
    'zirakpur': 'Chandigarh',
    'mumbai': 'Lonavala',
    'lonavala': 'Mumbai',
    'delhi': 'Gurgaon',
    'gurgaon': 'Delhi',
    'goa': 'Anjuna',
    'anjuna': 'Goa',
    'bangalore': 'Nandi Hills',
    'paris': 'Versailles',
    'tokyo': 'Yokohama',
    'london': 'Oxford',
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate geographic distance between two points in kilometers.
    """
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().prefetch_related('images', 'amenities', 'favorites').select_related('host')
    filterset_class = ListingFilter
    search_fields = ['title', 'description', 'city', 'country', 'location']
    ordering_fields = ['price_per_night', 'rating', 'created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsHostOrReadOnly]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsListingOwner]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ListingCreateUpdateSerializer
        elif self.action == 'retrieve':
            return ListingDetailSerializer
        return ListingListSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def sections(self, request):
        """
        Returns authentic database listings. If a searched city does not have exact DB listings,
        calculates geographic distance to real DB listings and returns the nearest authentic stays.
        """
        city_param = request.query_params.get('city', '').strip()
        category_param = request.query_params.get('category', 'all').strip().lower()
        lat_param = request.query_params.get('lat')
        lng_param = request.query_params.get('lng')

        # 1. Determine user search coordinates if available
        user_coords = None
        if lat_param and lng_param:
            try:
                user_coords = (float(lat_param), float(lng_param))
            except (ValueError, TypeError):
                pass
        elif city_param:
            city_lower = city_param.lower()
            if city_lower in WORLD_CITY_COORDINATES:
                user_coords = WORLD_CITY_COORDINATES[city_lower]

        # 2. Build Category Filter
        category_filter = Q()
        if category_param == 'homes':
            category_filter = Q(property_type__in=['Apartment', 'Villa', 'Cabin', 'Mansion', 'Countryside'])
        elif category_param == 'experiences':
            category_filter = Q(property_type__in=['Villa', 'Cabin', 'Beachfront', 'Treehouse', 'Lakehouse']) | Q(is_guest_favorite=True)
        elif category_param == 'services':
            category_filter = Q(property_type__in=['Villa', 'Apartment', 'Mansion']) & Q(price_per_night__gte=2500)

        # 3. Check for Direct City Match in Database
        direct_matches = []
        if city_param:
            direct_matches = list(
                Listing.objects.filter(
                    (Q(city__icontains=city_param) | Q(location__icontains=city_param)) & category_filter
                ).prefetch_related('images', 'amenities', 'favorites').select_related('host').order_by('-is_guest_favorite', '-rating')
            )
            if not direct_matches and category_filter != Q():
                direct_matches = list(
                    Listing.objects.filter(
                        Q(city__icontains=city_param) | Q(location__icontains=city_param)
                    ).prefetch_related('images', 'amenities', 'favorites').select_related('host').order_by('-is_guest_favorite', '-rating')
                )

        # 4. Handle Direct Matches vs Nearest Distance Calculation
        popular_local_list = []
        nearby_weekend_list = []
        active_city_name = city_param.title() if city_param else 'Chandigarh'
        nearby_city_name = 'Zirakpur'
        popular_title = f"Popular homes in {active_city_name}"
        nearby_title = f"Available in {nearby_city_name} this weekend"

        if direct_matches:
            # Direct listings found in database for this exact city
            popular_local_list = direct_matches[:10]
            for l in popular_local_list:
                l.distance_km = None # In-city stay

            # Look up paired weekend city
            paired = NEARBY_PAIRS.get(active_city_name.lower())
            if paired:
                nearby_city_name = paired
                nearby_weekend_list = list(
                    Listing.objects.filter(
                        (Q(city__icontains=nearby_city_name) | Q(location__icontains=nearby_city_name)) & category_filter
                    ).prefetch_related('images', 'amenities', 'favorites').select_related('host').order_by('-is_guest_favorite', '-rating')[:10]
                )
            if not nearby_weekend_list:
                # Pick other authentic listings in DB
                other_qs = Listing.objects.exclude(city__icontains=active_city_name).filter(category_filter).prefetch_related('images', 'amenities', 'favorites').select_related('host').order_by('-rating')
                nearby_weekend_list = list(other_qs[:10])
                if nearby_weekend_list:
                    nearby_city_name = nearby_weekend_list[0].city

            if category_param == 'experiences':
                popular_title = f"Top retreat experiences in {active_city_name}"
                nearby_title = f"Weekend outdoor getaways in {nearby_city_name}"
            elif category_param == 'services':
                popular_title = f"Luxury serviced stays in {active_city_name}"
                nearby_title = f"Serviced villas in {nearby_city_name} this weekend"
            else:
                popular_title = f"Popular homes in {active_city_name}"
                nearby_title = f"Available in {nearby_city_name} this weekend"

        else:
            # City is not directly in DB -> Find NEAREST REAL DATABASE LISTINGS by distance
            all_db_listings = list(
                Listing.objects.filter(category_filter).prefetch_related('images', 'amenities', 'favorites').select_related('host')
            )
            if not all_db_listings:
                all_db_listings = list(
                    Listing.objects.all().prefetch_related('images', 'amenities', 'favorites').select_related('host')
                )

            if user_coords and all_db_listings:
                u_lat, u_lng = user_coords
                for l in all_db_listings:
                    l_lat = float(l.latitude) if l.latitude else 0.0
                    l_lng = float(l.longitude) if l.longitude else 0.0
                    if l_lat != 0.0 and l_lng != 0.0:
                        l.distance_km = haversine_distance(u_lat, u_lng, l_lat, l_lng)
                    else:
                        city_c = WORLD_CITY_COORDINATES.get(l.city.lower())
                        if city_c:
                            l.distance_km = haversine_distance(u_lat, u_lng, city_c[0], city_c[1])
                        else:
                            l.distance_km = 999.0

                # Sort authentic DB listings by geographic proximity
                all_db_listings.sort(key=lambda x: getattr(x, 'distance_km', 999.0))
                popular_local_list = all_db_listings[:8]
                nearby_weekend_list = all_db_listings[8:16] if len(all_db_listings) > 8 else all_db_listings[:8]

                closest_item = popular_local_list[0] if popular_local_list else None
                closest_city = closest_item.city if closest_item else 'Chandigarh'
                dist_note = f" ({closest_item.distance_km} km away)" if closest_item and closest_item.distance_km < 900 else ""

                popular_title = f"Popular stays near {active_city_name}{dist_note}"
                nearby_title = f"Weekend getaways near {active_city_name}"
                nearby_city_name = nearby_weekend_list[0].city if nearby_weekend_list else 'Getaway'

            else:
                # Fallback to top-rated default DB listings
                popular_local_list = all_db_listings[:10]
                for l in popular_local_list:
                    l.distance_km = None
                nearby_weekend_list = all_db_listings[5:15] if len(all_db_listings) > 5 else all_db_listings
                active_city_name = popular_local_list[0].city if popular_local_list else 'Chandigarh'
                nearby_city_name = nearby_weekend_list[0].city if nearby_weekend_list else 'Zirakpur'
                popular_title = f"Popular homes in {active_city_name}"
                nearby_title = f"Available in {nearby_city_name} this weekend"

        # 5. Query Trending Stays from DB
        trending_qs = Listing.objects.filter(category_filter).prefetch_related(
            'images', 'amenities', 'favorites'
        ).select_related('host').order_by('-is_guest_favorite', '-rating', '-review_count')[:12]
        if trending_qs.count() == 0:
            trending_qs = Listing.objects.all().prefetch_related('images', 'amenities', 'favorites').select_related('host').order_by('-rating')[:12]

        # 6. Format available real distinct cities in database
        distinct_cities = sorted(list({c.strip() for c in Listing.objects.values_list('city', flat=True) if c and c.strip()}))
        city_list = []
        for c in distinct_cities:
            city_list.append({
                'city': c,
                'nearby': NEARBY_PAIRS.get(c.lower(), 'Getaway'),
                'count': Listing.objects.filter(city__iexact=c).count()
            })

        return Response({
            'active_city': active_city_name,
            'nearby_city': nearby_city_name,
            'category': category_param,
            'sections': {
                'popular_local': {
                    'title': popular_title,
                    'city': active_city_name,
                    'count': len(popular_local_list),
                    'listings': ListingListSerializer(popular_local_list, many=True, context={'request': request}).data
                },
                'nearby_weekend': {
                    'title': nearby_title,
                    'city': nearby_city_name,
                    'count': len(nearby_weekend_list),
                    'listings': ListingListSerializer(nearby_weekend_list, many=True, context={'request': request}).data
                },
                'trending': {
                    'title': "Guest favourites and top rated stays" if category_param == 'all' else f"Top rated {category_param}",
                    'count': trending_qs.count(),
                    'listings': ListingListSerializer(trending_qs, many=True, context={'request': request}).data
                }
            },
            'available_cities': city_list
        })


class AmenityListView(generics.ListAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


# Host Dashboard Views
class HostListingsView(generics.ListAPIView):
    serializer_class = ListingListSerializer
    permission_classes = [permissions.IsAuthenticated, IsHost]

    def get_queryset(self):
        return Listing.objects.filter(host=self.request.user).prefetch_related('images', 'amenities').select_related('host')


class HostStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHost]

    def get(self, request):
        user = request.user
        host_listings = Listing.objects.filter(host=user)
        total_listings = host_listings.count()

        from apps.bookings.models import Booking
        host_bookings = Booking.objects.filter(listing__host=user)
        
        total_bookings = host_bookings.count()
        confirmed_bookings = host_bookings.filter(status='CONFIRMED').count()
        
        estimated_revenue = host_bookings.filter(
            status__in=['CONFIRMED', 'COMPLETED']
        ).aggregate(total=Sum('total_price'))['total'] or 0.00
        
        avg_rating = host_listings.aggregate(avg=Avg('rating'))['avg'] or 0.00

        return Response({
            'total_listings': total_listings,
            'total_bookings': total_bookings,
            'confirmed_bookings': confirmed_bookings,
            'estimated_revenue': float(estimated_revenue),
            'average_rating': round(float(avg_rating), 2)
        })
