from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock
from decimal import Decimal
import math, random

def generateNewPrices():
    totalMarketChange = generateTotalMarketPrice("ALL")
    ETFChanges = {}
    stockChanges = {}

    ETFs = ETF.objects.all()
    for etf in ETFs:
        if(etf.ticker != "ALL"): #Exclude all because its price has already been calculated
            ETFChanges[etf.ticker] = generateNewETFPrice(etf.ticker, totalMarketChange)
    
    stocks = Stock.objects.all()
    for stock in stocks:
        ETFTicker = stock.industry #Stocks industry are the same as the ETFs ticker symbol
        industryChange = ETFChanges[ETFTicker]
        stockChanges[stock.ticker] = generateNewStockPrice(stock.ticker, totalMarketChange, industryChange)
    
    return stockChanges

def generateTotalMarketPrice(ticker):
    TotalMarketETF = getETFData(ticker)
    changeInPrice = calculateGBM(float(TotalMarketETF.price), float(TotalMarketETF.volatility), float(TotalMarketETF.avgReturn))
    return changeInPrice

def generateNewETFPrice(ticker, allChange):
    ETF = getETFData(ticker)
    changeInPrice = calculateGBM(float(ETF.price), float(ETF.volatility), float(ETF.avgReturn))
    return changeInPrice

def generateNewStockPrice(ticker, allChange, industryChange):
    stock = getStockData(ticker)
    changeInPrice = calculateGBM(float(stock.price), float(stock.volatility), float(stock.avgReturn))
    return changeInPrice

def calculateGBM(previousPrice, volatility, avgReturn):
    #Convert Percentages into decimals
    volatility = (volatility/100)/252
    avgReturn = (avgReturn/100)/252

    #GBM formula
    epsilon = random.gauss(0, 1)
    drift = avgReturn - 0.5 * volatility ** 2
    shock = epsilon * volatility * math.sqrt(1)

    return (math.exp(drift + shock) - 1)*1000