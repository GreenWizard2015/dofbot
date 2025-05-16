"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStatus, setImageUrl } from "../../redux/slices/robotSlice";
import styles from "../../app/page.module.css";
import { Button, Card, Typography } from "../ui";

const CameraFeed = () => {
  const dispatch = useDispatch();
  const { imageUrl, ipAddress } = useSelector((state) => state.robot);
  // Use local state for displaying the image to prevent automatic refreshing
  const [displayImageUrl, setDisplayImageUrl] = useState(null);

  // Only update the display image URL when the Redux imageUrl changes and we have a valid URL
  useEffect(() => {
    if (imageUrl) {
      setDisplayImageUrl(imageUrl);
    }
  }, [imageUrl]);

  if (!displayImageUrl) return null;

  const refreshImage = () => {
    // Update the image URL with a timestamp to prevent caching
    const newImageUrl = `http://${ipAddress}:5000/image?t=${Date.now()}`;
    dispatch(setImageUrl(newImageUrl));
    dispatch(setStatus("Camera image refreshed"));
  };

  return (
    <Card className={styles.cameraFeed}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">Camera Feed</Typography>
        <Button
          variant="primary"
          size="small"
          onClick={refreshImage}
        >
          Refresh Image
        </Button>
      </div>
      <div style={{ position: 'relative' }}>
        <img
          src={displayImageUrl}
          alt="Dofbot Camera Feed"
          className={styles.cameraImage}
        />
        <Typography variant="caption" style={{ textAlign: 'center', marginTop: '5px', fontSize: '0.65rem' }}>
          Click the &quot;Refresh Image&quot; button to update the camera feed
        </Typography>
      </div>
    </Card>
  );
};

export default CameraFeed;
