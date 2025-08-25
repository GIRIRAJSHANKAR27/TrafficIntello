import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN; 

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.216721, 28.644800],
      zoom: 11,
    });

    const junctions = [
      { id: '01', name: 'Connaught Place', coords: [77.2295, 28.6139] },
      { id: '01', name: 'West Delhi', coords: [77.1025, 28.7041] },
      { id: '01', name: 'Kashmere Gate', coords: [77.2293, 28.6672] },
      { id: '01', name: 'AIIMS', coords: [77.2100, 28.5665] },
      { id: '01', name: 'Lajpat Nagar', coords: [77.2430, 28.5708] },
      { id: '01', name: 'Saket', coords: [77.2167, 28.5245] },
    ];

    junctions.forEach(junction => {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(junction.coords)
        .setPopup(new mapboxgl.Popup().setText(junction.name))
        .addTo(map.current);

      marker.getElement().addEventListener('click', () => {
        navigate(`/junction/${junction.id}`);
      });
    });

  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delhi Traffic Map</h1>
      <div ref={mapContainer} className="h-[550px] rounded shadow" />
    </div>
  );
}
