# Import from Django Rest Framework
from rest_framework import permissions

# Import from core
from .models import User


class UserPermission(permissions.BasePermission):
    """A Permission class that defines whether a user can view or act on User objects."""

    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user.is_authenticated and request.user.is_staff
        elif view.action == 'create':
            return True
        elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return obj == request.user or request.user.is_staff
        elif view.action in ['update', 'partial_update']:
            return obj == request.user or request.user.is_staff
        elif view.action == 'destroy':
            return obj == request.user or request.user.is_staff
        else:
            return False


class HostPermission(permissions.BasePermission):
    """A Permission class that defines whether a user can view or act on Host objects."""

    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user.is_authenticated
        elif view.action == 'create':
            return request.user.is_authenticated
        elif view.action in ['retrieve', 'update', 'partial_update', 'destroy', 'add_admin']:
            return request.user.is_authenticated
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return request.user.is_authenticated
        elif view.action in ['update', 'partial_update', 'add_admin']:
            admins = obj.admins.all()
            return request.user in admins
        elif view.action == 'destroy':
            admins = obj.admins.all()
            return request.user in admins
        else:
            return False


class EventPermission(permissions.BasePermission):
    """A Permission class that defines whether a user can view or act on Event objects."""

    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user.is_authenticated
        elif view.action == 'create':
            return request.user.is_authenticated
        elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return request.user.is_authenticated
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return request.user.is_authenticated
        elif view.action in ['update', 'partial_update']:
            admins = User.objects.filter(admin_of__events_hosting=obj)
            return request.user in admins
        elif view.action == 'destroy':
            admins = User.objects.filter(admin_of__events_hosting=obj)
            return request.user in admins
        else:
            return False

class AddAdminPermission(permissions.BasePermission):
    """A Permission class that defines whether a user can add an admin to a Host object."""

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        admins = obj.admins.all()
        return request.user in admins
