import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const TrafficSignal = ({ gst }) => {
  const [remainingTime, setRemainingTime] = useState(gst);
  const [color, setColor] = useState('red'); // Initial color

  useEffect(() => {
    setRemainingTime(gst); // Reset remaining time when gst changes
    setColor('red'); // Reset color to red when gst changes
  }, [gst]);

  useEffect(() => {
    // Set up the countdown timer
    if (gst > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timer); // Stop the timer when it reaches zero
            return 0;
          }
        });
      }, 1000); // Decrease every second

      // Clean up the interval on component unmount
      return () => clearInterval(timer);
    }
  }, [gst]);

  useEffect(() => {
    // Update color based on remaining time
    if (remainingTime > 0) {
      if (remainingTime === 1) {
        setColor('red'); // Switch to red at the end
      } else if (remainingTime <= 3) {
        setColor('yellow'); // Show yellow for the last 3 seconds
      } else {
        setColor('green'); // Green for the rest of the time
      }
    } else {
      setColor('off'); // Signal off when time is up
    }
  }, [remainingTime]);

  return (
    <Card style={{
      height: '100%',
      backgroundColor: '#455A64'
    }}>
      <CardContent>
        <Typography color='#B2DFDB' variant="h6">Traffic Signal</Typography>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <div style={{ backgroundColor: color === 'red' ? 'red' : '#ccc', width: '50px', height: '50px', borderRadius: '50%', margin: '10px' }}></div>
          <div style={{ backgroundColor: color === 'yellow' ? 'yellow' : '#ccc', width: '50px', height: '50px', borderRadius: '50%', margin: '10px' }}></div>
          <div style={{ backgroundColor: color === 'green' ? 'green' : '#ccc', width: '50px', height: '50px', borderRadius: '50%', margin: '10px' }}></div>
        </div>
        <Typography color='#B2DFDB' variant="h5" align="center" style={{ marginTop: '20px' }}>
          {remainingTime > 0 ? `${remainingTime} seconds` : 'Signal Off'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TrafficSignal;

