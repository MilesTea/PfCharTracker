from rest_framework import serializers, viewsets
from .models import *
from rest_framework.renderers import JSONRenderer




class FeatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feats
        fields = ['id','effect', 'requirements', 'name', 'description', 'level', 'traits', 'sources', 'type']

class TraitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Traits
        fields = '__all__'

class FeatTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatTypes
        fields = '__all__'

class AncestriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ancestries
        fields = '__all__'

class HeritagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Heritages
        fields = '__all__'

class ClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classes
        fields = '__all__'

class BackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Backgrounds
        fields = '__all__'