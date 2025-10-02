from simulator.stockGeneration.endOfDayGenerator import storeEndOfDayPrices
from simulator.utils import getStockData, getETFData
from ..models import ETF, Stock


def test_storeEndOfDayPrices():
    storeEndOfDayPrices()
