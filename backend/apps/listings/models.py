import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Amenity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, help_text="Lucide icon name, e.g. Wifi, Tv, Pool")

    class Meta:
        verbose_name_plural = "Amenities"
        ordering = ['name']

    def __str__(self):
        return self.name


class Listing(models.Model):
    PROPERTY_TYPES = [
        ('Apartment', 'Apartment'),
        ('Villa', 'Villa'),
        ('Cabin', 'Cabin'),
        ('Beachfront', 'Beachfront'),
        ('Countryside', 'Countryside'),
        ('Mansion', 'Mansion'),
        ('Lakehouse', 'Lakehouse'),
        ('Treehouse', 'Treehouse'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    property_type = models.CharField(max_length=50, choices=PROPERTY_TYPES, default='Apartment')
    
    location = models.CharField(max_length=255, help_text="Detailed location or address string")
    city = models.CharField(max_length=100, db_index=True)
    country = models.CharField(max_length=100, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00)])
    
    max_guests = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    bedrooms = models.PositiveIntegerField(default=1)
    beds = models.PositiveIntegerField(default=1)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, default=1.0, validators=[MinValueValidator(0.5)])
    
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00, validators=[MinValueValidator(0.00), MaxValueValidator(5.00)])
    review_count = models.PositiveIntegerField(default=0)
    
    amenities = models.ManyToManyField(Amenity, related_name='listings', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.city}, {self.country}"

    def update_rating_stats(self):
        """Recalculates average rating and review count from related reviews."""
        reviews = self.reviews.all()
        count = reviews.count()
        if count > 0:
            total_score = sum(r.rating for r in reviews)
            self.rating = round(total_score / count, 2)
            self.review_count = count
        else:
            self.rating = 0.00
            self.review_count = 0
        self.save(update_fields=['rating', 'review_count'])


class ListingImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=1024)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f"Image for {self.listing.title} ({self.display_order})"
