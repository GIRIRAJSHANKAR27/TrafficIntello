import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Lane from '../components/Lane';

const socket_url = import.meta.env.VITE_SOCKET_URL
const socket = io(socket_url); 

export default function JunctionPage() {
  const { id } = useParams();
  const [signalState, setSignalState] = useState([
    { lane: 0, signal: 'red', gst: 0 },
    { lane: 1, signal: 'red', gst: 0 },
    { lane: 2, signal: 'red', gst: 0 },
    { lane: 3, signal: 'red', gst: 0 },
  ]);

  useEffect(() => {
    socket.emit('subscribe', { junctionId: id });

    socket.on('signalUpdate', (data) => {
      if (data.junctionId === id) {
        setSignalState(data.signalState);
      }
    });

    return () => {
      socket.off('signalUpdate');
    };
  }, [id]);

  return (
    <div className="h-[calc(100vh-60px)] p-6 overflow-y-auto flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Junction {id}</h2>

      {/* Expanded Grid Container */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {signalState.map((laneData, index) => (
          <Lane key={index} laneData={laneData} />
        ))}
      </div>
    </div>
  );
}
