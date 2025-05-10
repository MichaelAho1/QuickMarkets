from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer, StockSerializer, StockHistorySerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from simulator.models import Stock, StockPriceHistory
from simulator.models import User as SimulatorUser
from rest_framework.permissions import IsAuthenticated

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class ViewStockPrices(APIView):
    serializer_class = StockSerializer
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        stocks = [{
            "ticker": stock.ticker,
            "stockName": stock.stockName,
            "currPrice": stock.currPrice,
            "prevPrice": stock.prevPrice,
            "sectorType": stock.sectorType.ticker
        } for stock in Stock.objects.all()]
        return Response(stocks)
    
class ViewHistoricalStockPrice(APIView):
    serializer_class = StockHistorySerializer
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        ticker = request.query_params.get('ticker')
        history = StockPriceHistory.objects.filter(stockTicker=ticker).order_by('date')
        serializer = StockHistorySerializer(history, many=True)
        return Response(serializer.data)
        


class ViewSimulatorUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "Simulator user not found"}, status=404)
        data = {
            "username": simulator_user.username,
            "cashBalance": simulator_user.cashBalance,
        }
        return Response(data)

