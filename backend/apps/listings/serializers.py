from rest_framework import serializers
try:
    from apps.accounts.serializers import UserSerializer
except (ImportError, ModuleNotFoundError):
    from ..accounts.serializers import UserSerializer
from .models import Listing, ListingImage, Amenity

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ('id', 'name', 'icon')


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ('id', 'image_url', 'display_order')


class ListingListSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            'id', 'host', 'title', 'property_type', 'location', 'city', 'country',
            'latitude', 'longitude', 'price_per_night', 'cleaning_fee', 'service_fee',
            'max_guests', 'bedrooms', 'beds', 'bathrooms', 'rating', 'review_count',
            'is_guest_favorite', 'images', 'is_favorite', 'distance_km', 'created_at'
        )

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def get_distance_km(self, obj):
        return getattr(obj, 'distance_km', None)


class ListingDetailSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            'id', 'host', 'title', 'description', 'property_type', 'location', 'city', 'country',
            'latitude', 'longitude', 'price_per_night', 'cleaning_fee', 'service_fee',
            'max_guests', 'bedrooms', 'beds', 'bathrooms', 'rating', 'review_count',
            'is_guest_favorite', 'images', 'amenities', 'is_favorite', 'distance_km', 'created_at', 'updated_at'
        )

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user).exists()
        return False

    def get_distance_km(self, obj):
        return getattr(obj, 'distance_km', None)


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    image_urls = serializers.ListField(
        child=serializers.URLField(), write_only=True, required=False
    )
    amenity_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )

    class Meta:
        model = Listing
        fields = (
            'id', 'title', 'description', 'property_type', 'location', 'city', 'country',
            'latitude', 'longitude', 'price_per_night', 'cleaning_fee', 'service_fee',
            'max_guests', 'bedrooms', 'beds', 'bathrooms', 'is_guest_favorite', 'image_urls', 'amenity_ids'
        )

    def create(self, validated_data):
        image_urls = validated_data.pop('image_urls', [])
        amenity_ids = validated_data.pop('amenity_ids', [])
        
        request = self.context.get('request')
        validated_data['host'] = request.user
        
        listing = Listing.objects.create(**validated_data)
        
        if amenity_ids:
            listing.amenities.set(amenity_ids)
            
        for order, url in enumerate(image_urls):
            ListingImage.objects.create(
                listing=listing,
                image_url=url,
                display_order=order
            )
            
        return listing

    def update(self, instance, validated_data):
        image_urls = validated_data.pop('image_urls', None)
        amenity_ids = validated_data.pop('amenity_ids', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if amenity_ids is not None:
            instance.amenities.set(amenity_ids)

        if image_urls is not None:
            instance.images.all().delete()
            for order, url in enumerate(image_urls):
                ListingImage.objects.create(
                    listing=instance,
                    image_url=url,
                    display_order=order
                )

        return instance
