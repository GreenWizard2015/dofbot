import cv2
import numpy as np
import logging
from dofbot_api import DofbotApi
from utils import all_devices, get_frame

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger('main')

# Initialize the robot API
robot = DofbotApi(ip="192.168.31.157")

if robot.connected:
    logger.info("Robot connected successfully")
else:
    logger.warning("Failed to connect to robot")

# Initialize RealSense cameras
pipelines = all_devices()
logger.info(f"Initialized {len(pipelines)} RealSense cameras")

def capture(target_size=(1280, 720)):
    """Capture and combine images from all RealSense cameras."""
    if not pipelines:
        logger.warning("No RealSense cameras available")
        return np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)

    all_images = []
    for i, pipeline in enumerate(pipelines):
        frame = get_frame(pipeline)
        if not frame:
            continue

        depth, color = frame

        # Convert depth to colormap for visualization
        depth_colormap = cv2.applyColorMap(cv2.convertScaleAbs(depth, alpha=0.03), cv2.COLORMAP_JET)

        # Convert RGB to BGR for OpenCV
        color_bgr = cv2.cvtColor(color, cv2.COLOR_RGB2BGR)

        # Add camera labels
        cv2.putText(color_bgr, f"RGB Camera {i+1}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(depth_colormap, f"Depth Camera {i+1}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        all_images.append(color_bgr)
        all_images.append(depth_colormap)

    if not all_images:
        return np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)

    # Arrange images in a grid
    cols = 2
    rows = (len(all_images) + cols - 1) // cols
    h, w = all_images[0].shape[:2]

    grid = np.full((rows * h, cols * w, 3), 255, dtype=np.uint8)
    for i, img in enumerate(all_images):
        row, col = i // cols, i % cols
        grid[row*h:(row+1)*h, col*w:(col+1)*w] = img

    return cv2.resize(grid, target_size)

def capture_and_show():
    """Capture and display images."""
    result = capture()
    cv2.imshow("Camera Feed", result)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def move_by_plan(plan):
    """Execute a movement plan."""
    for angles in plan:
        robot.set_angles(angles, time=5)

def control_loop():
    """Interactive control loop for robot and camera."""
    step_size = 5

    # Key mappings for servo control
    controls = {
        ord('a'): (0, 1), ord('z'): (0, -1),  # Servo 1
        ord('s'): (1, 1), ord('x'): (1, -1),  # Servo 2
        ord('d'): (2, 1), ord('c'): (2, -1),  # Servo 3
        ord('f'): (3, 1), ord('v'): (3, -1),  # Servo 4
        ord('g'): (4, 1), ord('b'): (4, -1),  # Servo 5
        # disable gripper, because it's holding the spoon/fork
        # ord('h'): (5, 1), ord('n'): (5, -1),  # Servo 6
    }

    logger.info("Control loop started. Press ESC to exit, 1-5 to set step size")

    while True:
        image = capture()
        cv2.imshow("Robot Control", image)
        key = cv2.waitKey(1) & 0xFF

        if key == 27:  # ESC
            break
        elif ord('1') <= key <= ord('5'):  # Set step size
            step_size = key - ord('0')
            logger.info(f"Step size set to {step_size}")
        elif key in controls:
            servo_idx, direction = controls[key]
            angles = robot.angles()
            angles[servo_idx] += direction * step_size * 4
            robot.set_angles(angles, time=1)

    cv2.destroyAllWindows()

if __name__ == "__main__":
    logger.info(f"Found {len(pipelines)} RealSense cameras")
    # Move to home position, but with gripper closed  
    robot.set_angles([90, 90, 90, 90, 90, 180], time=1)

    try:
        control_loop()
    finally:
        # Clean up RealSense pipelines
        for pipeline in pipelines:
            pipeline.stop()
        logger.info("RealSense pipelines stopped")