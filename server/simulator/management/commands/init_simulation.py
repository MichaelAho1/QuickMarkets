from django.core.management.base import BaseCommand
from simulator.utils import get_simulation_day

class Command(BaseCommand):
    help = 'Initialize the simulation day system'

    def handle(self, *args, **options):
        simulation_day = get_simulation_day()
        self.stdout.write(
            self.style.SUCCESS(f'Simulation day initialized: Day {simulation_day.current_day} starting from {simulation_day.start_date}')
        )
