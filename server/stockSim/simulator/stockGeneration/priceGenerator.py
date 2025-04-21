from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock
from decimal import Decimal
import math, random

def generateNewPrices():
    marketChange = generateTotalMarketPrice("ALL")
    ETFChanges = {}
    stockChanges = {}

    ETFs = ETF.objects.all()
    for etf in ETFs:
        if(etf.ticker != "ALL"): #Exclude all because its price has already been calculated
            ETFChanges[etf.ticker] = generateNewETFPrice(etf.ticker, marketChange)
    
    stocks = Stock.objects.all()
    for stock in stocks:
        ETFTicker = stock.industry #Stocks industry are the same as the ETFs ticker symbol
        industryChange = ETFChanges[ETFTicker]
        stockChanges[stock.ticker] = generateNewStockPrice(stock.ticker, marketChange, industryChange)

    total = 0
    tentotal = 0
    print(marketChange)
    print(ETFChanges["TECH"])
    print(stockChanges["NVDA"])
    for i in range(0, 365):
        total += generateTotalMarketPrice("ALL")
    for i in range(0, 3650):
        tentotal += generateTotalMarketPrice("ALL")
    print(total)
    print(tentotal)

def generateTotalMarketPrice(ticker):
    TotalMarketETF = getETFData(ticker)
    changeInPrice = calculateGBM(float(TotalMarketETF.price), float(TotalMarketETF.volatility), float(TotalMarketETF.avgReturn))
    return changeInPrice


def generateNewETFPrice(ticker, MarketChange):
    marketWeight = 0.75
    randomWeight = 0.25

    ETF = getETFData(ticker)
    randomChange = calculateGBM(float(ETF.price), float(ETF.volatility), float(ETF.avgReturn))
    #print(randomChange)
    return (randomChange * randomWeight) + (MarketChange * marketWeight)


def generateNewStockPrice(ticker, allChange, industryChange):
    industryWeight = 0.6
    randomWeight = 0.4

    stock = getStockData(ticker)
    randomChange = calculateGBM(float(stock.price), float(stock.volatility), float(stock.avgReturn))
    return (randomChange * randomWeight) + (industryChange * industryWeight)


#Accounts for Volatility and Long-Term Growth in the market
def calculateGBM(previousPrice, volatility, avgReturn):
    # Convert to decimal
    volatility = volatility / 75
    avgReturn = avgReturn / 200
    dt = 1 / 252

    # GBM components
    epsilon = random.gauss(0, 1)
    drift = (avgReturn - 0.5 * volatility ** 2) * dt
    shock = volatility * math.sqrt(dt) * epsilon

    # Return percent change
    return (math.exp(drift + shock) - 1) * 100