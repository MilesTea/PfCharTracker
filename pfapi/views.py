from django.shortcuts import render
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
import pfapi.filters as filters

from .serializers import *
from .models import *

# Create your views here.


# class PathfinderAPIList(generics.ListAPIView):
#     queryset = Feats.objects.all()
#     serializer_class = PfSerializer
#     filter_backends = (DjangoFilterBackend,)
#     filterset_class = filters.TestFilter

# class PathfinderAPIView(generics.ListAPIView):
#     queryset = Feats.objects.all()
#     serializer_class = PfSerializer



class FeatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Feats.objects.all()
    serializer_class = FeatsSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.FeatsFilter

class TraitsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Traits.objects.all()
    serializer_class = TraitsSerializer
    filter_backends = (DjangoFilterBackend,)

class FeatTypesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeatTypes.objects.all()
    serializer_class = FeatTypesSerializer
    filter_backends = (DjangoFilterBackend,)

class AncestriesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ancestries.objects.all()
    serializer_class = AncestriesSerializer

class HeritagesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Heritages.objects.all()
    serializer_class = HeritagesSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.HeritagesFilter

class ClassesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Classes.objects.all()
    serializer_class = ClassesSerializer

class BackgroundsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Backgrounds.objects.all()
    serializer_class = BackgroundSerializer