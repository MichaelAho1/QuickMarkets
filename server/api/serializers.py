from django.contrib.auth.models import User 
from rest_framework import serializers
from simulator.models import User as SimulatorUser, Stock, StockPriceHistory, UserStock

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} 

    def create(self, validated_data): 
        user = User.objects.create_user(**validated_data)
        
        SimulatorUser.objects.create(
            username=user.username,
            cashBalance=100000.00
        )
        return user

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["ticker", "stockname", "currprice", "sectortype"]
        
class StockHistorySerializer(serializers.ModelSerializer):    
    class Meta:
        model = StockPriceHistory
        fields = ["stockTicker", "date", "closingPrice"]

class TransactStock(serializers.ModelSerializer):
    class Meta:
        model = UserStock
        fields = ["user", "stockTicker", "shares", "transactionType", "priceAtTransaction", "timestamp"]
