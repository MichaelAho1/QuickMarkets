from django.core.management.base import BaseCommand
from simulator.stockGeneration.populateHistoricalData import populateHistoricalData, clearHistoricalData

class Command(BaseCommand):
    help = 'Populate historical stock data for testing charts'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days of historical data to create (default: 30)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing historical data before populating'
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing historical data...')
            clearHistoricalData()
        
        days = options['days']
        self.stdout.write(f'Creating {days} days of historical data...')
        
        try:
            populateHistoricalData(days)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {days} days of historical data')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating historical data: {str(e)}')
            )
