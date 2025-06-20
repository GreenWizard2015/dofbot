"""
DofbotApi class for handling all API communication with the Dofbot robot.

This class provides a Python interface to control the Dofbot robot via HTTP requests
to the Flask server running on the robot.
"""

import requests
import time
import logging
from typing import List, Optional, Callable, Dict, Any, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('DofbotApi')

class DofbotApi:
    """
    DofbotApi class for handling all API communication with the Dofbot robot.
    
    Attributes:
        ip (str): The IP address of the Dofbot robot
        port (int): The port number of the Flask server
        connected (bool): Whether the robot is connected
    """
    
    def __init__(self, ip: str = None, port: int = 5000):
        """
        Initialize the DofbotApi.
        
        Args:
            ip: The IP address of the Dofbot robot
            port: The port number of the Flask server
        """
        logger.info(f"DofbotApi initialized with IP: {ip}, Port: {port}")
        self.ip = ip
        self.port = port
        self.connected = False
        self.angles() # Test the connection
    
    def _call(self, method: str, timeout: float = None) -> Optional[Dict[str, Any]]:
        """Call the API with the given method and parameters."""
        try:
            url = f"http://{self.ip}:{self.port}/{method}"
            logger.info(f"Fetching from: {url}")
            
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            
            self.connected = True
            data = response.json()
            logger.info(f"Response data: {data}")
            return data
        except Exception as e:
            self.connected = False
            logger.error(f"Error in _call: {e}")
            raise

    def angles(self) -> Optional[List[int]]:
        """
        Get the current angles of the robot.
        
        Returns:
            Optional[List[int]]: The current angles or None if failed
        """
        try:
            data = self._call("angles")
            return data["angles"]            
        except Exception as e:
            logger.error(f"Error in angles: {e}")
            return None
    
    def move_to_home(self) -> Optional[List[int]]:
        """
        Move the robot to the home position.
        
        Returns:
            Optional[List[int]]: The new angles after moving or None if failed
        """
        try:
            data = self._call("home")
            return data["angles"]            
        except Exception as e:
            logger.error(f"Error in move_to_home: {e}")
            return None
    
    def set_angles(self, angles: List[int], time: Optional[float ] = None) -> Optional[List[int]]:
        """
        Set the robot angles.
        
        Args:
            angles: The angles to set
            time: Optional custom move time
            
        Returns:
            Optional[List[int]]: The new angles after setting or None if failed
        """
        try:
            # Validate angles
            assert isinstance(angles, list) and len(angles) == 6, "Angles must be a list of 6 integers"
            assert all(isinstance(angle, int) for angle in angles), "Angles must be integers"
            
            angles_str = ','.join(map(str, angles))
            url = f"set_angles?angles={angles_str}"
            if time:
                url += f"&t={int(time * 1000)}"  # Convert to milliseconds
            
            data = self._call(url)
            return data["angles"]            
        except Exception as e:
            logger.error(f"Error in set_angles: {e}")
            return None
