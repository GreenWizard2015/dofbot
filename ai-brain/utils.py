import pyrealsense2 as rs
import numpy as np

def initialize_camera(device):
    pipeline = rs.pipeline()
    config = rs.config()
    config.enable_device(device.get_info(rs.camera_info.serial_number))
    # # print all available streams and their resolutions
    # for s in device.sensors:
    #     for profile in s.profiles:
    #         stream = profile.as_video_stream_profile()
    #         print(f"Stream: {stream.stream_name()} Width: {stream.width()} Height: {stream.height()} Format: {stream.format()} FPS: {stream.fps()}")
    # exit()
    config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 6)
    config.enable_stream(rs.stream.color, 640, 480, rs.format.rgb8, 6)
    pipeline.start(config)
    return pipeline
  

def all_devices():
    context = rs.context()
    connected_devices = context.devices
    if len(connected_devices) == 0:
        print("No RealSense devices connected.")
        exit()

    # Initialize all connected cameras
    return [initialize_camera(device) for device in connected_devices]

def get_frame(pipeline):
    frames = pipeline.wait_for_frames()
    depth_frame = frames.get_depth_frame()
    color_frame = frames.get_color_frame()
    if not depth_frame or not color_frame: # no frames
        return None
    depth_frame = np.asanyarray(depth_frame.get_data())
    color_frame = np.asanyarray(color_frame.get_data())
    return depth_frame, color_frame