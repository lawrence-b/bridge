# Generated by Django 2.0.7 on 2018-07-27 23:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20180726_1945'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='university',
        ),
    ]
