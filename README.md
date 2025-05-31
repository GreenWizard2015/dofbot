# Dofbot Control System

A comprehensive control system for the Dofbot robotic arm featuring AI-powered vision, web interfaces, and real-time camera integration.

## 🤖 Overview

This project provides multiple interfaces for controlling a Dofbot robotic arm:

- **AI Brain**: Python-based control system with RealSense camera integration and computer vision
- **Web Controller**: Flask-based onboard web server for HTTP API control
- **Simple Control**: Next.js web interface for browser-based robot control

## 📁 Project Structure

```
dofbot/
├── ai-brain/           # AI-powered control system with camera integration
│   ├── main.py         # Main control loop with interactive keyboard controls
│   ├── dofbot_api.py   # Python API client for robot communication
│   └── utils.py        # RealSense camera utilities
├── onboard/            # Flask web server for onboard robot control
│   ├── app.py          # Flask application (runs on robot)
│   └── README.md       # Onboard setup instructions
└── simple-control/     # Next.js web interface
    ├── src/            # React components and pages
    ├── package.json    # Node.js dependencies
    └── README.md       # Web interface setup
```

## 🚀 Quick Start

### Prerequisites

- **Hardware**: Dofbot robotic arm with onboard computer
- **Cameras**: Intel RealSense depth cameras (optional, for AI brain)
- **Network**: Robot and control computer on same network

### 1. Setup Onboard Robot Controller

Deploy the Flask web server to your robot's onboard computer:

```bash
# On the robot (Raspberry Pi/similar)
cd onboard/
pip install flask opencv-python
python app.py
```

The robot will be accessible at `http://[robot-ip]:5000`

### 2. AI Brain Control (Development Machine)

For advanced control with camera integration:

```bash
cd ai-brain/
pip install opencv-python pyrealsense2 requests numpy
python main.py
```

**Controls:**
- `a/z`: Servo 1 (base rotation)
- `s/x`: Servo 2 (shoulder)
- `d/c`: Servo 3 (elbow)
- `f/v`: Servo 4 (wrist pitch)
- `g/b`: Servo 5 (wrist rotation)
- `h/n`: Servo 6 (gripper)
- `1-5`: Set movement step size
- `ESC`: Exit

### 3. Web Interface

For browser-based control:

```bash
cd simple-control/
npm install
npm run dev
```

Access at `http://localhost:3000`

## 🔧 Configuration

### Robot Connection

Update the robot IP address in `ai-brain/main.py`:

```python
robot = DofbotApi(ip="192.168.31.157")  # Change to your robot's IP
```

### Camera Setup

The AI brain automatically detects connected RealSense cameras. Ensure cameras are connected before running.

## 📡 API Reference

### Robot Control Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/angles` | GET | Get current servo angles |
| `/home` | GET | Move to home position (90° all servos) |
| `/set_angles` | GET | Set servo angles with parameters |

### Set Angles Parameters

```
GET /set_angles?angles=A,B,C,D,E,F&t=T
```

- `angles`: Comma-separated angles for 6 servos
- `t`: Movement time in milliseconds (default: 5000)

**Servo Ranges:**
- Servo 1 (Base): 10° - 170°
- Servo 2 (Shoulder): 15° - 165°
- Servo 3 (Elbow): 15° - 165°
- Servo 4 (Wrist pitch): 10° - 170°
- Servo 5 (Wrist rotation): 10° - 260°
- Servo 6 (Gripper): 10° - 170°

## 🎯 Features

### AI Brain
- **Real-time camera feeds**: Multiple RealSense depth + RGB cameras
- **Interactive control**: Keyboard-based servo control
- **Visual feedback**: Live camera display with depth mapping
- **Flexible movement**: Adjustable step sizes and movement speeds

### Web Controller
- **HTTP API**: RESTful endpoints for robot control
- **Safety limits**: Automatic angle constraint enforcement
- **Service integration**: Systemd service for auto-start
- **Cross-platform**: Works with any HTTP client

### Simple Control Interface
- **Modern web UI**: React-based control interface
- **Real-time updates**: Live robot status and control
- **Responsive design**: Works on desktop and mobile
- **State management**: Redux for application state

## 🛠️ Development

### Adding New Features

1. **Robot API**: Extend `DofbotApi` class in `ai-brain/dofbot_api.py`
2. **Camera processing**: Add functions to `ai-brain/utils.py`
3. **Web endpoints**: Add routes to `onboard/app.py`
4. **UI components**: Add React components to `simple-control/src/`

### Testing

```bash
# Test robot connection
python -c "from ai_brain.dofbot_api import DofbotApi; print(DofbotApi('192.168.31.157').connected)"

# Test camera setup
python -c "from ai_brain.utils import all_devices; print(f'{len(all_devices())} cameras found')"
```

## 📋 Dependencies

### Python (AI Brain & Onboard)
- `opencv-python`: Computer vision and image processing
- `pyrealsense2`: Intel RealSense camera SDK
- `requests`: HTTP client for API communication
- `numpy`: Numerical computing
- `flask`: Web framework (onboard only)

### Node.js (Simple Control)
- `next`: React framework
- `react`: UI library
- `@reduxjs/toolkit`: State management
- `react-redux`: React-Redux bindings

## 🔒 Safety Notes

- Always ensure robot workspace is clear before operation
- Servo angle limits are enforced to prevent mechanical damage
- Emergency stop: Press ESC in AI brain mode or close browser tab
- Test movements at low speeds initially

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Include robot model, OS, and error messages

---

**Happy robot controlling! 🤖**
