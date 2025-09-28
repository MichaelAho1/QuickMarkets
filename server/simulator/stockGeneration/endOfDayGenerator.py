"""
End of day generator to store daily stock prices in StockPriceHistory
This should be called at the end of each trading day to store the day's price data
"""
from datetime import date, datetime
from ..models import Stock, StockPriceHistory
import random

def storeEndOfDayPrices():
    """
    Store the current day's stock prices in StockPriceHistory
    This should be called at the end of each trading day
    """
    today = date.today()
    stocks = Stock.objects.all()
    
    for stock in stocks:
        # Check if we already have data for today
        existing_record = StockPriceHistory.objects.filter(
            stockTicker=stock,
            date=today
        ).first()
        
        if existing_record:
            # Update existing record
            existing_record.closingPrice = stock.currPrice
            existing_record.openingPrice = stock.prevPrice
            existing_record.dayChange = float(stock.currPrice) - float(stock.prevPrice)
            existing_record.save()
        else:
            # Create new record
            day_change = float(stock.currPrice) - float(stock.prevPrice)
            StockPriceHistory.objects.create(
                stockTicker=stock,
                date=today,
                closingPrice=stock.currPrice,
                openingPrice=stock.prevPrice,
                dayChange=day_change,
            )
    
    print(f"Stored end-of-day prices for {len(stocks)} stocks on {today}")

def getHistoricalData(ticker, days=30):
    """
    Get historical data for a specific stock
    Returns data for the specified number of days
    """
    try:
        stock = Stock.objects.get(ticker=ticker)
        end_date = date.today()
        start_date = date.fromordinal(end_date.toordinal() - days)
        
        history = StockPriceHistory.objects.filter(
            stockTicker=stock,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        return history
    except Stock.DoesNotExist:
        return None

def getPriceDataForPeriod(ticker, period):
    """
    Get price data for different time periods
    period: '1w', '1m', '6m', '1y', 'all'
    """
    try:
        stock = Stock.objects.get(ticker=ticker)
        end_date = date.today()
        
        if period == '1w':
            days = 7
        elif period == '1m':
            days = 30
        elif period == '6m':
            days = 180
        elif period == '1y':
            days = 365
        elif period == 'all':
            days = 365 * 5  # 5 years max
        else:
            days = 30  # Default to 1 month
        
        start_date = date.fromordinal(end_date.toordinal() - days)
        
        history = StockPriceHistory.objects.filter(
            stockTicker=stock,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        return history
    except Stock.DoesNotExist:
        return None
