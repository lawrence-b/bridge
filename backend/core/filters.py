# Import from Python
from datetime import datetime

# Import from core
from .models import Host, HostCategory, Event, EventCategory

# Import from additional packages
from django_filters import rest_framework as filters


def hosts_filter(user_category):
    """An automatic filter applied to the HostViewSet that removes all hosts the user is not permitted to see, based on
    the user's user category and the host's open_to field."""

    user_category_queryset = user_category.hosts.all()
    ancestors = user_category.get_ancestors()
    for ancestor in ancestors:
        new_user_category_queryset = ancestor.hosts.all()
        user_category_queryset = user_category_queryset | new_user_category_queryset

    return user_category_queryset.order_by('id')


class OptionalHostsFilters(filters.FilterSet):
    """A FilterSet class which defines the optional filters that the user can set to refine the list of hosts they see.
    All filters are compoundable i.e. the result of two filters is the & intersection of the two resulting filtered
    lists."""

    search = filters.CharFilter(method='search_filter', label='Search')

    host_category = filters.NumberFilter(method='host_category_filter', label='Host Category')

    ordering = filters.OrderingFilter(
        # tuple-mapping retains order
        fields=(
            ('name', 'name'),
        ),
    )

    class Meta:
        """Defines the model upon which the the FilterSet acts and which fields on that model are to be filtered."""

        model = Host
        fields = ['search', 'host_category']

    def host_category_filter(self, queryset, name, value):
        """A filter that returns only hosts belonging to a particular category, or a subcategory of that
        category."""

        host_category = HostCategory.objects.get(pk=value)
        host_category_queryset = host_category.hosts.all()
        descendants = host_category.get_descendants()
        for descendant in descendants:
            new_host_category_queryset = descendant.hosts.all()
            host_category_queryset = host_category_queryset | new_host_category_queryset
        return queryset & host_category_queryset

    def search_filter(self, queryset, name, value):
        """A filter that returns only hosts whose name contains a particular string. Case-insensitive."""

        return queryset.filter(name__icontains=value)


def events_filter(user_category):
    """An automatic filter applied to the EventViewSet that removes all events the user is not permitted to see, based
    on the user's user category and the event's open_to field."""

    user_category_queryset = user_category.events.all()
    ancestors = user_category.get_ancestors()
    for ancestor in ancestors:
        new_user_category_queryset = ancestor.events.all()
        user_category_queryset = user_category_queryset | new_user_category_queryset

    return user_category_queryset.order_by('start_time')


class OptionalEventsFilters(filters.FilterSet):
    """A FilterSet class which defines the optional filters that the user can set to refine the list of events they see.
    All filters are compoundable i.e. the result of two filters is the & intersection of the two resulting filtered
    lists."""

    search = filters.CharFilter(method='search_filter', label='Search')
    event_category = filters.NumberFilter(method='event_category_filter', label='Event Category')

    day = filters.NumberFilter(field_name='start_time', lookup_expr='day')
    month = filters.NumberFilter(field_name='start_time', lookup_expr='month')
    year = filters.NumberFilter(field_name='start_time', lookup_expr='year')

    subscribed_to = filters.BooleanFilter(method='subscribed_to_filter', label='Subscribed')
    interested_in = filters.BooleanFilter(method='interested_in_filter', label='Interested')
    subscribed_or_interested_in = filters.BooleanFilter(method='subscribed_or_interested_in_filter',
                                                        label='Subscribed or interested')

    show_past = filters.BooleanFilter(method='show_past_filter', label='Show Past?')

    ordering = filters.OrderingFilter(
    # tuple-mapping retains order
    fields=(
            ('title', 'title'),
            ('start_time', 'start_time'),
        ),
    )

    class Meta:
        """Defines the model upon which the the FilterSet acts and which fields on that model are to be filtered."""

        model = Event
        fields = ['search','event_category','day','month','year','featured','subscribed_to','interested_in','show_past']

    def event_category_filter(self, queryset, name, value):
        """A filter that returns only events belonging to a particular category, or a subcategory of that
        category."""

        event_category = EventCategory.objects.get(pk=value)
        event_category_queryset = event_category.events.all()
        descendants = event_category.get_descendants()
        for descendant in descendants:
            new_event_category_queryset = descendant.events.all()
            event_category_queryset = event_category_queryset | new_event_category_queryset
        return queryset & event_category_queryset

    def search_filter(self, queryset, name, value):
        """A filter that returns only events whose title contains a particular string, or events whose hosts' names
        contain that particular string. Case-insensitive."""

        return queryset & (queryset.filter(title__icontains=value) | queryset.filter(hosts__name__icontains=value))

    def subscribed_to_filter(self, queryset, name, value):
        """A filter that returns only events hosted by hosts to whom the user is subscribed."""

        if value:
            subscribed_to_queryset = Event.objects.filter(hosts__users_subscribed=self.request.user)
            return queryset & subscribed_to_queryset
        else:
            return queryset

    def interested_in_filter(self, queryset, name, value):
        """A filter that returns only events the user is interested_in."""

        if value:
            interested_in_queryset = Event.objects.filter(users_interested=self.request.user)
            return queryset & interested_in_queryset
        else:
            return queryset

    def subscribed_or_interested_in_filter(self, queryset, name, value):
        """A filter that returns events the user is interested_in or events from hosts the user is subscribed to."""

        if value:
            interested_in_queryset = Event.objects.filter(users_interested=self.request.user)
            subscribed_to_queryset = Event.objects.filter(hosts__users_subscribed=self.request.user)
            combined_queryset = interested_in_queryset | subscribed_to_queryset
            return queryset & combined_queryset
        else:
            return queryset

    def show_past_filter(self, queryset, name, value):
        """A filter that, if true, returns both past and future events, but if false, returns only future events."""

        if value:
            return queryset
        else:
            time_queryset = Event.objects.filter(end_time__gte=datetime.now())
            return queryset & time_queryset