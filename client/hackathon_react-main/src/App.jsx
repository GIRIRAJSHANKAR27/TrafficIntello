import React, { useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    // Automatically start the traffic cycle when the component mounts
    const startTrafficCycle = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5006/start_cycle', {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Traffic cycle started:', data.status);
        } else {
          console.error('Failed to start traffic cycle:', response.status);
        }
      } catch (error) {
        console.error('Error starting traffic cycle:', error);
      }
    };

    startTrafficCycle();  // Call the function to start the traffic cycle

    // Optional cleanup function if needed
    return () => {
      // Any cleanup can be done here
    };
  }, []);  // The empty dependency array ensures this runs only once

  return (
    <div className="app">
      <Dashboard />
    </div>
  );
}

export default App;