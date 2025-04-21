from .models import Stock
from .models import ETF

def getStockData(ticker_symbol):
    try:
        return Stock.objects.get(ticker=ticker_symbol.upper())
    except Stock.DoesNotExist:
        return None
    
def getETFData(ticker_symbol):
    try:
        return ETF.objects.get(ticker=ticker_symbol.upper())
    except ETF.DoesNotExist:
        return None