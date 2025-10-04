from django.contrib.auth.models import User
from .serializers import UserSerializer, StockSerializer, StockHistorySerializer, TransactStock, UserStockSerializer, WatchlistSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from simulator.models import Stock, StockPriceHistory, UserStock, Transaction, Watchlist, PortfolioHistory
from simulator.models import User as SimulatorUser
from decimal import Decimal
from django.db import transaction
from simulator.stockGeneration.duringDayGenerator import generateDuringDayChanges, applyDuringDayChanges
from simulator.stockGeneration.endOfDayGenerator import storeEndOfDayPrices, storePortfolioValues, getPriceDataForPeriod
from simulator.utils import get_current_simulation_date, get_current_simulation_day
from simulator.timer_service import timer_service
from datetime import timedelta

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            # Handle validation errors and return them in a user-friendly format
            if hasattr(e, 'detail'):
                # DRF validation errors
                error_messages = []
                if isinstance(e.detail, dict):
                    for field, messages in e.detail.items():
                        if isinstance(messages, list):
                            error_messages.extend(messages)
                        else:
                            error_messages.append(str(messages))
                else:
                    error_messages = [str(e.detail)]
                
                return Response({
                    "error": error_messages[0] if len(error_messages) == 1 else error_messages
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "error": "An error occurred during registration"
                }, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            return Response({
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            user_stocks = UserStock.objects.filter(user=simulator_user)
            
            portfolio_data = []
            
            for user_stock in user_stocks:
                stock = user_stock.stock
                stock_data = {
                    "ticker": stock.ticker,
                    "stockName": stock.stockName,
                    "shares": float(user_stock.sharesAmount),
                    "averageCost": float(user_stock.averageCost),
                    "sector": stock.sectorType.ticker
                }
                
                portfolio_data.append(stock_data)
            
            return Response({
                "portfolio": portfolio_data,
                "summary": {
                    "username": simulator_user.username,
                    "cashBalance": float(simulator_user.cashBalance)
                }
            })
            
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

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


class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            # Get last 5 transactions 
            transactions = Transaction.objects.filter(user=simulator_user).order_by('-timestamp')[:5]
            transaction_data = []
            for transaction in transactions:
                total_value = transaction.shares * transaction.priceAtTransaction

                transaction_data.append({
                    "date": transaction.timestamp.strftime("%Y-%m-%d"),
                    "value": total_value,
                    "change": f"{transaction.transactionType} {transaction.shares} shares of {transaction.stockTicker.ticker} @ ${transaction.priceAtTransaction}"
                })
            
            return Response(transaction_data)
            
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class LeaderboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            from simulator.models import User, UserStock
            
            # Get all users and calculate their total net worth
            users = User.objects.all()
            leaderboard_data = []
            
            for user in users:
                total_net_worth = user.cashBalance or 0
                
                # Get user's stocks
                user_stocks = UserStock.objects.filter(user=user)
                for user_stock in user_stocks:
                    current_value = user_stock.stock.currPrice * user_stock.sharesAmount
                    total_net_worth += current_value
                
                leaderboard_data.append({
                    "username": user.username,
                    "totalNetWorth": float(total_net_worth),
                })
            
            # Sort by total net worth (descending)
            leaderboard_data.sort(key=lambda x: x['totalNetWorth'], reverse=True)
            
            return Response(leaderboard_data[:3])
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class WatchlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user's watchlist"""
        try:
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            watchlist_items = Watchlist.objects.filter(user=simulator_user)
            serializer = WatchlistSerializer(watchlist_items, many=True)
            return Response(serializer.data)
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def post(self, request):
        """Add stock to watchlist"""
        try:
            ticker = request.data.get('ticker')
            if not ticker:
                return Response({"error": "Ticker is required"}, status=400)
            
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            
            # Check if user already has 5 items in watchlist
            current_watchlist_count = Watchlist.objects.filter(user=simulator_user).count()
            if current_watchlist_count >= 5:
                return Response({"error": "Watchlist is full (maximum 5 stocks)"}, status=400)
            
            # Check if stock is already in watchlist
            if Watchlist.objects.filter(user=simulator_user, ticker=ticker).exists():
                return Response({"error": "Stock is already in watchlist"}, status=400)
            
            # Add to watchlist
            watchlist_item = Watchlist.objects.create(user=simulator_user, ticker=ticker)
            serializer = WatchlistSerializer(watchlist_item)
            return Response(serializer.data, status=201)
            
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def delete(self, request):
        """Remove stock from watchlist"""
        try:
            ticker = request.data.get('ticker')
            if not ticker:
                return Response({"error": "Ticker is required"}, status=400)
            
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            
            try:
                watchlist_item = Watchlist.objects.get(user=simulator_user, ticker=ticker)
                watchlist_item.delete()
                return Response({"message": "Stock removed from watchlist"}, status=200)
            except Watchlist.DoesNotExist:
                return Response({"error": "Stock not found in watchlist"}, status=404)
            
        except SimulatorUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class SimulateDuringDayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Simulate during day price changes"""
        try:
            price_changes = generateDuringDayChanges()
            applyDuringDayChanges(price_changes)
            return Response({
                "message": "During day simulation completed successfully",
                "status": "success",
                "changes_applied": len(price_changes)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class StockChartDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get historical stock data for charts"""
        try:
            ticker = request.query_params.get('ticker')
            period = request.query_params.get('period', '1m')  # Default to 1 month
            
            if not ticker:
                return Response({"error": "Ticker is required"}, status=400)
            
            # Get historical data for the specified period
            history = getPriceDataForPeriod(ticker, period)
            
            # Get current stock data
            try:
                stock = Stock.objects.get(ticker=ticker)
                current_price = float(stock.currPrice)
                opening_price = float(stock.prevPrice)
                current_change = current_price - opening_price
                current_day = get_current_simulation_day()
            except Stock.DoesNotExist:
                return Response({"error": "Stock not found"}, status=404)
            
            # Start with historical data
            chart_data = []
            if history:
                chart_data = [{
                    "date": f"Day {record.day}",
                    "open": float(record.openingPrice),
                    "close": float(record.closingPrice),
                    "change": float(record.dayChange)
                } for record in history]
            
            # Add current day's data to the chart
            current_day_data = {
                "date": f"Day {current_day}",
                "open": opening_price,
                "close": current_price,
                "change": current_change
            }
            chart_data.append(current_day_data)
            
            return Response({
                "ticker": ticker,
                "period": period,
                "data": chart_data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class PortfolioChartDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get portfolio value data for charts"""
        try:
            period = request.query_params.get('period', '1m')  # Default to 1 month
            
            # Get user
            simulator_user = SimulatorUser.objects.get(username=request.user.username)
            
            # Get current day
            current_day = get_current_simulation_day()
            
            # Get day range based on period
            start_day = current_day
            
            if period == '1w':
                start_day = max(1, current_day - 7)
            elif period == '1m':
                start_day = max(1, current_day - 30)
            elif period == '6m':
                start_day = max(1, current_day - 180)
            elif period == '1y':
                start_day = max(1, current_day - 365)
            else:  # all
                start_day = max(1, current_day - 365*2)  # 2 years max
            
            # Get portfolio history for the period
            portfolio_history = PortfolioHistory.objects.filter(
                user=simulator_user,
                day__gte=start_day,
                day__lte=current_day
            ).order_by('day')
            
            # Convert to chart data
            chart_data = []
            for record in portfolio_history:
                chart_data.append({
                    "date": f"Day {record.day}",
                    "portfolioValue": float(record.portfolioValue)
                })
            
            # Add current day's portfolio value if not already in history
            current_day_str = f"Day {current_day}"
            if not chart_data or chart_data[-1]["date"] != current_day_str:
                # Calculate current portfolio value
                user_stocks = UserStock.objects.filter(user=simulator_user)
                current_portfolio_value = float(simulator_user.cashBalance)
                
                for user_stock in user_stocks:
                    try:
                        stock = Stock.objects.get(ticker=user_stock.stock.ticker)
                        price = float(stock.currPrice)
                        current_portfolio_value += price * float(user_stock.sharesAmount)
                    except Stock.DoesNotExist:
                        continue
                
                chart_data.append({
                    "date": current_day_str,
                    "portfolioValue": current_portfolio_value
                })
            
            return Response({
                "period": period,
                "data": chart_data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class TimerManagementView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get timer status and current day"""
        try:
            status = timer_service.get_timer_status()
            current_day = timer_service.get_current_day()
            status['current_day'] = current_day
            return Response(status)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def post(self, request):
        """Start the timer"""
        try:
            result = timer_service.start_timer()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def delete(self, request):
        """Stop the timer"""
        try:
            result = timer_service.stop_timer()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class SimulationTimeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get current simulation day and time until next day"""
        try:
            from simulator.models import SimulationTimer
            from django.utils import timezone
            
            # Get timer from database
            timer = SimulationTimer.objects.first()
            
            if not timer:
                return Response({
                    "current_day": 1,
                    "time_until_next_day": 15,
                    "error": "No timer found"
                })
            
            # Refresh from database to get latest data
            timer.refresh_from_db()
            
            # Calculate time until next day dynamically
            current_time = timezone.now()
            time_until_next_day = 15  # Default 15 seconds
            
            if timer.is_running and timer.last_end_of_day_call:
                # Calculate seconds since last end of day call
                seconds_since_last_end = (current_time - timer.last_end_of_day_call).total_seconds()
                # Time until next day is 15 seconds minus time since last end of day
                time_until_next_day = max(0, 15 - seconds_since_last_end)
            elif not timer.is_running:
                # If timer is not running, show full 15 seconds
                time_until_next_day = 15
            
            return Response({
                "current_day": timer.current_day,
                "time_until_next_day": int(time_until_next_day)
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)



