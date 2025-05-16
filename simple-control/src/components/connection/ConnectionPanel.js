"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIpAddress } from "../../redux/slices/robotSlice";
import styles from "../../app/page.module.css";
import { Button, Input, Typography } from "../ui";

const ConnectionPanel = ({ onConnect }) => {
  const dispatch = useDispatch();
  const { ipAddress, status } = useSelector((state) => state.robot);

  return (
    <>
      <div className={styles.connectionPanel}>
        <Input
          type="text"
          value={ipAddress}
          onChange={(e) => dispatch(setIpAddress(e.target.value))}
          placeholder="Enter Dofbot IP address"
          style={{ width: '250px' }}
        />
        <Button
          variant="primary"
          onClick={onConnect}
        >
          Connect
        </Button>
      </div>

      {status && (
        <div className={styles.status}>
          <Typography variant="body1">{status}</Typography>
        </div>
      )}
    </>
  );
};

export default ConnectionPanel;
