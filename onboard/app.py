'''
Very simple Flask app to control the Dofbot arm via HTTP requests.
'''
from flask import Flask, request, jsonify, Response
from Arm_Lib import Arm_Device
import time
import cv2
import subprocess

app = Flask(__name__)               # Initialize Flask app
arm = Arm_Device()                  # Initialize the Dofbot arm controller:contentReference[oaicite:2]{index=2}

'''
Recommended Safe Operating Ranges:

Servo 1 (Base rotation): 10° to 170°
Servo 2 (Shoulder): 15° to 165°
Servo 3 (Elbow): 15° to 165°
Servo 4 (Wrist pitch): 10° to 170°
Servo 5 (Wrist rotation): 10° to 260°
Servo 6 (Gripper): 10° to 170°
'''
SAFE_ANGLES = [
    [10, 170], # Servo 1 (Base rotation)
    [15, 165], # Servo 2 (Shoulder)
    [15, 165], # Servo 3 (Elbow)
    [10, 170], # Servo 4 (Wrist pitch)
    [10, 260], # Servo 5 (Wrist rotation)
    [10, 170]  # Servo 6 (Gripper)
]

def capture_image():
    cap = cv2.VideoCapture(1)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        raise Exception("Failed to capture image")
    return frame

@app.route("/image")
def image():
    try:
        frame = capture_image()
    except Exception as e:
        # run "bash kill_cam.sh" and retry
        try:
            subprocess.run(["bash", "~/Arm/kill_cam.sh"])
            frame = capture_image()
        except Exception as e:
            return str(e), 500

    # Encode image as JPEG
    ret, jpeg = cv2.imencode('.jpg', frame)
    if not ret:
        return "Failed to encode image", 500

    return Response(jpeg.tobytes(), mimetype='image/jpeg')

def dump_angles():
    res = []
    for idx in range(6):
        res.append(arm.Arm_serial_servo_read(idx + 1))
    return res

@app.route("/set_angles")
def set_angles():
    args = request.args
    angles = args.get("angles").split(",")
    if len(angles) != 6:
        return "Invalid number of angles, must be 6", 400
    # convert angles to list of ints
    angles = [int(angle) for angle in angles]
    for idx, (min_angle, max_angle) in enumerate(SAFE_ANGLES):
        if angles[idx] < min_angle:
            angles[idx] = min_angle
        if angles[idx] > max_angle:
            angles[idx] = max_angle
    t = args.get("t", 5000)
    # Move all 6 servos to the specified angles over 1 second (1000 ms)
    arm.Arm_serial_servo_write6_array(angles, t)
    time.sleep(t / 1000 + 0.5) # wait for move to finish
    return jsonify({"status": "OK", "angles": dump_angles()})

@app.route("/angles")
def current_angles():
    angles = dump_angles()
    return jsonify({"angles": angles})

@app.route("/home")
def move_home():
    home_angles = [90, 90, 90, 90, 90, 90]
    arm.Arm_serial_servo_write6_array(home_angles, 1000)  # move all servos to 90°
    time.sleep(1.5) # wait for move to finish
    return jsonify({"status": "OK", "angles": dump_angles()})

# A simple homepage route with instructions or a basic control interface
@app.route("/")
def index():
    return """
    <h1>Dofbot Web Controller</h1>
    <p>Use the endpoints to control the arm:</p>
    <ul>
      <li>GET /image - capture an image from the camera</li>
      <li>GET /set_angles?angles=A,B,C,D,E,F&t=T - move all joints to given angles (A,B,C,D,E,F) over T milliseconds</li>
      <li>GET /angles - get the current angles of all joints</li>
      <li>GET /home - return arm to home position</li>
    </ul>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
