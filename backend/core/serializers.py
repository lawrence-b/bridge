# Import from core
from .models import User, UserCategory, Host, HostCategory, Event, EventCategory

# Import from Django Rest Framework
from rest_framework import serializers

# Import from additional packages
from versatileimagefield.serializers import VersatileImageFieldSerializer
from djoser import serializers as djoser_serializers
from djoser.compat import get_user_email, get_user_email_field_name
from djoser.conf import settings


class UserCategoryChildrenSerializer(serializers.ModelSerializer):
    """Serializes UserCategory object, along with all children categories of that UserCategory object. Used to create a
    dropdown list of all possible user categories that can be selected, and to show to which user categories a host or
    event is open to."""

    children = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = UserCategory
        fields = ('id', 'name', 'thumbnail', 'children',)  # add here rest of the fields from model

    def get_children(self, obj):
        """Defines the recursive serialization of children categories."""
        if obj.children is not None:
            return UserCategoryChildrenSerializer(obj.children, many=True, context=self.context).data
        else:
            return None


class UserCategoryParentSerializer(serializers.ModelSerializer):
    """Serializes UserCategory object, along with all parent categories of that UserCategory object. Used to show the
    user categories to which a user belongs."""

    parent = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = UserCategory
        fields = ('id', 'name', 'thumbnail', 'parent',)

    def get_parent(self, obj):
        """Defines the recursive serialization of parent categories."""
        if obj.parent is not None:
            return UserCategoryParentSerializer(obj.parent, context={'request': self.context['request']}).data
        else:
            return None


class HostCategoryChildrenSerializer(serializers.ModelSerializer):
    """Serializes HostCategory object, along with all children categories of that HostCategory object. Used to create a
    dropdown list of all possible host categories that can be selected."""

    children = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = HostCategory
        fields = ('id', 'name', 'thumbnail', 'children',)  # add here rest of the fields from model

    def get_children(self, obj):
        """Defines the recursive serialization of children categories."""
        if obj.children is not None:
            return HostCategoryChildrenSerializer(obj.children, many=True, context=self.context).data
        else:
            return None


class HostCategoryParentSerializer(serializers.ModelSerializer):
    """Serializes HostCategory object, along with all parent categories of that HostCategory object. Used to show all
    the host categories to which a host belongs."""

    parent = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = HostCategory
        fields = ('id', 'name', 'thumbnail', 'parent',)

    def get_parent(self, obj):
        """Defines the recursive serialization of parent categories."""
        if obj.parent is not None:
            return HostCategoryParentSerializer(obj.parent, context={'request': self.context['request']}).data
        else:
            return None


class EventCategoryChildrenSerializer(serializers.ModelSerializer):
    """Serializes EventCategory object, along with all children categories of that EventCategory object. Used to create
    a dropdown list of all possible event categories that can be selected."""

    children = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = EventCategory
        fields = ('id', 'name', 'thumbnail', 'children',)  # add here rest of the fields from model

    def get_children(self, obj):
        """Defines the recursive serialization of children categories."""
        if obj.children is not None:
            return EventCategoryChildrenSerializer(obj.children, many=True, context=self.context).data
        else:
            return None


class EventCategoryParentSerializer(serializers.ModelSerializer):
    """Serializes EventCategory object, along with all parent categories of that EventCategory object. Used to show all
    the event categories to which an event belongs."""

    parent = serializers.SerializerMethodField()

    thumbnail = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
        ]
    )

    class Meta:
        """Defines the source model and the fields to be serialized."""
        model = EventCategory
        fields = ('id', 'name', 'thumbnail', 'parent',)

    def get_parent(self, obj):
        """Defines the recursive serialization of parent categories."""
        if obj.parent is not None:
            return EventCategoryParentSerializer(obj.parent, context={'request': self.context['request']}).data
        else:
            return None


class UserBasicInfoSerializer(serializers.ModelSerializer):
    """Serializes User object, displaying only basic information. Used to display user details when user information
    is requested by any view other than UserViewSet."""

    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only."""
        model = User
        fields = (
            'id',
            'email',
        )
        extra_kwargs = {
            'id': {'read_only': True },
            'email': {'read_only': True},
        }


class HostBasicInfoSerializer(serializers.ModelSerializer):
    """Serializes Host object, displaying only basic information. Used to display host details when host information
        is requested by any view other than HostViewSet."""

    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only."""
        model = Host
        fields = (
            'id',
            'name',
        )


