from django.db import models
from django.core import validators

# Create your models here.

def jsonAncestryAbilities():
    return {'str': 0,'dex': 0,'con': 0,'int': 0,'wis': 0,'cha': 0,'free': 2}

class FeatTypes(models.Model):
    name = models.TextField()

    def __str__(self):
        return self.name + f' ({self.pk})'

class Sources(models.Model):
    name = models.TextField()


    def __str__(self):
        return self.name + f' ({self.pk})'


class Traits(models.Model):
    effect = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()

    # временно удаляю в связи с неоопределенной реализацией
    # name_addition = models.TextField(blank=True, null=True)  # перенести в связующую таблицу, т.к. может быть две одинаковые с разными доп.


    def __str__(self):
        return self.name + f' ({self.pk})'


class Classes(models.Model):
    effect = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()
    type = models.OneToOneField(Sources, on_delete=models.CASCADE)
    abilities = models.JSONField()

    def __str__(self):
        return self.name + f' ({self.pk})'


class Feats(models.Model):
    effect = models.JSONField(blank=True, null=True)
    requirements = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()
    level = models.IntegerField()
    traits = models.ManyToManyField(Traits)
    sources = models.ManyToManyField(Sources, blank=True)
    type = models.ForeignKey(FeatTypes, on_delete=models.CASCADE)

    def __str__(self):
        return self.name + f' ({self.pk})'

class Ancestries(models.Model):
    effect = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()
    type = models.OneToOneField(Sources, on_delete=models.CASCADE)
    abilities = models.JSONField(default=jsonAncestryAbilities)

    def __str__(self):
        return self.name + f' ({self.pk})'
    
class Heritages(models.Model):
    effect = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()
    source = models.ForeignKey(Sources, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name + f' ({self.pk})'
    
class Backgrounds(models.Model):
    effect = models.JSONField(blank=True, null=True)
    name = models.TextField()
    description = models.TextField()
    abilities = models.JSONField()

    def __str__(self):
        return self.name + f' ({self.pk})'