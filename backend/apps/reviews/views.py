from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from apps.listings.models import Listing

class ListingReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        listing_id = self.kwargs.get('listing_id')
        return Review.objects.filter(listing_id=listing_id).select_related('user')

    def create(self, request, *args, **kwargs):
        serializer = ReviewCreateSerializer(data=request.data, context={'request': request, 'view': self})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
