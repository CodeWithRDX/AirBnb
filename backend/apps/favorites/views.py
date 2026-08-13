from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Favorite
from .serializers import FavoriteSerializer
from apps.listings.models import Listing

class FavoriteListCreateDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('listing', 'listing__host').prefetch_related('listing__images')
        serializer = FavoriteSerializer(favorites, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, listing_id=None):
        listing = get_object_or_404(Listing, id=listing_id)
        favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if created:
            return Response(FavoriteSerializer(favorite, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Listing already in favorites'}, status=status.HTTP_200_OK)

    def delete(self, request, listing_id=None):
        listing = get_object_or_404(Listing, id=listing_id)
        favorite = Favorite.objects.filter(user=request.user, listing=listing).first()
        if favorite:
            favorite.delete()
            return Response({'message': 'Listing removed from favorites'}, status=status.HTTP_200_OK)
        return Response({'message': 'Favorite not found'}, status=status.HTTP_404_NOT_FOUND)
