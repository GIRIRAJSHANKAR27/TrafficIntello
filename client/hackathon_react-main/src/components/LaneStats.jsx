import React from 'react';
import { Box } from '@mui/material';
import CCTVFeed from './CCTVFeed';
import TrafficSignal from './TrafficSignal';
import VehicleCounter from './VehicleCounter';

function LaneStats({ laneData, path }) {
  const { color, totalVehicles, cars, trucks, bikes, gst } = laneData; // Destructure laneData to get relevant values

  return (
    <div>
      <Box 
        display="flex" 
        flexGrow={1} 
        justifyContent="space-between" 
        sx={{ marginTop: '20px', padding: '10px' }} // Add padding to the row
      >
        <Box 
          flex={1} 
          display="flex" 
          flexDirection="column" 
          marginRight="10px"
          height="100%" // Ensure it fills the height
          sx={{ padding: '0px', backgroundColor: '#263238' }} // Add padding and background color
        >
          <CCTVFeed vid_path={path}/>
        </Box>

        <Box display="flex" flexDirection="column" width='40%'>
          <Box 
            flex={1} 
            display="flex" 
            flexDirection="column"  
            marginBottom="10px" // Space between boxes
            height="50%" // Adjust height
            sx={{ padding: '0px', backgroundColor: '#263238' }} // Add padding and background color
          >
            <TrafficSignal color={color} gst={gst} /> {/* Pass the traffic signal color as a prop */}
          </Box>
          <Box 
            flex={1} 
            display="flex" 
            flexDirection="column"  
            height="50%" // Adjust height
            sx={{ padding: '0px', backgroundColor: '#263238' }} // Add padding and background color
          >
            <VehicleCounter total={totalVehicles} cars={cars} trucks={trucks} bikes={bikes} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default LaneStats;
