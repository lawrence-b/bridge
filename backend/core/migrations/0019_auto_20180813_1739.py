# Generated by Django 2.0.7 on 2018-08-13 17:39

from django.db import migrations
import versatileimagefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_auto_20180809_2216'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercategory',
            name='thumbnail',
            field=versatileimagefield.fields.VersatileImageField(blank=True, upload_to='images/host-categories/%Y/%m/%d/', verbose_name='Image'),
        ),
        migrations.AddField(
            model_name='usercategory',
            name='thumbnail_ppoi',
            field=versatileimagefield.fields.PPOIField(blank=True, default='0.5x0.5', editable=False, max_length=20),
        ),
    ]
