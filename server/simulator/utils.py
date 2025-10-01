"""
Utility functions for the simulator
"""
from .models import Stock, ETF
from datetime import date

def get_current_simulation_date():
    """Get the current simulation date - now returns a fixed date"""
    return date(2024, 1, 1)

def getStockData(ticker):
    """Get stock data by ticker"""
    return Stock.objects.get(ticker=ticker)

def getETFData(ticker):
    """Get ETF data by ticker"""
    return ETF.objects.get(ticker=ticker)