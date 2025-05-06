from django.db import models

class Stock(models.Model):
    ticker = models.CharField(max_length=4)
    name = models.CharField(max_length=25)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    prev_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    volatility = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) #Percentage
    avgReturn = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) #Percentage
    date = models.DateTimeField(auto_now_add=True)
    #industries - Tech, Finance, Consumer, Energy
    industry = models.CharField(max_length=15, default="Tech")
    


    def __str__(self):
        return self.ticker
    
#Collection of stocks of a certain industry
class ETF(models.Model):
    ticker = models.CharField(max_length=4)
    name = models.CharField(max_length=25, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    prev_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    volatility = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) #Percentage
    avgReturn = models.DecimalField(max_digits=3, decimal_places=1, default=00.0) #Percentage
    date = models.DateTimeField(auto_now_add=True)
    #industries - Tech, Finance, Consumer, Energy
    industry = models.CharField(max_length=15, default="Tech")


    def __str__(self):
        return self.ticker