# Import from Django
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import ugettext_lazy as _

# Import from core
from .models import User, UserCategory, Host, HostCategory, Event, EventCategory

# Import from additional packages
from mptt.admin import DraggableMPTTAdmin


class UserAdmin(DjangoUserAdmin):
    """Defines an admin model for the custom User model with no username field."""

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Profile'), {'fields': ('user_category','interested_in','subscribed_to',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


# Register models with Django admin for control in the admin site
admin.site.register(User, UserAdmin)
admin.site.register(UserCategory, DraggableMPTTAdmin)
admin.site.register(Host)
admin.site.register(HostCategory, DraggableMPTTAdmin)
admin.site.register(Event)
admin.site.register(EventCategory, DraggableMPTTAdmin)
