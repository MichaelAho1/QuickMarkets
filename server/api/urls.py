from django.urls import path
from . import views

urlpatterns = [
    path("getUpdatedPrices/", views.ViewStockPrices.as_view(), name="update-price")
]