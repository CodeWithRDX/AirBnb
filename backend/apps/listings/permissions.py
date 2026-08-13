from rest_framework import permissions
from apps.accounts.models import User

class IsHostOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow read-only for public, and creation only for Hosts/Admins.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in [User.Role.HOST, User.Role.ADMIN] or request.user.is_staff)
        )


class IsListingOwner(permissions.BasePermission):
    """
    Custom permission to only allow the host owner of a listing to modify or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (obj.host == request.user or request.user.is_staff)
        )
