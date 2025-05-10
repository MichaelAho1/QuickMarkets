from django.contrib import admin
from .models import Stock, User, UserStock, StockPriceHistory, ETF, Transaction

admin.site.register(Stock)
admin.site.register(User)
admin.site.register(UserStock)
admin.site.register(StockPriceHistory)
admin.site.register(ETF)
admin.site.register(Transaction)