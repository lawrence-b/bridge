# Generated by Django 2.0.7 on 2018-08-06 20:06

from django.db import migrations
import versatileimagefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_event_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'verbose_name': 'Event', 'verbose_name_plural': 'Events'},
        ),
        migrations.AddField(
            model_name='event',
            name='image_ppoi',
            field=versatileimagefield.fields.PPOIField(default='0.5x0.5', editable=False, max_length=20),
        ),
        migrations.AlterField(
            model_name='event',
            name='image',
            field=versatileimagefield.fields.VersatileImageField(upload_to='images/events/%Y/%m/%d/', verbose_name='Image'),
        ),
    ]
