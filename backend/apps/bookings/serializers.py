from rest_framework import serializers
from apps.listings.serializers import ListingListSerializer
from apps.accounts.serializers import UserSerializer
from .models import Booking
from .services import create_booking_service

class BookingSerializer(serializers.ModelSerializer):
    listing = ListingListSerializer(read_only=True)
    guest = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'listing', 'guest', 'check_in', 'check_out',
            'guests', 'nights', 'subtotal', 'cleaning_fee',
            'service_fee', 'total_price', 'status', 'created_at', 'updated_at'
        )


class BookingCreateSerializer(serializers.Serializer):
    listing_id = serializers.UUIDField()
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    guests = serializers.IntegerField(min_value=1)

    def validate(self, attrs):
        check_in = attrs['check_in']
        check_out = attrs['check_out']
        if check_in >= check_out:
            raise serializers.ValidationError({"check_out": "Check-out date must be after check-in date."})
        return attrs

    def create(self, validated_data):
        guest = self.context['request'].user
        try:
            booking = create_booking_service(
                guest=guest,
                listing_id=validated_data['listing_id'],
                check_in=validated_data['check_in'],
                check_out=validated_data['check_out'],
                guests_count=validated_data['guests']
            )
            return booking
        except Exception as e:
            raise serializers.ValidationError({"non_field_errors": [str(e)]})
