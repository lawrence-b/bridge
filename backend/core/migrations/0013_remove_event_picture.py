# Generated by Django 2.0.7 on 2018-08-05 15:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_event_picture'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='picture',
        ),
    ]
