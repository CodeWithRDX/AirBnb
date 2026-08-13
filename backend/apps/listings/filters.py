import django_filters
from django.db.models import Q
from .models import Listing

class ListingFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(method='filter_location')
    city = django_filters.CharFilter(lookup_expr='icontains')
    country = django_filters.CharFilter(lookup_expr='icontains')
    property_type = django_filters.CharFilter(lookup_expr='iexact')
    
    min_price = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='lte')
    
    guests = django_filters.NumberFilter(field_name='max_guests', lookup_expr='gte')
    bedrooms = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    beds = django_filters.NumberFilter(field_name='beds', lookup_expr='gte')
    bathrooms = django_filters.NumberFilter(field_name='bathrooms', lookup_expr='gte')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    
    amenities = django_filters.CharFilter(method='filter_amenities')
    
    check_in = django_filters.DateFilter(method='filter_availability')
    check_out = django_filters.DateFilter(method='filter_availability')

    class Meta:
        model = Listing
        fields = [
            'location', 'city', 'country', 'property_type',
            'min_price', 'max_price', 'guests', 'bedrooms',
            'beds', 'bathrooms', 'min_rating'
        ]

    def filter_location(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(city__icontains=value) |
            Q(country__icontains=value) |
            Q(location__icontains=value) |
            Q(title__icontains=value)
        )

    def filter_amenities(self, queryset, name, value):
        if not value:
            return queryset
        # Handle comma-separated amenity IDs or names
        amenity_list = [a.strip() for a in value.split(',') if a.strip()]
        for amenity in amenity_list:
            queryset = queryset.filter(
                Q(amenities__id__iexact=amenity) | Q(amenities__name__iexact=amenity)
            )
        return queryset.distinct()

    def filter_availability(self, queryset, name, value):
        data = self.request.GET if self.request else {}
        check_in = data.get('check_in')
        check_out = data.get('check_out')

        if check_in and check_out:
            # Filter out listings that have an active booking overlapping with (check_in, check_out)
            overlapping_listings = queryset.filter(
                bookings__status__in=['PENDING', 'CONFIRMED'],
                bookings__check_in__lt=check_out,
                bookings__check_out__gt=check_in
            ).values_list('id', flat=True)

            return queryset.exclude(id__in=overlapping_listings)
        
        return queryset
