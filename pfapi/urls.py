from django.urls import path, include
from .views import *
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'feats', FeatsViewSet)
router.register(r'traits', TraitsViewSet)
router.register(r'feattypes', FeatTypesViewSet)
router.register(r'ancestries', AncestriesViewSet)
router.register(r'heritages', HeritagesViewSet)
router.register(r'classes', ClassesViewSet)
router.register(r'backgrounds', BackgroundsViewSet)

urlpatterns = [
    # path('', PathfinderAPIList.as_view()),
    path('', include(router.urls)),
]
