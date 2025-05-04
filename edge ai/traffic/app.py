from flask import Flask, Response, jsonify
import threading
import cv2
from video_worker import start_video_worker, lane_frames, lane_counts

app = Flask(__name__)

NUM_LANES = 4
for lane_id in range(NUM_LANES):
    path = f"videos/lane_{lane_id}.mp4"
    threading.Thread(target=start_video_worker, args=(lane_id, path), daemon=True).start()

def generate_video(lane_id):
    while True:
        frame = lane_frames.get(lane_id)
        if frame is None:
            continue
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

@app.route("/video_stream/<int:lane_id>")
def video_stream(lane_id):
    return Response(generate_video(lane_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/vehicle_count/<int:lane_id>")
def vehicle_count(lane_id):
    counts = lane_counts.get(lane_id, {})
    return jsonify({"lane_id": lane_id, "counts": counts})

if __name__ == "__main__":
    app.run(debug=True)
