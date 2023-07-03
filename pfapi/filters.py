from django_filters import rest_framework
from django.db.models import Q
import operator
import functools

from .models import *


    
class OrWithNoneSourcesFilter(rest_framework.filters.BaseCSVFilter, rest_framework.filters.CharFilter):
    def filter(self, qs, values):
        if not values:
            return qs
        query = Q()
        for value in values:
            if value == 'none':
                value = None
            query |= Q(sources=value)
        return qs.filter(query)
    
class ExcludeIdsFilter(rest_framework.filters.BaseCSVFilter, rest_framework.filters.CharFilter):
    def filter(self, qs, values):
        if not values:
            return qs
        return qs.exclude(id__in=values)


class FeatsFilter(rest_framework.FilterSet):
    level_min = rest_framework.NumberFilter(field_name='level', lookup_expr='gte')
    level_max = rest_framework.NumberFilter(field_name='level', lookup_expr='lte')
    # sources = rest_framework.NumberFilter(field_name='sources', lookup_expr='in')
    sources = OrWithNoneSourcesFilter(field_name='sources', lookup_expr='in')
    exclude_ids = ExcludeIdsFilter(field_name='id', lookup_expr='in')
    # rest_framework.
    # sources = rest_framework.MultipleChoiceFilter()
    # with_base = rest_framework.BooleanFilter(field_name='sources', method='with_base_filter')

    # def with_base_filter(self, queryset, name, value):
    #     print(queryset)
    #     print(name)
    #     print(value)
    #     return queryset

    


    class Meta:
        model = Feats
        fields = ['level', 'traits', 'type']

class HeritagesFilter(rest_framework.FilterSet):
    source = rest_framework.NumberFilter(field_name='source')

    class Meta:
        model = Heritages
        fields = []