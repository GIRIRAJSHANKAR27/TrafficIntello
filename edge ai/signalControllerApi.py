import time
import threading
import requests
import pandas as pd
from datetime import datetime

# Constants
JUNCTION_ID = "01"
LANES = [0, 1, 2, 3]
PREDICT_URL = "http://localhost:5000/predict"  # We are assuming prediction comes from the main app
SIGNAL_UPDATE_URL = "http://localhost:3000/api/signals/update"  # This is where signals are updated
VEHICLE_COUNT_API_TEMPLATE = "http://127.0.0.1:5000/vehicle_count/{}"

CROSSING_TIMES = {
    "car": 5,
    "motorcycle": 3,
    "truck": 7,
    "bus": 6,
}

stop_event = threading.Event()

def fetch_weather():
    return {
        "weather_condition": 1,
        "temperature": 28.0,
        "humidity": 55.0,
        "event_indicator": 0
    }

def fetch_vehicle_count(lane):
    try:
        response = requests.get(VEHICLE_COUNT_API_TEMPLATE.format(lane))
        response.raise_for_status()
        return response.json().get("counts", {})
    except Exception as e:
        print(f"Failed to fetch vehicle count for lane {lane}: {e}")
        return {}

def calculate_base_gst(vehicle_count):
    total_time = 0
    for vehicle_type, count in vehicle_count.items():
        total_time += count * CROSSING_TIMES.get(vehicle_type, 2)
    return total_time / len(LANES)

def get_adjustment_factor(input_data):
    try:
        response = requests.post(PREDICT_URL, json=input_data.to_dict(orient="records")[0])
        response.raise_for_status()
        adjustment_percent = response.json().get("adjustment_factor", 0)
        return adjustment_percent  # Return percentage (positive or negative)
    except Exception as e:
        print(f"Adjustment fetch error: {e}")
        return 0  # Default to no adjustment

def update_signal_state(current_lane, gst):
    signal_state = [{
        "lane": lane,
        "signal": "green" if lane == current_lane else "red",
        "gst": gst if lane == current_lane else 0
    } for lane in LANES]

    payload = {
        "junctionId": JUNCTION_ID,
        "signalState": signal_state
    }

    try:
        res = requests.post(SIGNAL_UPDATE_URL, json=payload)
        res.raise_for_status()
        print(f"✅ Signals updated: {signal_state}")
    except Exception as e:
        print(f"❌ Failed to update signal state: {e}")

def signal_controller_loop():
    while not stop_event.is_set():
        for lane in LANES:
            if stop_event.is_set():
                break
            print(f"\n🟢 Processing Lane {lane}")
            vehicle_count = fetch_vehicle_count(lane)
            print(f"📊 Vehicle count: {vehicle_count}")
            base_gst = calculate_base_gst(vehicle_count)

            now = datetime.now()
            weather = fetch_weather()

            input_data = pd.DataFrame({
                "Time_of_Day": [now.hour],
                "Day_of_Week": [now.weekday()],
                "Month": [now.month],
                "Weather_Condition": [weather["weather_condition"]],
                "Temperature": [weather["temperature"]],
                "Humidity": [weather["humidity"]],
                "Traffic_Volume": [sum(vehicle_count.values())],
                "Event_Indicator": [weather["event_indicator"]]
            })

            print(f"📥 Input data for prediction: {input_data}")
            adjustment_percent = get_adjustment_factor(input_data)
            print(f"Adjustment factor: {adjustment_percent}%")

            final_gst = base_gst * (1 + (adjustment_percent / 100))  # Adjust by the percentage
            final_gst = max(5, int(final_gst))  # Enforce minimum GST of 5 seconds
            print(f"🕒 Final GST for lane {lane}: {final_gst} seconds")

            update_signal_state(lane, final_gst)

            time.sleep(final_gst)

def run_signal_controller():
   signal_controller_loop()