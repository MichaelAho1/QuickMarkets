from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer, StockSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from simulator.models import Stock

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class ViewStockPrices(APIView):
    serializer_class = StockSerializer
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        stocks = [(stock.ticker, stock.stockName, stock.currPrice, stock.sectorType.ticker) for stock in Stock.objects.all()]
        return Response(stocks)