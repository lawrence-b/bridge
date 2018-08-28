# Import from Django
from django.conf.urls import url, include
from django.urls import path
from django.contrib import admin

# Import from Django Rest Framework
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view
from rest_framework.renderers import DocumentationRenderer

# Import from core
from core import views


# Create coreapi schema
schema_view_coreapi = get_schema_view(title='Schema') # Get the JSON schema for display at /schema/

# Define custom renderer for docs
class CustomRenderer(DocumentationRenderer):
    languages = []


# Create router and register the ViewSets to be routed
router = DefaultRouter()
router.register(r'users', views.UserViewSet, base_name='users')
router.register(r'hosts', views.HostViewSet, base_name='hosts')
router.register(r'events', views.EventViewSet, base_name='events')
router.register(r'event-categories', views.EventCategoryViewSet, base_name='event_categories')
router.register(r'host-categories', views.HostCategoryViewSet, base_name='host_categories')
router.register(r'user-categories', views.UserCategoryViewSet, base_name='user_categories')

# Register the router urls in urlpatterns
urlpatterns = router.urls

# Append all non-routed URLs
urlpatterns += [
    # Browsable API login
    url(r'^api-auth/', include('rest_framework.urls')),

    # Admin site
    path('admin/', admin.site.urls),

    # Customised Djoser auth
    url(r'^password/?$', views.SetPasswordView.as_view(), name='set_password'), #####
    url(
        r'^password/reset/?$',
        views.PasswordResetView.as_view(),
        name='password_reset'
    ),
    url(
        r'^password/reset/confirm/?$',
        views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),
    url(r'^auth/', include('djoser.urls.authtoken')),
    url(r'^auth/', include('djoser.social.urls')),

    # Schema and docs
    url(r'^schema/$', schema_view_coreapi),
    url(r'^docs/', include_docs_urls(title='Bridge API Docs', public=False, renderer_classes=[CustomRenderer])),
]