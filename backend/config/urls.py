from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

def health_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    path('api/health/', health_check, name='api_health_check'),

    # Standard API endpoints with /api/ prefix
    path('api/auth/', include('apps.accounts.urls')),
    path('api/listings/', include('apps.listings.urls')),
    path('api/bookings/', include('apps.bookings.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/favorites/', include('apps.favorites.urls')),
    path('api/host/', include('apps.listings.host_urls')),

    # Direct aliases without /api/ prefix for backwards compatibility
    path('auth/', include('apps.accounts.urls')),
    path('listings/', include('apps.listings.urls')),
    path('bookings/', include('apps.bookings.urls')),
    path('reviews/', include('apps.reviews.urls')),
    path('favorites/', include('apps.favorites.urls')),
    path('host/', include('apps.listings.host_urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
