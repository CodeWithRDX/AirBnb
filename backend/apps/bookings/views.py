from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer
from .permissions import IsBookingParticipant
from apps.accounts.permissions import IsHost

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsBookingParticipant]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Booking.objects.none()
        # Returns bookings where user is the guest OR host of the listing
        return Booking.objects.filter(
            guest=user
        ) | Booking.objects.filter(
            listing__host=user
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingSerializer(booking, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my')
    def my_bookings(self, request):
        """Returns bookings made by current logged in user as guest."""
        bookings = Booking.objects.filter(guest=request.user).select_related('listing', 'listing__host').prefetch_related('listing__images')
        serializer = BookingSerializer(bookings, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='host')
    def host_bookings(self, request):
        """Returns bookings made on properties owned by current user as host."""
        if not request.user.role in ['HOST', 'ADMIN'] and not request.user.is_staff:
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
        bookings = Booking.objects.filter(listing__host=request.user).select_related('listing', 'guest').prefetch_related('listing__images')
        serializer = BookingSerializer(bookings, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        
        # Check permissions: only guest or host can cancel
        if booking.guest != request.user and booking.listing.host != request.user and not request.user.is_staff:
            return Response({'detail': 'Not allowed to cancel this booking.'}, status=status.HTTP_403_FORBIDDEN)
            
        if booking.status == Booking.Status.CANCELLED:
            return Response({'detail': 'Booking is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
            
        booking.status = Booking.Status.CANCELLED
        booking.save()
        
        return Response(BookingSerializer(booking, context={'request': request}).data, status=status.HTTP_200_OK)
