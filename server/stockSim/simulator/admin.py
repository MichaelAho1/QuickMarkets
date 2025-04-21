from django.contrib import admin
from .models import Stock
from .models import ETF

admin.site.register(Stock)
admin.site.register(ETF)