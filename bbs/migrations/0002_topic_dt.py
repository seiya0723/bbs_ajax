# Generated by Django 3.2.10 on 2022-07-28 13:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bbs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='dt',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='投稿日時'),
        ),
    ]
