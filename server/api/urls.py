from django.urls import path
from . import views

urlpatterns = [
    path("getUpdatedPrices/", views.ViewStockPrices.as_view(), name="update-price"),
    path('view-simulator-user/', views.ViewSimulatorUser.as_view(), name='view-simulator-user'),
]