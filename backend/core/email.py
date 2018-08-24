# Import from additional packages
from templated_mail.mail import BaseEmailMessage


class AdminConfirmationEmail(BaseEmailMessage):
    """An EmailMessage class that defines the email template for the add admin confirmation response."""

    template_name = 'email/admin_confirmation.html'
