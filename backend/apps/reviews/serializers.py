from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from .models import Review
from apps.bookings.models import Booking

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'listing', 'user', 'booking', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'listing', 'user', 'created_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    booking_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Review
        fields = ('booking_id', 'rating', 'comment')

    def validate(self, attrs):
        booking_id = attrs['booking_id']
        request = self.context['request']
        listing_id = self.context['view'].kwargs.get('listing_id')

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            raise serializers.ValidationError({"booking_id": "Booking does not exist."})

        if booking.guest != request.user:
            raise serializers.ValidationError({"booking_id": "You can only review stays booked by yourself."})

        if str(booking.listing.id) != str(listing_id):
            raise serializers.ValidationError({"booking_id": "Booking does not match this listing."})

        if hasattr(booking, 'review'):
            raise serializers.ValidationError({"booking_id": "A review has already been submitted for this booking."})

        attrs['booking'] = booking
        attrs['listing'] = booking.listing
        return attrs

    def create(self, validated_data):
        validated_data.pop('booking_id')
        user = self.context['request'].user
        review = Review.objects.create(user=user, **validated_data)
        return review
