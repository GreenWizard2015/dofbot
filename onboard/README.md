# Dofbot Web Controller

This folder contains the code for the Dofbot Web Controller, a simple Flask web application for controlling the Dofbot robotic arm via HTTP requests.
## Requirements

- Python 3
- Flask
- OpenCV (cv2)
- Dofbot Arm_Lib library
- A Dofbot robotic arm connected to your device

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/dofbot.git
   cd dofbot
   ```

2. Install the required dependencies:
   ```
   pip install flask opencv-python
   ```

3. Ensure the Dofbot Arm_Lib is installed according to the manufacturer's instructions.

## Usage

1. Upload the code to the Dofbot's onboard computer (`~/app.py` for me).

2. Create a service to run the app.py file on boot. Run:
   ```
   sudo nano /etc/systemd/system/dofbot-web.service
   ```

   Paste the following (edit the paths to your app and Python as needed):
   
   ```
[Unit]
Description=Dofbot Flask Web Server
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/dofbot_web/app.py
WorkingDirectory=/home/pi/dofbot_web
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
    ```

    Save and Enable the Service

    ```
sudo systemctl daemon-reexec        # Optional but ensures systemd is ready
sudo systemctl daemon-reload        # Reload unit files
sudo systemctl enable dofbot-web    # Enable at boot
sudo systemctl start dofbot-web     # Start now
   ```

3. Start service or reboot the Dofbot.

4. Verify the service is running:
   ```
   sudo systemctl status dofbot-web
   ```

The server will run on port 5000. Access the web interface by navigating to:

```
http://[host-ip]:5000
```

## API Endpoints

### GET /
Returns a simple HTML page with instructions for using the API.

### GET /image
Captures and returns an image from the camera as a JPEG.

### GET /set_angles?angles=A,B,C,D,E,F&t=T
Sets the angles of all six servos.
- `angles`: Comma-separated list of six angles (one for each servo)
- `t`: Time in milliseconds to complete the movement (default: 5000)

The angles will be constrained to safe operating ranges:
- Servo 1 (Base rotation): 10° to 170°
- Servo 2 (Shoulder): 15° to 165°
- Servo 3 (Elbow): 15° to 165°
- Servo 4 (Wrist pitch): 10° to 170°
- Servo 5 (Wrist rotation): 10° to 260°
- Servo 6 (Gripper): 10° to 170°

### GET /angles
Returns the current angles of all servos as a JSON object.

### GET /home
Returns the arm to its home position (all servos at 90°).

## Example Usage

Set all servos to specific angles over 2 seconds:
```
http://[host-ip]:5000/set_angles?angles=90,100,110,90,90,120&t=2000
```

Get current servo angles:
```
http://[host-ip]:5000/angles
```
