# video_worker.py
import cv2
from ultralytics import YOLO
import threading
import time

# Load model only once globally
model = YOLO("yolov8n.pt")  # Load outside of thread

vehicle_classes = {
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck"
}

lane_frames = {}
lane_counts = {}

def start_video_worker(lane_id, video_path):
    cap = cv2.VideoCapture(video_path)

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        results = model.predict(frame, verbose=False)[0]  # explicitly use .predict

        counts = {}
        for box in results.boxes:
            cls = int(box.cls[0])
            if cls in vehicle_classes:
                label = vehicle_classes[cls]
                counts[label] = counts.get(label, 0) + 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        lane_frames[lane_id] = frame
        lane_counts[lane_id] = counts

        time.sleep(0.05)    
