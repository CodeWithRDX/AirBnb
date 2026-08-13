from rest_framework import permissions
from .models import User

class IsHost(permissions.BasePermission):
    """
    Allows access only to users registered as HOST or ADMIN.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in [User.Role.HOST, User.Role.ADMIN] or request.user.is_staff)
        )


class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to ADMIN users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.Role.ADMIN or request.user.is_staff)
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check listing host
        if hasattr(obj, 'host'):
            return obj.host == request.user
        # Check user directly
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check guest
        if hasattr(obj, 'guest'):
            return obj.guest == request.user
            
        return False
