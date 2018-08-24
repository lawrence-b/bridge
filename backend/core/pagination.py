# Import from Django Rest Framework
from rest_framework.pagination import PageNumberPagination


class CustomResultsPagination(PageNumberPagination):
    """A PageNumberPagination class that defines the pagination method. Here we specify that the page_size of pagination
    will be specified by a query paramater. Otherwise reverts to the default in settings.py."""

    page_size_query_param = 'page_size'
