#!/usr/bin/env python
"""
Startup script to run the simulation scheduler
This script should be run alongside the Django server
"""
import subprocess
import sys
import os
import time
import signal
import threading

def run_simulation_scheduler():
    """Run the simulation scheduler in a separate process"""
    try:
        # Change to the server directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Run the simulation scheduler
        process = subprocess.Popen([
            sys.executable, 'manage.py', 'run_simulation_scheduler',
            '--start-of-day-interval', '5',
            '--during-day-interval', '5'
        ])
        
        return process
    except Exception as e:
        print(f"Error starting simulation scheduler: {e}")
        return None

def main():
    """Main function to start the simulation scheduler"""
    print("Starting simulation scheduler...")
    print("Start of day simulation: every 5 minutes")
    print("During day simulation: every 5 seconds")
    print("Press Ctrl+C to stop")
    
    scheduler_process = run_simulation_scheduler()
    
    if not scheduler_process:
        print("Failed to start simulation scheduler")
        sys.exit(1)
    
    try:
        # Wait for the process to complete or be interrupted
        scheduler_process.wait()
    except KeyboardInterrupt:
        print("\nStopping simulation scheduler...")
        scheduler_process.terminate()
        scheduler_process.wait()
        print("Simulation scheduler stopped.")

if __name__ == "__main__":
    main()
