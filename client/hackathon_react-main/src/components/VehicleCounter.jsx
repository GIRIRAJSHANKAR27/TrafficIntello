import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const VehicleCounter = ({ total, cars, trucks, bikes }) => {
  return (
    <Card style={{
        height:'100%',
         backgroundColor:'#455A64'

    }}>
      <CardContent>
        <Typography color='#B2DFDB' variant="h6">Vehicle Count</Typography>
        <Typography color='#B2DFDB'>Total Vehicles: {total}</Typography>
        <Typography color='#B2DFDB'>Cars: {cars}</Typography>
        <Typography color='#B2DFDB'>Trucks: {trucks}</Typography>
        <Typography color='#B2DFDB'>Bikes: {bikes}</Typography>
      </CardContent>
    </Card>
  );
};

export default VehicleCounter;
