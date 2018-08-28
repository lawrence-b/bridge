# Import from additional packages
import djoser

class SocialTokenStrategy:
    @classmethod
    def obtain(cls, user):
        token = djoser.utils.login_user(user=user, request=None)
        return {
            'token': token,
        }