class EventBasicInfoSerializer(serializers.ModelSerializer):
    """Serializes Event object, displaying only basic information. Used to display event details when event information
    is requested by any view other than EventViewSet."""

    category = EventCategoryParentSerializer(read_only=True)

    duration = serializers.DurationField(read_only=True)

    open_to = UserCategoryChildrenSerializer(read_only=True)
    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only."""

        model = Event
        fields = (
            'id',
            'title',
            'category',
            'start_time',
            'duration',
            'location',
            'open_to',
        )


class EventSerializer(serializers.ModelSerializer):
    """Serializes Event object, displaying all information. Used to display event details for the EventViewSet views."""

    hosts = HostBasicInfoSerializer(read_only=True, many=True)
    hosts_id = serializers.PrimaryKeyRelatedField(queryset=Host.objects.all(), source='hosts', write_only=True,
                                                  many=True)

    category = EventCategoryParentSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=EventCategory.objects.all(), source='category',
                                                     write_only=True)

    open_to = UserCategoryChildrenSerializer(read_only=True)
    open_to_id = serializers.PrimaryKeyRelatedField(queryset=UserCategory.objects.all(), source='open_to',
                                                    write_only=True, required=False)

    duration = serializers.DurationField(read_only=True)

    image = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
            ('thumbnail', 'thumbnail__100x100'),
            ('medium_square_crop', 'crop__400x400'),
            ('small_square_crop', 'crop__50x50')
        ],
        required=False,
    )

    interested_in_check = serializers.SerializerMethodField()

    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only, or are not required."""

        model = Event
        fields = (
            'id',
            'title',
            'hosts_id',
            'hosts',
            'category',
            'category_id',
            'start_time',
            'end_time',
            'duration',
            'location',
            'description',
            'image',
            'image_ppoi',
            'open_to',
            'open_to_id',
            'interested_in_check',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'image_ppoi': {'read_only': False, 'required': False},
        }

    def get_interested_in_check(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            return obj in user.interested_in.all()
        else:
            return False


class HostSerializerWithAdmins(serializers.ModelSerializer):
    """Serializes Host object, displaying all information including the host's admins. Used to display host details for
     the HostViewSet views when the user is an admin of that particular host."""

    category = HostCategoryParentSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=HostCategory.objects.all(), source='category',
                                                     write_only=True)

    events_hosting_in_future = EventBasicInfoSerializer(read_only=True, many=True)

    admins = UserBasicInfoSerializer(read_only=True, many=True)
    admins_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='admins', write_only=True,
                                                   many=True,)

    open_to = UserCategoryChildrenSerializer(read_only=True)
    open_to_id = serializers.PrimaryKeyRelatedField(queryset=UserCategory.objects.all(), source='open_to',
                                                    write_only=True)

    image = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
            ('thumbnail', 'thumbnail__100x100'),
            ('medium_square_crop', 'crop__400x400'),
            ('small_square_crop', 'crop__50x50')
        ],
        required=False,
    )

    subscribed_to_check = serializers.SerializerMethodField()

    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only, or are not required."""

        model = Host
        fields = (
            'id',
            'name',
            'category_id',
            'category',
            'events_hosting_in_future',
            'admins',
            'description',
            'website',
            'image',
            'image_ppoi',
            'open_to',
            'open_to_id',
            'subscribed_to_check',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'image_ppoi': {'read_only': False},
        }

    def get_subscribed_to_check(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            return obj in user.subscribed_to.all()
        else:
            return False


class HostSerializer(serializers.ModelSerializer):
    """Serializes Host object, displaying all information except the host's admins. Used to display host details for
    the HostViewSet views when the user is not an admin of that particular host."""

    category = HostCategoryParentSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=HostCategory.objects.all(), source='category',
                                                     write_only=True)

    events_hosting_in_future = EventBasicInfoSerializer(read_only=True, many=True)

    admins_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='admins', write_only=True,
                                                   many=True, )

    open_to = UserCategoryChildrenSerializer(read_only=True)
    open_to_id = serializers.PrimaryKeyRelatedField(queryset=UserCategory.objects.all(), source='open_to',
                                                    write_only=True)

    image = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
            ('thumbnail', 'thumbnail__100x100'),
            ('medium_square_crop', 'crop__400x400'),
            ('small_square_crop', 'crop__50x50')
        ],
        required=False,
    )

    subscribed_to_check = serializers.SerializerMethodField()

    class Meta:
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only, or are not required."""

        model = Host
        fields = (
            'id',
            'name',
            'category_id',
            'category',
            'events_hosting_in_future',
            'admins_id',
            'description',
            'website',
            'image',
            'image_ppoi',
            'open_to',
            'open_to_id',
            'subscribed_to_check',
        )
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def get_subscribed_to_check(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            return obj in user.subscribed_to.all()
        else:
            return False


class EmailSerializer(serializers.Serializer):
    """Serializes an email address. Used when adding admins to a host in the add_admin custom action of HostViewSet."""

    email = serializers.EmailField()


class UserCreateSerializer(djoser_serializers.UserCreateSerializer, serializers.ModelSerializer):
    """Serializes User object. Used in the creation of new users by the create method of UserViewSet. Inherits from
    djoser.serializers.UserCreateSerializer."""

    class Meta(djoser_serializers.UserCreateSerializer.Meta):
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only, or are not required. Inherits fields from djoser.serializers.UserCreateSerializer."""

        djoser_serializers.UserCreateSerializer.Meta.fields += ('user_category',)


class UserSerializer(djoser_serializers.UserSerializer, serializers.ModelSerializer):
    """Serializes User object. Used to display user information for all views except create in UserViewSet . Inherits
    from djoser.serializers.UserCreateSerializer."""

    admin_of = HostBasicInfoSerializer(read_only=True, many=True)

    user_category = UserCategoryParentSerializer(read_only=True)
    user_category_id = serializers.PrimaryKeyRelatedField(queryset=UserCategory.objects.all(), write_only=True,
                                                          source='user_category', required=False)

    currently_interested_in = EventBasicInfoSerializer(read_only=True, many=True)
    currently_going_to = EventBasicInfoSerializer(read_only=True, many=True)

    subscribed_to = HostBasicInfoSerializer(read_only=True, many=True)
    subscribed_to_id = serializers.PrimaryKeyRelatedField(queryset=Host.objects.all(), write_only=True, many=True,
                                                          source='subscribed_to', required=False)

    add_interested_in = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), write_only=True, many=True, required=False)
    remove_interested_in = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), write_only=True, many=True, required=False)

    class Meta(djoser_serializers.UserSerializer.Meta):
        """Defines the source model and the fields to be serialized. May additionally specify whether any fields are
        read or write only, or are not required. Inherits fields from djoser.serializers.UserCreateSerializer."""

        djoser_serializers.UserSerializer.Meta.fields += (
            'user_category',
            'admin_of',
            'user_category_id',
            'user_category',
            'currently_interested_in',
            'currently_going_to',
            'subscribed_to_id',
            'subscribed_to',
            'add_interested_in',
            'remove_interested_in',
        )
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'required': False},
            'password': {'write_only': True, 'required': False},
        }

    def update(self, instance, validated_data):
        """A custom update method which defines how serialized data is saved into storage when an update or
        partial_update view is called."""

        email_field = get_user_email_field_name(User)
        if settings.SEND_ACTIVATION_EMAIL and email_field in validated_data:
            instance_email = get_user_email(instance)
            if instance_email != validated_data[email_field]:
                instance.is_active = False
                instance.save(update_fields=['is_active'])

        # Now update interested_in
        add_interested_in = validated_data.get('add_interested_in')
        if add_interested_in is not None:
            for event in add_interested_in:
                instance.interested_in.add(event)

        remove_interested_in = validated_data.get('remove_interested_in')
        if remove_interested_in is not None:
            for event in remove_interested_in:
                instance.interested_in.remove(event)

        return super(UserSerializer, self).update(instance, validated_data)
