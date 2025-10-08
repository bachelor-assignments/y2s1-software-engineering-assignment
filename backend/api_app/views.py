from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

# Create your views here.
# NOTE: General application views only!


class PingView(APIView):
    def get(self, request: Request):
        return Response(
            {"data": "pong", "response_at": f"{datetime.now().isoformat()}Z"},
            status=status.HTTP_200_OK,
        )
