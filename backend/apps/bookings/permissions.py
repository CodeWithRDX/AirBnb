from rest_framework import permissions

class IsBookingParticipant(permissions.BasePermission):
    """
    Object-level permission allowing only the guest who made the booking
    or the host of the booked property to access the booking.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        return (
            obj.guest == request.user or
            obj.listing.host == request.user or
            request.user.is_staff
        )
