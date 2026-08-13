from django.contrib import admin
from .models import Listing, ListingImage, Amenity

class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'city', 'country', 'price_per_night', 'rating', 'review_count', 'created_at')
    list_filter = ('property_type', 'city', 'country')
    search_fields = ('title', 'description', 'city', 'country', 'host__email')
    inlines = [ListingImageInline]
