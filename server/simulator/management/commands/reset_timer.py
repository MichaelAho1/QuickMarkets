from django.core.management.base import BaseCommand
from django.utils import timezone
from simulator.utils import get_simulation_day

class Command(BaseCommand):
    help = 'Reset the simulation timer to start a new countdown'

    def handle(self, *args, **options):
        simulation_day = get_simulation_day()
        simulation_day.last_day_change = timezone.now()
        simulation_day.save()
        
        self.stdout.write(
            self.style.SUCCESS(f'Timer reset for Day {simulation_day.current_day}. Next day in {simulation_day.day_interval_minutes} minutes.')
        )
