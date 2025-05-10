from simulator.models import Stock, ETF

def startSim():
    setETFPrices()
    setStockPrices()

def setStockPrices():
    prices = {
        "CVX": {"stockName": "Chevron", "currPrice": 168.34, "etf_ticker": "ENRG"},
        "PEP": {"stockName": "PepsiCo", "currPrice": 187.34, "etf_ticker": "CONS"},
        "PG": {"stockName": "Procter & Gamble", "currPrice": 151.78, "etf_ticker": "CONS"},
        "V": {"stockName": "Visa", "currPrice": 243.56, "etf_ticker": "FIN"},
        "JPM": {"stockName": "JPMorgan Chase", "currPrice": 157.89, "etf_ticker": "FIN"},
        "GOOG": {"stockName": "Alphabet", "currPrice": 151.23, "etf_ticker": "TECH"},
        "NVDA": {"stockName": "NVIDIA", "currPrice": 593.45, "etf_ticker": "TECH"},
        "AMZN": {"stockName": "Amazon", "currPrice": 149.34, "etf_ticker": "CONS"},
        "MSFT": {"stockName": "Microsoft", "currPrice": 332.12, "etf_ticker": "TECH"},
        "AAPL": {"stockName": "Apple", "currPrice": 184.56, "etf_ticker": "TECH"},
    }

    for ticker, data in prices.items():
        sector = ETF.objects.get(ticker=data["etf_ticker"])

        Stock.objects.update_or_create(
            ticker=ticker,
            defaults={
                "stockName": data["stockName"],
                "currPrice": data["currPrice"],
                "sectorType": sector,  
                "volatility": .3, #Should be between 10-45
                "avgReturn": 0.18
            }
        )
            
def setETFPrices():
    etfs = {
        "TECH": {"name": "Top Tech 10", "price": 150.00, "industry": "Tech"},
        "FIN": {"name": "Top Finance 20", "price": 120.00, "industry": "Finance"},
        "ENRG": {"name": "Top Energy 5", "price": 95.00, "industry": "Energy"},
        "CONS": {"name": "Top Consumer 15", "price": 105.00, "industry": "Consumer"},
    }

    for ticker, data in etfs.items():
        ETF.objects.update_or_create(
            ticker=ticker,
            defaults={
                "name": data["name"],
                "price": data["price"],
                "prev_price": data["price"],
                "industry": data["industry"],
                "volatility": .2,
                "avgReturn": 0.18,
            }
        )

