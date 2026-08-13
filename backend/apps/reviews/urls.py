from django.urls import path
from .views import ListingReviewListView

urlpatterns = [
    path('<uuid:listing_id>/', ListingReviewListView.as_view(), name='listing_reviews'),
]
