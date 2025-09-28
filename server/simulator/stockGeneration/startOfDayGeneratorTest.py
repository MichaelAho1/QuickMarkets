from simulator.stockGeneration.priceGenerator import calculateMarketChanges
from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock


def test_update_refresh_price():
    cvxStock = getStockData("CVX")
    for i in range(0, 1000, 25):
        print("Price", i, ": ", cvxStock.currPrice)
        print("Prev Price:",cvxStock.prevPrice)
        calculateMarketChanges()
        cvxStock.refresh_from_db()
    refresh_price()

def test_update_price():
    cvxStock = getStockData("CVX")
    for i in range(0, 1000, 10):
        print("Price", i, cvxStock.currPrice)
        print("Prev Price:",cvxStock.prevPrice)
        calculateMarketChanges()
        cvxStock.refresh_from_db()

def refresh_price():
    prices = {"CVX": 168.34, "PEP": 187.34, "PG": 151.78, "V":243.56, "JPM": 157.89, 
            "GOOG":151.23, "NVDA":593.45, "AMZN":149.34, "MSFT":332.12, "AAPL":184.56}
    stocks = Stock.objects.all()
    for stock in stocks:
        stock.currPrice = prices[stock.ticker]
        stock.prevPrice = prices[stock.ticker]
        stock.save()
