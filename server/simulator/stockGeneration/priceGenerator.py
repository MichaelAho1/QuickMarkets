from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock
import math, random

#Calls everything in the order it needs to be called
def calculateMarketChanges():
    marketChange = generateTotalMarketPercentage("ALL") #Calculate first because it is needed for other calculations
    ETFPercentChanges = {"ALL":marketChange} #Add All because it has already been calculated
    stockPercentChanges = {}
    stockChanges = {}
    etfChanges = {}

    ETFs = ETF.objects.all()
    for etf in ETFs:
        if etf.ticker != "ALL": #Exclude TotalMarket because its price has already been calculated
            ETFPercentChanges[etf.ticker] = generateNewETFPercentage(etf.ticker, marketChange)

        etfChanges[etf.ticker] = (ETFPercentChanges[etf.ticker] * float(etf.price)) + float(etf.price) #Calculate the actual changes in price
    
    stocks = Stock.objects.all()
    for stock in stocks:
        #Stocks industry are the same as the ETFs ticker symbol
        ETFTicker = stock.sectorType.ticker
        industryChange = ETFPercentChanges[ETFTicker]

        stockPercentChanges[stock.ticker] = generateNewStockPercentage(stock.ticker, marketChange, industryChange)
        stockChanges[stock.ticker] = (stockPercentChanges[stock.ticker] * float(stock.currPrice)) + float(stock.currPrice)
        stock.prevPrice = stock.currPrice
        stock.currPrice = stockChanges[stock.ticker]
        stock.save()
    
    #print(marketChange)
    #print(etfChanges)
    #print(stockChanges)

def generateTotalMarketPercentage(ticker):
    TotalMarketETF = getETFData(ticker)
    changeInPrice = calculateGBM(float(TotalMarketETF.price), float(TotalMarketETF.volatility), float(TotalMarketETF.avgReturn))
    return changeInPrice

def generateNewETFPercentage(ticker, MarketChange):
    marketWeight = 0.75
    randomWeight = 0.25

    ETF = getETFData(ticker)
    randomChange = calculateGBM(float(ETF.price), float(ETF.volatility), float(ETF.avgReturn))
    #print(randomChange)
    return (randomChange * randomWeight) + (MarketChange * marketWeight)


def generateNewStockPercentage(ticker, allChange, industryChange):
    downPercentage = 0
    upPercentage = 0
    stock = getStockData(ticker)
    if (stock.prevPrice != 0):
        prevDayChange = ((stock.currPrice - stock.prevPrice) / stock.prevPrice)
        if (prevDayChange > 0):
            if (prevDayChange > 0.10):
                downPercentage = -0.18
            elif (prevDayChange > 0.5):
                downPercentage = -0.08
            else:
                downPercentage = -0.03
        elif (prevDayChange < 0):
            if (prevDayChange < -0.10):
                upPercentage = 0.18
            elif (prevDayChange < -0.5):
                upPercentage = 0.0
            else:
                upPercentage = 0.05

    industryWeight = 0.5
    randomWeight = 0.3
    #otherWeight = 0.2 (UnderValued/Overvalued/Earnings Report/Announcment)

    stock = getStockData(ticker)
    randomChange = calculateGBM(float(stock.currPrice), float(stock.volatility), float(stock.avgReturn))
    return (randomChange * randomWeight) + (industryChange * industryWeight) + (upPercentage * random.random()) + (downPercentage * random.random())


#Accounts for Volatility and Long-Term Growth in the market
def calculateGBM(previousPrice, volatility, avgReturn):
    volatility = volatility / 75
    avgReturn = avgReturn / 200 
    dt = 1 / 252

    # GBM formula
    epsilon = random.gauss(0, 1)
    drift = (avgReturn - 0.5 * volatility ** 2) * dt
    shock = volatility * math.sqrt(dt) * epsilon

    return (math.exp(drift + shock) - 1)

