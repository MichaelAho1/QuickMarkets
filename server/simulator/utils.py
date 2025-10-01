"""
Utility functions for the simulator
"""
from .models import Stock, ETF, SimulationTimer
from datetime import date

def get_current_simulation_date():
    """Get the current simulation date - now returns a fixed date"""
    return date(2024, 1, 1)

def get_current_simulation_day():
    """Get the current simulation day number from the timer"""
    from .timer_service import timer_service
    return timer_service.get_current_day()

def getStockData(ticker):
    """Get stock data by ticker"""
    return Stock.objects.get(ticker=ticker)

def getETFData(ticker):
    """Get ETF data by ticker"""
    return ETF.objects.get(ticker=ticker)