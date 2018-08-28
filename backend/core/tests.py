# Import from core
from .models import User, Host, Event, UserCategory, EventCategory, HostCategory

# Import from Django Rest Framework
from rest_framework import status
from rest_framework.test import APITestCase


class TestUserViewSet(APITestCase):
    """Test the API endpoints of the UserViewSet."""

    def setUp(self):
        self.client.force_login(User.objects.get_or_create(email='test@test.com')[0])

    def test_retrieve(self):
        """ Ensure user can retrieve their user object."""
        response = self.client.get(path='/users/me/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list(self):
        """ Ensure user cannot see the full user list."""
        response = self.client.get(path='/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        """ Ensure user can update their user object."""
        data = {
            'email':'test@test.com',
            'subscribed_to_id':[],
            'add_interested_in':[],
            'remove_interested_in':[],
        }
        response = self.client.put(path='/users/me/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_partial_update(self):
        """ Ensure user can partially update their user object."""
        data = {
            'subscribed_to_id': [],
        }
        response = self.client.patch(path='/users/me/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestHostViewSet(APITestCase):
    """Test the API endpoints of the HostViewSet."""

    def setUp(self):
        UserCategory.objects.get_or_create(name='Public')
        user_category = UserCategory.objects.get(name='Public')

        HostCategory.objects.get_or_create(name='Student Society')
        host_category = HostCategory.objects.get(name='Student Society')

        User.objects.get_or_create(email='test@test.com', user_category=user_category)
        user = User.objects.get(email='test@test.com')

        Host.objects.get_or_create(name='TestHost', category=host_category, open_to=user_category)
        Host.objects.get_or_create(name='TestHostNotAdmin', category=host_category, open_to=user_category)

        host_1 = Host.objects.get(name='TestHost')
        host_2 = Host.objects.get(name='TestHostNotAdmin')
        host_1.admins.add(user)

        self.client.force_login(user)


    def test_create(self):
        """ Ensure user can create a host."""
        data = {
            'name':'Test Host 2',
            'category_id':1,
            'admins_id':[1],
            'open_to_id':[1],

        }
        response = self.client.post(path='/hosts/', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve(self):
        """ Ensure user can retrieve a host."""
        response = self.client.get(path='/hosts/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_admin(self):
        """ Ensure that admin email addresses are returned with a host if the user is an admin of that host."""
        response = self.client.get(path='/hosts/1/')
        self.assertContains(response=response, text='admins')

    def test_retrieve_not_admin(self):
        """ Ensure that admin email addresses are not returned with a host if the user is not an admin of that host."""
        response = self.client.get(path='/hosts/2/')
        self.assertNotContains(response=response, text='admins')

    def test_list(self):
        """ Ensure user can see a list of hosts."""
        response = self.client.get(path='/hosts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update(self):
        """ Ensure user can update a host the user is admin of."""
        data = {
            'name':'Test Host 2',
            'category_id':1,
            'admins_id':[1],
            'open_to_id':[1],
        }
        response = self.client.put(path='/hosts/1/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_not_admin(self):
        """ Ensure user cannot update a host the user is not an admin of."""
        data = {
            'name': 'Test Host 2',
            'category_id': 1,
            'admins_id': [1],
            'open_to_id': [1],
        }
        response = self.client.put(path='/hosts/2/', data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        """ Ensure user can partially update a host the user is an admin of."""
        self.client.login(username='test@test.com', password='test_password')
        data = {
            'category_id': 1,
        }
        response = self.client.patch(path='/hosts/1/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_partial_update_not_admin(self):
        """ Ensure user cannot update a host the user is not an admin of."""
        data = {
            'category_id': 1,
        }
        response = self.client.patch(path='/hosts/2/', data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        """ Ensure user can delete a host the user is an admin of."""
        response = self.client.delete(path='/hosts/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_not_admin(self):
        """ Ensure user cannot delete a host user is not an admin of."""
        response = self.client.delete(path='/hosts/2/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



class TestEventViewSet(APITestCase):
    """Test the API endpoints of the EventViewSet."""

    def setUp(self):
        UserCategory.objects.get_or_create(name='Public')
        user_category = UserCategory.objects.get(name='Public')

        HostCategory.objects.get_or_create(name='Student Society')
        host_category = HostCategory.objects.get(name='Student Society')

        EventCategory.objects.get_or_create(name='Sport')
        event_category = EventCategory.objects.get(name='Sport')

        User.objects.get_or_create(email='test@test.com', user_category=user_category)
        user = User.objects.get(email='test@test.com')

        Host.objects.get_or_create(name='TestHost', category=host_category, open_to=user_category)
        Host.objects.get_or_create(name='TestHostNotAdmin', category=host_category, open_to=user_category)

        host_1 = Host.objects.get(name='TestHost')
        host_2 = Host.objects.get(name='TestHostNotAdmin')
        host_1.admins.add(user)

        Event.objects.get_or_create(title='TestEvent', category=event_category, open_to=user_category)
        Event.objects.get_or_create(title='TestEventNotAdmin', category=event_category, open_to=user_category)

        event_1 = Event.objects.get(title='TestEvent')
        event_2 = Event.objects.get(title='TestEventNotAdmin')
        event_1.hosts.add(host_1)
        event_2.hosts.add(host_2)

        self.client.force_login(user)


    def test_create(self):
        """ Ensure user can create an event."""
        data = {
            'title':'Test Event 2',
            'category_id':1,
            'hosts_id':[1],
            'open_to_id':[1],

        }
        response = self.client.post(path='/events/', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve(self):
        """ Ensure user can retrieve an event."""
        event_id = str(Event.objects.get(title='TestEvent').id)
        response = self.client.get(path='/events/'+event_id+'/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list(self):
        """ Ensure user can see a list of events."""
        response = self.client.get(path='/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update(self):
        """ Ensure user can update an event the user is an admin of."""
        data = {
            'title':'Test Host 2',
            'category_id':1,
            'hosts_id':[1],
            'open_to_id':[1],
        }
        response = self.client.put(path='/events/1/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_not_admin(self):
        """ Ensure user cannot update an event the user is not an admin of."""
        data = {
            'title':'Test Host 2',
            'category_id':1,
            'hosts_id':[1],
            'open_to_id':[1],
        }
        response = self.client.put(path='/events/2/', data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_partial_update(self):
        """ Ensure user can partially update an event the user is an admin of."""
        data = {
            'category_id': 1,
        }
        response = self.client.patch(path='/events/1/', data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_partial_update_not_admin(self):
        """ Ensure user cannot partially update an event the user is not an admin of."""
        data = {
            'category_id': 1,
        }
        response = self.client.patch(path='/events/2/', data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        """ Ensure user can delete an event the user is an admin of."""
        response = self.client.delete(path='/events/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_not_admin(self):
        """ Ensure user cannot delete an event the user is not an admin of."""
        response = self.client.delete(path='/events/2/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)