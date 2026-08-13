from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'listing', 'guest', 'check_in', 'check_out', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'check_in', 'check_out')
    search_fields = ('listing__title', 'guest__email', 'guest__name')
    ordering = ('-created_at',)
