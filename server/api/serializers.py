from django.contrib.auth.models import User 
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from simulator.models import User as SimulatorUser, Stock, StockPriceHistory, UserStock, Transaction, Watchlist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} 

    def validate_password(self, value):
        """Validate password using Django's built-in validators"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

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
        model = Transaction
        fields = ["user", "stockTicker", "shares", "transactionType", "priceAtTransaction", "timestamp"]

class UserStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStock
        fields = "__all__"

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'ticker']