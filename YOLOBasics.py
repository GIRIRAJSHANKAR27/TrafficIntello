from flask import Flask, request, jsonify
import cv2
from ultralytics import YOLO
import random
import math
import requests

app = Flask(__name__)

# YOLO Model initialization (Load once when the server starts)
model = YOLO('yolov8n.pt')

# Class names
classNames = ["person", "bicycle", "car", "motorbike", "ambulance", "bus", "train", "truck",
              "traffic light", "fire hydrant", "stop sign", "bird", "cat",
              "dog", "horse", "sheep", "cow"]
PREDICTION_API_URL = "http://localhost:5001/predict"

# Global dictionary to track the video capture object and frame for each video path
video_capture_dict = {}

def get_random_values():
    """Generate random values for the prediction API."""
    return {
        "Time_of_Day": random.randint(0, 23),
        "Day_of_Week": random.randint(1, 7),
        "Month": random.randint(1, 12),
        "Weather_Condition": random.randint(0, 1),  # 0 for normal, 1 for bad weather
        "Temperature": random.uniform(15, 35),
        "Humidity": random.uniform(20, 80),
        "Traffic_Volume": random.randint(50, 500),
        "Event_Indicator": random.randint(0, 1)  # 0 for no event, 1 for an event
    }

def find_vals(video_path):
    # Check if the video is already open in the dictionary
    if video_path not in video_capture_dict:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None, "Failed to open video."
        video_capture_dict[video_path] = {
            "cap": cap,
            "current_frame": 0
        }
    
    cap = video_capture_dict[video_path]["cap"]

    current_cars = []
    current_trucks = []
    current_bikes = []

    success, img = cap.read()
    if not success:
        # Reset the frame to 0 if we reached the end of the video and release capture
        cap.release()
        del video_capture_dict[video_path]  # Remove from the dictionary
        return None, "End of the video reached."

    # Run YOLO detection on the frame
    results = model(img, stream=True)

    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            cls = int(box.cls[0])
            if classNames[cls] == "ambulance":
                return [-1], None

            if classNames[cls] in ["car", "truck", "motorbike"]:
                if classNames[cls] == "car":
                    current_cars.append((x1, y1, x2, y2))
                elif classNames[cls] == "truck":
                    current_trucks.append((x1, y1, x2, y2))
                elif classNames[cls] == "motorbike":
                    current_bikes.append((x1, y1, x2, y2))

    car_density = len(current_cars)
    truck_density = len(current_trucks)
    bikes_density = len(current_bikes)

    # Update the current frame number for the next API request
    video_capture_dict[video_path]["current_frame"] += 300

    return [car_density, bikes_density, truck_density], None

def adjust_gst_with_prediction(gst, densities):
    """Adjust the calculated GST based on the prediction API response."""
    data = get_random_values()

    try:
        response = requests.post(PREDICTION_API_URL, json=data)
        if response.status_code == 200:
            prediction_data = response.json()
            prediction_percentage = prediction_data.get("prediction", 0)
            
            # Adjust the GST based on the percentage received
            adjusted_gst = gst * (1 + prediction_percentage / 100)
            adjusted_gst = math.ceil(adjusted_gst)  # Ensure GST is an integer value
            
            print(f"Original GST: {gst}, Adjusted GST: {adjusted_gst} (Percentage: {prediction_percentage}%)")
            return adjusted_gst
        else:
            print(f"Error from prediction API: {response.status_code} - {response.text}")
            return gst
    except Exception as e:
        print(f"Error calling prediction API: {e}")
        return gst

def get_GST(densities):
    max_allocation_possible = 100
    min_allocation_possible = 10
    av_times = [10, 7, 20]
    GST = (densities[0] * av_times[0]) + (densities[1] * av_times[1]) + (densities[2] * av_times[2])
    GST /= 4
    adjust_gst_with_prediction(GST,densities)
    GST = max(min(GST, max_allocation_possible), min_allocation_possible)
    GST = math.ceil(GST)
    return GST

@app.route('/traffic', methods=['GET'])
def traffic_density():
    video_path = request.args.get('video_path')
    if not video_path:
        return jsonify({"error": "No video path provided"}), 400

    densities, error = find_vals(video_path)
    if error:
        return jsonify({"error": error}), 500
    
    if densities == [-1]:
        GST = 120
        return jsonify({
            "densities": {
                "ambulance": 1
            },
            "GST": GST
        })

    GST = get_GST(densities)
    return jsonify({
        "densities": {
            "car_density": densities[0],
            "bikes_density": densities[1],
            "truck_density": densities[2]
        },
        "GST": GST
    })

if __name__ == '__main__':
    app.run(debug=True)
