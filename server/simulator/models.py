from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50, primary_key=True)
    cashBalance = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.username
    
class ETF(models.Model):
    ticker = models.CharField(max_length=4, unique=True, primary_key=True) 
    name = models.CharField(max_length=25, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    prev_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    volatility = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) 
    avgReturn = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) 
    date = models.DateTimeField(auto_now_add=True)
    #industries - Tech, Finance, Consumer, Energy
    industry = models.CharField(max_length=15, default="Tech")

    def __str__(self):
        return f"{self.ticker}"


class Stock(models.Model):
    ticker = models.CharField(max_length=10, primary_key=True)
    stockName = models.CharField(max_length=50, default='') 
    currPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    prevPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sectorType = models.ForeignKey(ETF, on_delete=models.CASCADE, db_column='etf_ticker', to_field='ticker')
    volatility = models.DecimalField(max_digits=3, decimal_places=1, default=0.0) 
    avgReturn = models.DecimalField(max_digits=3, decimal_places=1, default=0.0) 

    def __str__(self):
        return self.ticker
    
class UserStock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='username', to_field='username')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, db_column='ticker', to_field='ticker')
    sharesAmount = models.DecimalField(max_digits=10, decimal_places=4, default=0.0000) 
    averageCost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = (('user', 'stock'),)

    def __str__(self):
        return f"{self.user.username} - {self.stock.ticker}"

class StockPriceHistory(models.Model):
    stockTicker = models.ForeignKey(Stock, on_delete=models.CASCADE, db_column='ticker', to_field='ticker')
    date = models.DateField() 
    closingPrice = models.DecimalField(max_digits=8, decimal_places=2, default=0.00) 

    class Meta:
        unique_together = (('stockTicker', 'date'),)

    def __str__(self):
        return f"{self.stockTicker.ticker} on {self.date}"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    shares = models.FloatField()
    transactionType = models.CharField(max_length=4, choices=[("BUY", "Buy"), ("SELL", "Sell")])
    priceAtTransaction = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)