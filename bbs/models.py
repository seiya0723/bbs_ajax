from django.db import models
from django.utils import timezone

class Topic(models.Model):

    dt      = models.DateTimeField(verbose_name="投稿日時",default=timezone.now)
    comment = models.CharField(verbose_name="コメント",max_length=2000)


