from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

def set_jwt_cookies(response, refresh_token, access_token):
    max_age_refresh = settings.REFRESH_DAYS * 24 * 60 * 60
    max_age_access = settings.ACCESS_MINUTES * 60
    
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        httponly=True,
        secure=not settings.DEBUG,
        samesite='Lax',
        max_age=max_age_refresh
    )
    response.set_cookie(
        key='access_token',
        value=str(access_token),
        httponly=True,
        secure=not settings.DEBUG,
        samesite='Lax',
        max_age=max_age_access
    )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            response = Response({
                'user': UserSerializer(user).data,
                'access': access_token,
                'refresh': str(refresh),
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
            
            set_jwt_cookies(response, refresh, access_token)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            response = Response({
                'user': UserSerializer(user).data,
                'access': access_token,
                'refresh': str(refresh),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
            
            set_jwt_cookies(response, refresh, access_token)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh') or request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        response = Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Extract from cookie if not in body
        if 'refresh' not in request.data and 'refresh_token' in request.COOKIES:
            request.data['refresh'] = request.COOKIES['refresh_token']
            
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            if access_token:
                max_age_access = settings.ACCESS_MINUTES * 60
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    max_age=max_age_access
                )
        return response


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
