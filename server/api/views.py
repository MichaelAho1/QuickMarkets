from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer, StockSerializer, StockHistorySerializer, TransactStock, UserStockSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from simulator.models import Stock, StockPriceHistory, UserStock, Transaction
from simulator.models import User as SimulatorUser
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from django.db import transaction

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

class buyStock(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            ticker = request.data.get('ticker')
            shares = Decimal(request.data.get('shares', 0))
            
            if not ticker or shares <= 0:
                return Response({"error": "Invalid ticker or shares amount"}, status=400)
            
            # Get stock and user
            stock = Stock.objects.get(ticker=ticker)
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            
            # Calculate total cost
            total_cost = stock.currPrice * shares
            
            # Check if user has enough cash
            if simulator_user.cashBalance < total_cost:
                return Response({"error": "Insufficient funds"}, status=400)
            
            # Use database transaction to ensure data consistency
            with transaction.atomic():
                # Deduct cash from user
                simulator_user.cashBalance -= total_cost
                simulator_user.save()
                
                # Create or update UserStock
                user_stock, created = UserStock.objects.get_or_create(
                    user=simulator_user,
                    stock=stock,
                    defaults={'sharesAmount': shares, 'averageCost': stock.currPrice}
                )
                
                if not created:
                    # Update existing position
                    total_shares = user_stock.sharesAmount + shares
                    total_cost_basis = (user_stock.averageCost * user_stock.sharesAmount) + (stock.currPrice * shares)
                    user_stock.averageCost = total_cost_basis / total_shares
                    user_stock.sharesAmount = total_shares
                    user_stock.save()
                
                # Create transaction record
                Transaction.objects.create(
                    user=simulator_user,
                    stockTicker=stock,
                    shares=float(shares),
                    transactionType="BUY",
                    priceAtTransaction=float(stock.currPrice)
                )
            
            return Response({
                "message": "Stock purchased successfully",
                "ticker": ticker,
                "shares": float(shares),
                "price": float(stock.currPrice),
                "total_cost": float(total_cost),
                "remaining_cash": float(simulator_user.cashBalance)
            })
            
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=404)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def get(self, request):
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            user_stocks = UserStock.objects.filter(user=simulator_user)
            serializer = UserStockSerializer(user_stocks, many=True)
            return Response(serializer.data)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class sellStock(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            ticker = request.data.get('ticker')
            shares = Decimal(request.data.get('shares', 0))
            
            if not ticker or shares <= 0:
                return Response({"error": "Invalid ticker or shares amount"}, status=400)
            
            # Get stock and user
            stock = Stock.objects.get(ticker=ticker)
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            
            # Check if user owns the stock
            try:
                user_stock = UserStock.objects.get(user=simulator_user, stock=stock)
            except UserStock.DoesNotExist:
                return Response({"error": "You don't own this stock"}, status=400)
            
            # Check if user has enough shares
            if user_stock.sharesAmount < shares:
                return Response({"error": "Insufficient shares"}, status=400)
            
            # Calculate total value
            total_value = stock.currPrice * shares
            
            # Use database transaction to ensure data consistency
            with transaction.atomic():
                # Add cash to user
                simulator_user.cashBalance += total_value
                simulator_user.save()
                
                # Update UserStock
                if user_stock.sharesAmount == shares:
                    # Selling all shares, delete the record
                    user_stock.delete()
                else:
                    # Update remaining shares
                    user_stock.sharesAmount -= shares
                    user_stock.save()
                
                # Create transaction record
                Transaction.objects.create(
                    user=simulator_user,
                    stockTicker=stock,
                    shares=float(shares),
                    transactionType="SELL",
                    priceAtTransaction=float(stock.currPrice)
                )
            
            return Response({
                "message": "Stock sold successfully",
                "ticker": ticker,
                "shares": float(shares),
                "price": float(stock.currPrice),
                "total_value": float(total_value),
                "remaining_cash": float(simulator_user.cashBalance)
            })
            
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=404)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def get(self, request):
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            user_stocks = UserStock.objects.filter(user=simulator_user)
            serializer = UserStockSerializer(user_stocks, many=True)
            return Response(serializer.data)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class UserPortfolio(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            user_stocks = UserStock.objects.filter(user=simulator_user)
            
            portfolio_data = []
            total_portfolio_value = 0
            total_cost_basis = 0
            
            for user_stock in user_stocks:
                stock = user_stock.stock
                current_value = stock.currPrice * user_stock.sharesAmount
                cost_basis = user_stock.averageCost * user_stock.sharesAmount
                profit_loss = current_value - cost_basis
                profit_loss_percent = (profit_loss / cost_basis * 100) if cost_basis > 0 else 0
                
                stock_data = {
                    "ticker": stock.ticker,
                    "stockName": stock.stockName,
                    "shares": float(user_stock.sharesAmount),
                    "averageCost": float(user_stock.averageCost),
                    "currentPrice": float(stock.currPrice),
                    "currentValue": float(current_value),
                    "costBasis": float(cost_basis),
                    "profitLoss": float(profit_loss),
                    "profitLossPercent": float(profit_loss_percent),
                    "sector": stock.sectorType.ticker
                }
                
                portfolio_data.append(stock_data)
                total_portfolio_value += current_value
                total_cost_basis += cost_basis
            
            overall_profit_loss = total_portfolio_value - total_cost_basis
            overall_profit_loss_percent = (overall_profit_loss / total_cost_basis * 100) if total_cost_basis > 0 else 0
            
            return Response({
                "portfolio": portfolio_data,
                "summary": {
                    "totalPortfolioValue": float(total_portfolio_value),
                    "totalCostBasis": float(total_cost_basis),
                    "overallProfitLoss": float(overall_profit_loss),
                    "overallProfitLossPercent": float(overall_profit_loss_percent),
                    "cashBalance": float(simulator_user.cashBalance),
                    "totalNetWorth": float(total_portfolio_value + simulator_user.cashBalance)
                }
            })
            
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)