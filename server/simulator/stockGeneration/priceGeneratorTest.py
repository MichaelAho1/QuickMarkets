from simulator.stockGeneration.priceGenerator import calculateMarketChanges
from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock


def test_update_refresh_price():
    cvxStock = getStockData("CVX")
    for i in range(1000):
        print("Price", i, cvxStock.price)
        print("Prev Price:",cvxStock.prev_price)
        calculateMarketChanges()
        cvxStock.refresh_from_db()
    refresh_price()

def test_update_price():
    cvxStock = getStockData("CVX")
    for i in range(1000):
        print("Price", i, cvxStock.price)
        print("Prev Price:",cvxStock.prev_price)
        calculateMarketChanges()
        cvxStock.refresh_from_db()

def refresh_price():
    prices = {"CVX": 168.34, "PEP": 187.34, "PG": 151.78, "V":243.56, "JPM": 157.89, 
            "GOOG":151.23, "NVDA":593.45, "AMZN":149.34, "MSFT":332.12, "AAPL":184.56}
    stocks = Stock.objects.all()
    for stock in stocks:
        stock.price = prices[stock.ticker]
        stock.prev_price = prices[stock.ticker]
        stock.save()
