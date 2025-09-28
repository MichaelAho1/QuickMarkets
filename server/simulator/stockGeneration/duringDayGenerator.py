"""
After the first price is generated, this gets called to generate random price changes throughout the day (every 30 seconds)
"""
import random
from ..models import Stock

def generateDuringDayChanges():
    """
    Returns a random percent change for each stock should be very low (0.1 - 0.2%) 
    and 50% of the time positive and 50% of the time negative
    """
    stocks = Stock.objects.all()
    price_changes = {}
    
    for stock in stocks:
        # Generate a random percentage change between 0.1% and 0.2%
        base_change = random.uniform(0.001, 0.002)  # 0.1% to 0.2%
        
        # 50% chance of being positive, 50% chance of being negative
        if random.random() < 0.5:
            price_changes[stock.ticker] = base_change  # Positive change
        else:
            price_changes[stock.ticker] = -base_change  # Negative change
    
    return price_changes

def applyDuringDayChanges(price_changes):
    """
    Apply the generated price changes to the stocks
    """
    for ticker, change_percent in price_changes.items():
        try:
            stock = Stock.objects.get(ticker=ticker)
            # Calculate new price based on percentage change
            new_price = float(stock.currPrice) * (1 + change_percent)
            stock.currPrice = new_price
            stock.save()
        except Stock.DoesNotExist:
            print(f"Stock {ticker} not found, skipping...")
            continue
    