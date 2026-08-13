import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.listings.models import Listing
from apps.bookings.models import Booking

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review')
    
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['booking'], name='unique_booking_review')
        ]

    def __str__(self):
        return f"Review ({self.rating}★) by {self.user.name} for {self.listing.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Automatically recalculate listing average rating and review count
        self.listing.update_rating_stats()

    def delete(self, *args, **kwargs):
        listing = self.listing
        super().delete(*args, **kwargs)
        listing.update_rating_stats()
