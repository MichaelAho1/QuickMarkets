from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from simulator.models import User as SimulatorUser
from rest_framework.test import APIClient

class ViewSimulatorUserTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.simulator_user = SimulatorUser.objects.create(username=self.user.username, cashBalance=100000.00)

    def testViewSimulatoruser(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/view-simulator-user/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['cashBalance'], self.simulator_user.cashBalance)
   
    def testViewStockPrices(self):
        response = self.client.get('/api/view-stock-prices/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def testViewStockHistory(self):
        response = self.client.get('/api/view-price-history/?ticker=PEP')
        self.assertEqual(response.status_code, status.HTTP_200_OK)