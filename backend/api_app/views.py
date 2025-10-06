from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

# NOTE: General application views only!

def ping(request):
    return JsonResponse({
        "data": "pong",
        "response_at": f"{datetime.now().isoformat()}Z"
    })