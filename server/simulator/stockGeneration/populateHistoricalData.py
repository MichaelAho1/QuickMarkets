"""
Script to populate initial historical data for testing charts
This should be run once to create some sample historical data
"""
from datetime import date, timedelta
from ..models import Stock, StockPriceHistory
import random

def populateHistoricalData(days_back=30):
    """
    Populate historical data for the last N days
    This creates sample data for testing the charts
    """
    stocks = Stock.objects.all()
    if not stocks:
        print("No stocks found. Please create some stocks first.")
        return
    
    today = date.today()
    
    for stock in stocks:
        print(f"Creating historical data for {stock.ticker}...")
        
        # Start with the current price and work backwards
        current_price = float(stock.currPrice)
        
        for i in range(days_back):
            data_date = today - timedelta(days=i)
            
            # Skip if data already exists for this date
            if StockPriceHistory.objects.filter(stockTicker=stock, date=data_date).exists():
                continue
            
            # Generate realistic price movement
            # Small random change between -2% and +2%
            price_change_percent = random.uniform(-0.02, 0.02)
            new_price = current_price * (1 + price_change_percent)
            
            # Ensure price doesn't go below $0.01
            new_price = max(new_price, 0.01)
            
            # Create the historical record
            StockPriceHistory.objects.create(
                stockTicker=stock,
                date=data_date,
                closingPrice=new_price,
                openingPrice=current_price,
                dayChange=new_price - current_price,
            )
            
            # Update current_price for next iteration (going backwards)
            current_price = new_price
    
    print(f"Historical data created for {len(stocks)} stocks over {days_back} days")

def clearHistoricalData():
    """
    Clear all historical data (useful for testing)
    """
    StockPriceHistory.objects.all().delete()
    print("All historical data cleared")

if __name__ == "__main__":
    populateHistoricalData(30)  # Create 30 days of data
