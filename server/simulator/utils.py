"""
Utility functions for the simulator
"""
from .models import SimulationDay, Stock, ETF
from datetime import date

def get_simulation_day():
    """Get the current simulation day, create if it doesn't exist"""
    simulation_day, created = SimulationDay.objects.get_or_create(
        id=1,  # Always use id=1 for the single simulation day record
        defaults={
            'current_day': 1,
            'start_date': date(2024, 1, 1)
        }
    )
    return simulation_day

def get_current_simulation_date():
    """Get the current simulation date"""
    return get_simulation_day().get_simulation_date()

def increment_simulation_day():
    """Increment the simulation day and return the new date"""
    simulation_day = get_simulation_day()
    return simulation_day.increment_day()

def getStockData(ticker):
    """Get stock data by ticker"""
    return Stock.objects.get(ticker=ticker)

def getETFData(ticker):
    """Get ETF data by ticker"""
    return ETF.objects.get(ticker=ticker)