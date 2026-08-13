from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom authentication class to extract JWT access token from HTTP-only cookie
    if header authentication is not present.
    """
    def authenticate(self, request):
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
            if raw_token is not None:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token
        
        # Fallback to checking HTTP-only cookie
        raw_token = request.COOKIES.get('access_token')
        if raw_token:
            try:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token
            except exceptions.AuthenticationFailed:
                return None

        return None
