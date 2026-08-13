from rest_framework import viewsets, generics, permissions, status
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
