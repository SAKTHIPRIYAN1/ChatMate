#!/bin/bash

# Shutdown Confirmation Script

# Prompt the user for confirmation
if zenity --question --width=300 --height=100 --title="Shutdown Confirmation" --text="Are you sure you want to shut down the system now?"; then
    # If user confirms, proceed to shutdown
    zenity --info --text="System is shutting down..."
    sudo shutdown now
else
    # If user cancels, display cancellation message
    zenity --info --text="Shutdown canceled."
fi

