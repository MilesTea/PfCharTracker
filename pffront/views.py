from django.shortcuts import render
from pfapi.models import Classes

# Create your views here.

context = {'classes': Classes.objects.all()}

def get_page(request):
    return render(request, 'pffront/index.html', context=context)