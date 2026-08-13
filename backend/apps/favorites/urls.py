from django.urls import path
from .views import FavoriteListCreateDeleteView

urlpatterns = [
    path('', FavoriteListCreateDeleteView.as_view(), name='favorite_list'),
    path('<uuid:listing_id>/', FavoriteListCreateDeleteView.as_view(), name='favorite_detail'),
]
