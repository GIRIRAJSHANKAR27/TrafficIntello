import React, { useEffect, useState } from 'react';

export default function Lane({ laneData }) {
  const { lane, signal, gst } = laneData;
  const [countdown, setCountdown] = useState(gst);

  useEffect(() => {
    setCountdown(gst);

    let interval = null;

    if (signal === 'green' && gst > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gst, signal]);

  // Determine effective signal color based on countdown
  const effectiveSignal =
    signal === 'green' && countdown > 0 && countdown < 5 ? 'yellow' : signal;

  const renderSignalLight = (color) => {
    const isActive = effectiveSignal === color;
    const colors = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-400',
      green: 'bg-green-500',
    };

    return (
      <div
        className={`w-6 h-6 rounded-full border border-gray-400 ${
          isActive ? colors[color] : 'bg-gray-200'
        }`}
      ></div>
    );
  };

  return (
    <div className="p-4 border rounded-2xl shadow-md bg-white flex flex-col gap-4 items-center w-full h-full">
      <div className="text-lg font-bold">Lane {lane}</div>

      {/* CCTV and Signal Lights in a row */}
      <div className="flex flex-row items-center justify-center gap-4 w-full h-full">
        {/* CCTV Feed (3/4 width) */}
        <div className="basis-3/4 flex justify-center h-full">
          <img
            src={`http://localhost:5000/video_stream/${lane}`}
            alt={`Lane ${lane} CCTV`}
            className="w-full h-48 object-cover rounded-md border max-w-[400px]"
          />
        </div>

        {/* Signal Lights (1/4 width) */}
        <div className="basis-1/4 flex flex-col items-center justify-center gap-3 h-full">
          {renderSignalLight('red')}
          {renderSignalLight('yellow')}
          {renderSignalLight('green')}
        </div>
      </div>

      {/* Countdown for green */}
      {signal === 'green' && countdown > 0 && (
        <div className={`text-sm font-medium ${effectiveSignal === 'yellow' ? 'text-yellow-500' : 'text-green-600'}`}>
          {effectiveSignal === 'yellow'
            ? `Prepare to stop: ${countdown}s`
            : `Green signal ends in: ${countdown}s`}
        </div>
      )}
    </div>
  );
}
