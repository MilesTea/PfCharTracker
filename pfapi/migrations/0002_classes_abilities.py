# Generated by Django 4.2.2 on 2023-06-29 14:35

from django.db import migrations, models
import pfapi.models


class Migration(migrations.Migration):

    dependencies = [
        ('pfapi', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classes',
            name='abilities',
            field=models.JSONField(default=pfapi.models.jsonAncestryAbilities),
        ),
    ]
