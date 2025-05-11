from django.urls import path
from . import views

urlpatterns = [
    path('view-stock-prices/', views.ViewStockPrices.as_view(), name="view-prices"),
    path('view-simulator-user/', views.ViewSimulatorUser.as_view(), name='view-simulator-user'),
    path('view-price-history/', views.ViewHistoricalStockPrice.as_view(), name='stock-price-history'),
    path('buy-stock/', views.buyStock.as_view(), name="user-stock-list"),
    path('sell-stock/delete/<int:pk>/', views.sellStock.as_view(), name='user-stock-delete'),
]