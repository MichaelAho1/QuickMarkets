"""
Django management command to run automated simulation scheduler
"""
import time
import threading
from django.core.management.base import BaseCommand
from django.utils import timezone
from simulator.stockGeneration.startOfDayGenerator import calculateMarketChanges
from simulator.stockGeneration.duringDayGenerator import generateDuringDayChanges, applyDuringDayChanges
from simulator.stockGeneration.endOfDayGenerator import storeEndOfDayPrices, storePortfolioValues
from simulator.models import SimulationDay
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Run automated simulation scheduler'

    def add_arguments(self, parser):
        parser.add_argument(
            '--start-of-day-interval',
            type=int,
            default=5,
            help='Start of day simulation interval in minutes (default: 5)'
        )
        parser.add_argument(
            '--during-day-interval',
            type=int,
            default=5,
            help='During day simulation interval in seconds (default: 5)'
        )

    def handle(self, *args, **options):
        start_of_day_interval = options['start_of_day_interval']
        during_day_interval = options['during_day_interval']
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Starting simulation scheduler...\n'
                f'Start of day: every {start_of_day_interval} minutes\n'
                f'During day: every {during_day_interval} seconds'
            )
        )
        
        # Start the scheduler in a separate thread
        scheduler_thread = threading.Thread(
            target=self._run_scheduler,
            args=(start_of_day_interval, during_day_interval),
            daemon=True
        )
        scheduler_thread.start()
        
        # Keep the main thread alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('Simulation scheduler stopped.'))

    def _run_scheduler(self, start_of_day_interval, during_day_interval):
        """Run the simulation scheduler - now only handles during-day updates"""
        during_day_seconds = during_day_interval  # Already in seconds
        
        last_during_day = timezone.now()
        
        while True:
            current_time = timezone.now()
            
            # Note: Start of day simulation is now handled automatically by the timer API
            # when the countdown reaches 0. No manual scheduling needed.
            
            # Check if it's time for during day simulation
            if (current_time - last_during_day).total_seconds() >= during_day_seconds:
                try:
                    self._run_during_day_simulation()
                    last_during_day = current_time
                except Exception as e:
                    logger.error(f"Error in during day simulation: {e}")
            
            # Sleep for 1 second before checking again (since during day runs every 5 seconds)
            time.sleep(1)

    def _run_during_day_simulation(self):
        """Run during day simulation"""
        logger.info("Running during day simulation...")
        
        try:
            price_changes = generateDuringDayChanges()
            applyDuringDayChanges(price_changes)
            logger.info(f"During day simulation completed - {len(price_changes)} changes applied")
        except Exception as e:
            logger.error(f"Error in during day simulation: {e}")
