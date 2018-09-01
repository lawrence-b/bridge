# Import from additional packages
from templated_mail.mail import BaseEmailMessage
from django.contrib.auth.tokens import default_token_generator
from djoser import email


class AdminConfirmationEmail(BaseEmailMessage):
    """An EmailMessage class that defines the email template for the add admin confirmation response."""

    template_name = 'email/admin_confirmation.html'

class ActivationEmail(email.ActivationEmail):
    """An EmailMessage class that defines the email template for the user activation email."""

    template_name = 'email/activation.html'


class ConfirmationEmail(BaseEmailMessage):
    """An EmailMessage class that defines the email template for the user activation confirmation email."""

    template_name = 'email/confirmation.html'


class PasswordResetEmail(BaseEmailMessage):
    """An EmailMessage class that defines the email template for the password reset email."""

    template_name = 'email/password_reset.html'
