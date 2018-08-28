# Import from Django
from django.shortcuts import get_object_or_404
import djoser.views
import djoser.signals
import djoser.utils
from djoser.compat import get_user_email
from djoser.conf import settings as djoser_settings

# Import from Django Rest Framework
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status

# Import from core
from .models import User, UserCategory, HostCategory, EventCategory
from .serializers import UserCategoryChildrenSerializer, HostSerializer,\
    HostSerializerWithAdmins, HostCategoryChildrenSerializer, EventSerializer, EventCategoryChildrenSerializer,\
    EmailSerializer
from .filters import hosts_filter, events_filter, OptionalEventsFilters, OptionalHostsFilters
from .permissions import HostPermission, EventPermission, AddAdminPermission

# Import from rest_framework_tracking
from rest_framework_tracking.mixins import LoggingMixin


class UserCategoryViewSet(viewsets.ViewSet):

    permission_classes = ()

    def list(self, request):
        """Returns the tree of all user categories via GET. Allows any."""

        queryset = UserCategory.objects.filter(parent=None)
        serializer = UserCategoryChildrenSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data)

    def retrieve(self, request, pk):
        """Returns a particular branch of user categories via GET. Allows any."""

        queryset = UserCategory.objects.all()
        category = get_object_or_404(queryset, pk=pk)
        serializer = UserCategoryChildrenSerializer(category, context={'request':request})
        return Response(serializer.data)


class HostViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    Return the given host via GET. Authenticated only. If user is an admin of that host, an extra 'admins' field is
    shown.

    list:
    Return a list of all hosts via GET. Authenticated only.

    create:
    Create a new host via POST. Authenticated only.

    update:
    Update a host via PUT. Host admins only.

    partial_update:
    Partially update a host via PATCH. Host admins only.

    delete:
    Deletes host via DELETE. Host admins only.

    add_admin:
    Adds a new admin of the host via POST. Host admins only.
    """

    permission_classes = (HostPermission,)

    def get_queryset(self):
        user_category = self.request.user.user_category
        return hosts_filter(user_category=user_category)

    filterset_class = OptionalHostsFilters

    def get_serializer_class(self):
        if self.action in ['list', 'create', 'retrieve', 'update', 'partial_update', 'destroy']:
            try:
                if any([self.request.user == admin for admin in self.get_object().admins.all()]):
                    return HostSerializerWithAdmins
                else:
                    return HostSerializer
            except:
                return HostSerializer
        elif self.action == 'add_admin':
            return EmailSerializer
        elif self.action == 'make_admin':
            return djoser_settings.SERIALIZERS.activation
        else:
            return HostSerializer

    def get_throttles(self):
        if self.action in ['add_admin']:
            self.throttle_scope = 'add_admin'
        return super().get_throttles()

    @action(methods=['post'], detail=True, permission_classes=[AddAdminPermission,])
    def add_admin(self, request, pk=None):
        """Accepts an email address, validates it, and if a corresponding user can be
        found, adds that user as an admin to the host."""

        host = self.get_object()
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.data['email'])
            host.admins.add(user)
            host_name = host.name
            context = {'user': user, 'host_name': host_name}
            to = [get_user_email(user)]
            djoser_settings.EMAIL.admin_confirmation(self.request, context).send(to)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_204_NO_CONTENT)


class HostCategoryViewSet(viewsets.ViewSet):

    def list(self, request):
        """Returns the tree of all host categories via GET. Allows any."""

        queryset = HostCategory.objects.filter(parent=None)
        serializer = HostCategoryChildrenSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data)

    def retrieve(self, request, pk):
        """Returns a particular branch of host categories via GET. Allows any."""

        queryset = HostCategory.objects.all()
        category = get_object_or_404(queryset, pk=pk)
        serializer = HostCategoryChildrenSerializer(category, context={'request':request})
        return Response(serializer.data)


class EventViewSet(LoggingMixin, viewsets.ModelViewSet):
    """
        retrieve:
        Returns the given event via GET. Authenticated only.

        list:
        Returns a list of all events via GET. Authenticated only.

        create:
        Create a new event via POST. Host admins only.

        update:
        Update an event via PUT. Host admins only.

        partial_update:
        Partially update an event via PATCH. Host admins only.

        delete:
        Deletes event via DELETE. Host admins only.
    """

    permission_classes = (EventPermission,)

    def get_queryset(self):
        user_category = self.request.user.user_category
        return events_filter(user_category=user_category, user=self.request.user)

    serializer_class = EventSerializer

    filterset_class = OptionalEventsFilters


class EventCategoryViewSet(viewsets.ViewSet):

    def list(self, request):
        """Returns the tree of all event categories via GET. Allows any."""

        queryset = EventCategory.objects.filter(parent=None)
        serializer = EventCategoryChildrenSerializer(queryset, many=True, context={'request':request})
        return Response(serializer.data)

    def retrieve(self, request, pk):
        """Returns a particular branch of event categories via GET. Allows any."""

        queryset = EventCategory.objects.all()
        category = get_object_or_404(queryset, pk=pk)
        serializer = EventCategoryChildrenSerializer(category, context={'request':request})
        return Response(serializer.data)


class UserViewSet(djoser.views.UserViewSet):
    """
        retrieve:
        Returns the given user via GET. Only the associated user is permitted.

        list:
        Returns a list of all events via GET. Superuser only.

        create:
        Create a new event via POST. Allows any.

        update:
        Update an event via PUT. Only the associated user is permitted.

        partial_update:
        Partially update an event via PATCH. Only the associated user is permitted.

        delete:
        Deletes event via DELETE. Only the associated user is permitted.
    """

    @action(methods=['post'], detail=False)
    def confirm(self, request, *args, **kwargs):
        """Overrides the confirm custom action defined in djoser.views.UserViewSet. Takes a unique user identifier
        (UUID) and a token, both given by the inherited create action, and activates the user's account. Returns a login
        token."""

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        user.is_active = True
        user.save()

        djoser.signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        if djoser_settings.SEND_CONFIRMATION_EMAIL:
            context = {'user': user}
            to = [get_user_email(user)]
            djoser_settings.EMAIL.confirmation(self.request, context).send(to)

        token = djoser.utils.login_user(self.request, user)
        token_serializer_class = djoser_settings.SERIALIZERS.token
        return Response(
            data=token_serializer_class(token).data,
            status=status.HTTP_200_OK,
        )


class SetPasswordView(djoser.views.SetPasswordView):
    """Use this endpoint to change user password."""

    pass


class PasswordResetView(djoser.views.PasswordResetView):
    """Use this endpoint to send email to user with password reset link."""

    pass


class PasswordResetConfirmView(djoser.views.PasswordResetConfirmView):
    """Use this endpoint to finish reset password process."""

    pass
