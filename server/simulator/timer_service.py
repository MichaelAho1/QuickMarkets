"""
Timer service for managing the simulation timer
Calls EndOfDayGenerator every 5 minutes and duringDayGenerator every 5 seconds
"""
import threading
import time
from datetime import datetime, timedelta
from django.utils import timezone
from .models import SimulationTimer
from .stockGeneration.endOfDayGenerator import storeEndOfDayPrices, storePortfolioValues
from .stockGeneration.duringDayGenerator import generateDuringDayChanges, applyDuringDayChanges


class SimulationTimerService:
    """
    Service class to manage the simulation timer
    """
    _instance = None
    _lock = threading.Lock()
    _timer_thread = None
    _stop_event = threading.Event()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(SimulationTimerService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.initialized = True

    def _ensure_timer_exists(self):
        """Ensure a timer instance exists in the database"""
        try:
            timer, created = SimulationTimer.objects.get_or_create(
                defaults={
                    'is_running': False,
                    'total_seconds_elapsed': 0
                }
            )
            return timer
        except Exception as e:
            print(f"Error ensuring timer exists: {e}")
            return None

    def start_timer(self):
        """Start the simulation timer"""
        with self._lock:
            if self._timer_thread and self._timer_thread.is_alive():
                return {"status": "error", "message": "Timer is already running"}

            # Get or create timer instance
            timer = self._ensure_timer_exists()
            
            # Reset stop event
            self._stop_event.clear()
            
            # Start timer thread
            self._timer_thread = threading.Thread(target=self._timer_loop, daemon=True)
            self._timer_thread.start()
            
            # Update database
            timer.is_running = True
            timer.start_time = timezone.now()
            timer.save()
            
            return {"status": "success", "message": "Timer started"}

    def stop_timer(self):
        """Stop the simulation timer"""
        with self._lock:
            if not self._timer_thread or not self._timer_thread.is_alive():
                return {"status": "error", "message": "Timer is not running"}

            # Signal stop
            self._stop_event.set()
            
            # Wait for thread to finish (with timeout)
            if self._timer_thread.is_alive():
                self._timer_thread.join(timeout=2.0)
            
            # Update database
            timer = SimulationTimer.objects.first()
            if timer:
                timer.is_running = False
                timer.save()
            
            return {"status": "success", "message": "Timer stopped"}

    def get_timer_status(self):
        """Get current timer status"""
        timer = SimulationTimer.objects.first()
        if not timer:
            return {"status": "error", "message": "No timer found"}
        
        current_time = timezone.now()
        elapsed_seconds = 0
        
        if timer.is_running and timer.start_time:
            elapsed_seconds = int((current_time - timer.start_time).total_seconds())
            elapsed_seconds += timer.total_seconds_elapsed
        
        return {
            "status": "success",
            "is_running": timer.is_running,
            "start_time": timer.start_time.isoformat() if timer.start_time else None,
            "total_seconds_elapsed": elapsed_seconds,
            "last_end_of_day_call": timer.last_end_of_day_call.isoformat() if timer.last_end_of_day_call else None,
            "last_during_day_call": timer.last_during_day_call.isoformat() if timer.last_during_day_call else None
        }

    def _timer_loop(self):
        """Main timer loop that runs in a separate thread"""
        timer = SimulationTimer.objects.first()
        if not timer:
            return

        start_time = timezone.now()
        last_end_of_day_time = timer.last_end_of_day_call or start_time
        last_during_day_time = timer.last_during_day_call or start_time
        
        while not self._stop_event.is_set():
            current_time = timezone.now()
            
            # Check if 15 seconds have passed since last end of day call
            if (current_time - last_end_of_day_time).total_seconds() >= 15:  # 15 seconds
                try:
                    print("Calling EndOfDayGenerator...")
                    storeEndOfDayPrices()
                    storePortfolioValues()
                    last_end_of_day_time = current_time
                    
                    # Update database
                    timer.last_end_of_day_call = current_time
                    timer.save()
                    print("EndOfDayGenerator completed successfully")
                except Exception as e:
                    print(f"Error in EndOfDayGenerator: {e}")
            
            # Check if 5 seconds have passed since last during day call
            if (current_time - last_during_day_time).total_seconds() >= 5:
                try:
                    print("Calling duringDayGenerator...")
                    price_changes = generateDuringDayChanges()
                    applyDuringDayChanges(price_changes)
                    last_during_day_time = current_time
                    
                    # Update database
                    timer.last_during_day_call = current_time
                    timer.save()
                    print("duringDayGenerator completed successfully")
                except Exception as e:
                    print(f"Error in duringDayGenerator: {e}")
            
            # Update total elapsed time
            elapsed_seconds = int((current_time - start_time).total_seconds())
            timer.total_seconds_elapsed = elapsed_seconds
            timer.save()
            
            # Sleep for 1 second before next check
            time.sleep(1)

    def reset_timer(self):
        """Reset the timer to initial state"""
        with self._lock:
            # Stop timer if running
            if self._timer_thread and self._timer_thread.is_alive():
                self._stop_event.set()
                self._timer_thread.join(timeout=2.0)
            
            # Reset database
            timer = SimulationTimer.objects.first()
            if timer:
                timer.is_running = False
                timer.start_time = None
                timer.last_end_of_day_call = None
                timer.last_during_day_call = None
                timer.total_seconds_elapsed = 0
                timer.save()
            
            return {"status": "success", "message": "Timer reset"}


# Global instance
timer_service = SimulationTimerService()
