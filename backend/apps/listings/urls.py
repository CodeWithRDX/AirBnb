from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, AmenityListView

router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = [
    path('amenities/', AmenityListView.as_view(), name='amenities_list'),
    path('', include(router.urls)),
]
