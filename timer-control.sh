#!/bin/bash

# Timer Service Control Script
# Use this to start/stop/restart the timer service

TIMER_DIR="~/quickmarkets-timer"
COMPOSE_FILE="docker-compose.timer.yml"

cd $TIMER_DIR

case "$1" in
    start)
        echo "🚀 Starting timer service..."
        docker-compose -f $COMPOSE_FILE up -d
        echo "✅ Timer service started!"
        ;;
    stop)
        echo "🛑 Stopping timer service..."
        docker-compose -f $COMPOSE_FILE down
        echo "✅ Timer service stopped!"
        ;;
    restart)
        echo "🔄 Restarting timer service..."
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE up -d
        echo "✅ Timer service restarted!"
        ;;
    status)
        echo "📊 Timer service status:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    logs)
        echo "📋 Timer service logs:"
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the timer service"
        echo "  stop    - Stop the timer service"
        echo "  restart - Restart the timer service"
        echo "  status  - Show service status"
        echo "  logs    - Show service logs"
        exit 1
        ;;
esac
