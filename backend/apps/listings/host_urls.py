from django.urls import path
from .views import HostListingsView, HostStatsView

urlpatterns = [
    path('listings/', HostListingsView.as_view(), name='host_listings'),
    path('stats/', HostStatsView.as_view(), name='host_stats'),
]
