# Generated by Django 2.1 on 2018-08-29 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0026_auto_20180826_1854'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='university_age_category',
            field=models.CharField(blank=True, choices=[('Undergraduate', 'Undergraduate'), ('Postgraduate', 'Postgraduate'), ('Faculty and staff', 'Faculty and staff')], max_length=255),
        ),
    ]
