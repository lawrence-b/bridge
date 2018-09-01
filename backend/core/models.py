# Import from Python
import os
from datetime import datetime

# Import from Django
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

# Import from additional packages
from mptt.models import MPTTModel, TreeForeignKey


class UserManager(BaseUserManager):
    """A custom model manager for the User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UserCategory(MPTTModel):
    """An MPTT tree representing a user category e.g. Public, University of Cambridge, Emmanuel College. Users can only
    see hosts and events that have a user category tree level higher than their own. See filters.py for more
    information."""

    name = models.CharField(max_length=100, unique=True)

    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True,
                            on_delete=models.SET_NULL)

    class MPTTMeta:
        """Meta information defining the order of insertion into the tree when a new category is added."""
        order_insertion_by = ['name']

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'User Category'
        verbose_name_plural = 'User Categories'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.name


class User(AbstractUser):
    """User model. Stores an email address, password (inherited from AbstractUser), and profile data."""

    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    user_category = TreeForeignKey('UserCategory', null=True, blank=True, on_delete=models.SET_NULL,
                                   related_name='users')

    interested_in = models.ManyToManyField('Event', related_name='users_interested', blank=True)

    subscribed_to = models.ManyToManyField('Host', related_name='users_subscribed', blank=True)

    # If you select university level, you get an age category dropdown menu

    # Age category - if university category level, open box to add age category
    AGE_CATEGORY_CHOICES = (
        ('Undergraduate', 'Undergraduate'),
        ('Postgraduate', 'Postgraduate'),
        ('Faculty and staff', 'Faculty and staff'),
    )
    university_age_category = models.CharField(max_length=255, blank=True, choices=AGE_CATEGORY_CHOICES)

    # If you select the undergrad options, you get to select matriculation year and subject
    SUBJECT_CHOICES = (
        ('Anglo-Saxon, Norse, and Celtic','Anglo-Saxon, Norse, and Celtic'),
        ('Archaeology', 'Archaeology'),
        ('Architecture', 'Architecture'),
        ('Asian and Middle Eastern Studies', 'Asian and Middle Eastern Studies'),
        ('Chemical Engineering', 'Chemical Engineering'),
        ('Classics', 'Classics'),
        ('Computer Science', 'Computer Science'),
        ('Economics', 'Economics'),
        ('Education', 'Education'),
        ('Engineering', 'Engineering'),
        ('English', 'English'),
        ('Geography', 'Geography'),
        ('History', 'History'),
        ('History and Modern Languages', 'History and Modern Languages'),
        ('History and Politics', 'History and Politics'),
        ('History of Art', 'History of Art'),
        ('Human, Social, and Political Sciences', 'Human, Social, and Political Sciences'),
        ('Land Economy', 'Land Economy'),
        ('Law', 'Law'),
        ('Linguistics', 'Linguistics'),
        ('Management Studies', 'Management Studies'),
        ('Manufacturing Engineering', 'Manufacturing Engineering'),
        ('Mathematics', 'Mathematics'),
        ('Medicine', 'Medicine'),
        ('Modern and Medieval Languages', 'Modern and Medieval Languages'),
        ('Music', 'Music'),
        ('Natural Sciences', 'Natural Sciences'),
        ('Philosophy', 'Philosophy'),
        ('Psychological and Behavioural Sciences', 'Psychological and Behavioural Sciences'),
        ('Theology', 'Theology'),
        ('Veterinary Medicine', 'Veterinary Medicine'),
    )
    subject = models.CharField(max_length=255, blank=True, choices=SUBJECT_CHOICES)

    matriculation_year = models.IntegerField(blank=True, null=True)

    def currently_interested_in(self):
        "Returns future events the user is interested in."
        return self.interested_in.filter(end_time__gte=datetime.now())

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.email


class HostCategory(MPTTModel):
    """An MPTT tree representing a host category e.g. Student society, Business. Users can filter hosts by this
    category. See filters.py for more information."""

    name = models.CharField(max_length=50, unique=True)

    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True,
                            on_delete=models.SET_NULL)

    thumbnail = models.ImageField(upload_to='thumbnails/host_categories/%Y/%m/%d/', blank=True)

    class MPTTMeta:
        """Meta information defining the order of insertion into the tree when a new category is added."""
        order_insertion_by = ['name']

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'Host Category'
        verbose_name_plural = 'Host Categories'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.name


class Host(models.Model):
    """Host model. Stores all information pertinent to a host."""

    name = models.CharField(max_length=100)

    category = TreeForeignKey('HostCategory', null=True, blank=True, on_delete=models.SET_NULL, related_name='hosts')

    open_to = TreeForeignKey('UserCategory', related_name='hosts', null=True, blank=True, on_delete=models.SET_NULL)

    admins = models.ManyToManyField(User, related_name='admin_of')

    description = models.TextField(blank=True)

    website = models.URLField(max_length=200, blank=True)

    image = models.ImageField(upload_to='images/hosts/pictures/%Y/%m/%d/', default=os.path.join(settings.MEDIA_ROOT,
                'placeholders/host.jpeg'))

    logo = models.ImageField(upload_to='images/hosts/logos/%Y/%m/%d/', blank=True)

    def events_hosting_in_future(self):
        """"Returns all future events that the host is hosting."""
        return self.events_hosting.filter(end_time__gte=datetime.now())

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'Host'
        verbose_name_plural = 'Hosts'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.name


class EventCategory(MPTTModel):
    """An MPTT tree representing an event category e.g. Music, Sport, as well as their subcategories, e.g. Classical,
    Jazz, etc. Users can filter events by this category. See filters.py for more information."""

    name = models.CharField(max_length=50, unique=True)

    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True,
                            on_delete=models.SET_NULL)

    featured = models.BooleanField(default=False)

    thumbnail = models.ImageField(upload_to='thumbnails/event_categories/%Y/%m/%d/', blank=True)

    class MPTTMeta:
        """Meta information defining the order of insertion into the tree when a new category is added."""
        order_insertion_by = ['name']

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'Event Category'
        verbose_name_plural = 'Event Categories'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.name


class Event(models.Model):
    """Event model. Stores all information pertinent to an event."""

    title = models.CharField(max_length=200)

    category = TreeForeignKey('EventCategory', null=True, blank=True, on_delete=models.SET_NULL, related_name='events')

    open_to = TreeForeignKey('UserCategory', related_name='events', null=True, blank=True, on_delete=models.SET_NULL)

    hosts = models.ManyToManyField(Host, related_name='events_hosting')

    start_time = models.DateTimeField(default=datetime.now)

    end_time = models.DateTimeField(default=datetime.now)

    featured = models.BooleanField(default=False)

    description = models.TextField(blank=True)

    location = models.CharField(max_length=250, blank=True)

    image = models.ImageField(upload_to='images/events/%Y/%m/%d/', default=os.path.join(settings.MEDIA_ROOT,
                'placeholders/event.jpeg'))


    def duration(self):
        """"Returns the duration of the event"""
        return self.end_time - self.start_time

    class Meta:
        """Meta information defining the verbose naming of the model."""
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

    def __str__(self):
        """Defines the informal string representation of the object. i.e. the result of str(object)."""
        return self.title
