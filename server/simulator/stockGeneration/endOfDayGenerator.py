"""
End of day generator to store daily stock prices in StockPriceHistory
This should be called at the end of each trading day to store the day's price data
"""
from datetime import timedelta
from ..models import Stock, StockPriceHistory, UserStock, User as SimulatorUser, PortfolioHistory, SimulationTimer
from ..utils import get_current_simulation_date, get_current_simulation_day

def storeEndOfDayPrices():
    """
    Store the current day's stock prices in StockPriceHistory
    This should be called at the end of each trading day
    """
    current_day = get_current_simulation_day()
    stocks = Stock.objects.all()
    
    for stock in stocks:
        day_change = float(stock.currPrice) - float(stock.prevPrice)
        StockPriceHistory.objects.update_or_create(
            stockTicker=stock,
            day=current_day,
            defaults={
                'closingPrice': stock.currPrice,
                'openingPrice': stock.prevPrice,
                'dayChange': day_change
            }
        )
    
    print(f"Stored prices for {len(stocks)} stocks on day {current_day}")

def storePortfolioValues():
    """
    Store the current day's portfolio values for all users
    This should be called at the end of each trading day
    """
    current_day = get_current_simulation_day()
    users = SimulatorUser.objects.all()
    
    for user in users:
        # Calculate current portfolio value
        user_stocks = UserStock.objects.filter(user=user)
        stock_value = 0
        
        for user_stock in user_stocks:
            try:
                stock = Stock.objects.get(ticker=user_stock.stock.ticker)
                price = float(stock.currPrice)
                stock_value += price * float(user_stock.sharesAmount)
            except Stock.DoesNotExist:
                continue
        
        cash_balance = float(user.cashBalance)
        portfolio_value = stock_value + cash_balance
        
        # Store portfolio history
        PortfolioHistory.objects.update_or_create(
            user=user,
            day=current_day,
            defaults={
                'portfolioValue': portfolio_value,
                'cashBalance': cash_balance,
                'stockValue': stock_value
            }
        )
    
    print(f"Stored portfolio values for {len(users)} users on day {current_day}")

def incrementSimulationDay():
    """
    Increment the simulation day after storing end-of-day data
    This should be called after storeEndOfDayPrices and storePortfolioValues
    """
    timer = SimulationTimer.objects.first()
    if timer:
        timer.current_day += 1
        timer.save()
        print(f"Day incremented to {timer.current_day}")
        
        # Generate new opening prices for the new day
        from .startOfDayGenerator import generateStartOfDayPrices
        generateStartOfDayPrices()
    else:
        print("Warning: No timer found to increment day")

def getPriceDataForPeriod(ticker, period):
    """
    Get price data for different time periods
    period: '1w', '1m', '6m', '1y', 'all'
    """
    try:
        stock = Stock.objects.get(ticker=ticker)
        current_day = get_current_simulation_day()
        
        if period == '1w':
            days = 7
        elif period == '1m':
            days = 30
        elif period == '3m':
            days = 90
        elif period == '6m':
            days = 180
        elif period == '1y':
            days = 365
        elif period == 'all':
            days = 365 * 5  # 5 years max
        else:
            days = 30  # Default to 1 month
        
        start_day = current_day - days
        
        history = StockPriceHistory.objects.filter(
            stockTicker=stock,
            day__gte=start_day,
            day__lte=current_day
        ).order_by('day')
        
        return history
    except Stock.DoesNotExist:
        return None
