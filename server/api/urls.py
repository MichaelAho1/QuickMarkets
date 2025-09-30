from django.urls import path
from . import views

urlpatterns = [
    path('view-stock-prices/', views.ViewStockPrices.as_view(), name="view-prices"),
    path('view-simulator-user/', views.ViewSimulatorUser.as_view(), name='view-simulator-user'),
    path('view-price-history/', views.ViewHistoricalStockPrice.as_view(), name='stock-price-history'),
    path('buy-stock/', views.buyStock.as_view(), name="buy-stock"),
    path('sell-stock/', views.sellStock.as_view(), name='sell-stock'),
    path('transaction-history/', views.TransactionHistoryView.as_view(), name='transaction-history'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('watchlist/', views.WatchlistView.as_view(), name='watchlist'),
    path('simulate-during-day/', views.SimulateDuringDayView.as_view(), name='simulate-during-day'),
    path('stock-chart-data/', views.StockChartDataView.as_view(), name='stock-chart-data'),
    path('portfolio-chart-data/', views.PortfolioChartDataView.as_view(), name='portfolio-chart-data'),
    path('simulation-day/', views.SimulationDayView.as_view(), name='simulation-day'),
    path('simulation-timer/', views.SimulationTimerView.as_view(), name='simulation-timer'),
]