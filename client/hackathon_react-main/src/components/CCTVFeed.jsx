import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const CCTVFeed = ({vid_path}) => {
  return (
    <Card style={{
        height: '100%',
        backgroundColor: '#455A64'
    }}>
      <CardContent>
        <Box display='flex' flexDirection='column'>
          <Typography color='#B2DFDB' variant="h6">CCTV Video Feed</Typography>
          {/* Updated video box size */}
          <Box style={{ height: '200px', backgroundColor: '#000', width: '100%' }}>
            {/* Video without controls, autoplay, looping, and muted */}
            <video 
              width="100%" 
              height="100%" 
              autoPlay 
              loop 
              muted 
              style={{ backgroundColor: 'black' }}
            >
              <source src={vid_path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CCTVFeed;

