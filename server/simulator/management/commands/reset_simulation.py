from django.core.management.base import BaseCommand
from simulator.models import StockPriceHistory
from simulator.utils import get_simulation_day

class Command(BaseCommand):
    help = 'Reset simulation day and clear all historical price data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--day',
            type=int,
            default=1,
            help='Set simulation day to this number (default: 1)'
        )
        parser.add_argument(
            '--keep-data',
            action='store_true',
            help='Keep historical data, only reset simulation day'
        )

    def handle(self, *args, **options):
        day = options['day']
        keep_data = options['keep_data']
        
        # Reset simulation day
        simulation_day = get_simulation_day()
        old_day = simulation_day.current_day
        simulation_day.current_day = day
        simulation_day.save()
        
        self.stdout.write(f'Simulation day reset from {old_day} to {day}')
        
        if not keep_data:
            # Clear all historical data
            count = StockPriceHistory.objects.count()
            StockPriceHistory.objects.all().delete()
            self.stdout.write(f'Cleared {count} historical price records')
        else:
            self.stdout.write('Historical data preserved')
        
        self.stdout.write(
            self.style.SUCCESS(f'✅ Simulation reset complete! Day {day}, Start date: {simulation_day.start_date}')
        )
