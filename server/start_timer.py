"""
Script to start the simulation timer
Run this script to start the timer that calls EndOfDayGenerator every 5 minutes 
and duringDayGenerator every 5 seconds
"""
import os
import sys
import django
import signal
import time

# Add the server directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from simulator.timer_service import timer_service

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print('\nStopping timer...')
    result = timer_service.stop_timer()
    print(f"Timer stopped: {result['message']}")
    sys.exit(0)

def main():
    """Main function to start the timer"""
    print("Starting Simulation Timer...")
    print("This timer will:")
    print("- Call EndOfDayGenerator every 15 seconds")
    print("- Call duringDayGenerator every 5 seconds")
    print("- Store timer state in the database")
    print("\nPress Ctrl+C to stop the timer\n")
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start the timer
    result = timer_service.start_timer()
    if result['status'] == 'success':
        print(f"✅ Timer started successfully!")
        print("Timer is now running in the background...")
        
        # Keep the script running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            signal_handler(signal.SIGINT, None)
    else:
        print(f"❌ Failed to start timer: {result['message']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
