import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- VITE FIX FOR LEAFLET ICONS ---
// Leaflet sometimes loses track of its default pin images in React/Vite. This fixes it permanently.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});
// -----------------------------------

// Helper component: Smoothly pans the map to a new location when the user searches
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13); // 13 is a good zoom level for city scale
    }
  }, [center, map]);
  return null;
};

const HospitalMap = ({ centerLocation, hospitals }) => {
  // Default to Dhaka coordinates if no center is provided yet
  const defaultCenter = [23.8103, 90.4125]; 
  const mapCenter = centerLocation ? [centerLocation.lat, centerLocation.lng] : defaultCenter;

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#c7e6de] relative z-0 mb-8">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={false} // Prevents the map from zooming when scrolling down the page
        className="w-full h-full z-0"
      >
        {/* The actual street map background */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* The listener that moves the map */}
        <MapUpdater center={centerLocation} />

        {/* Render a pin for every hospital in the array */}
        {hospitals && hospitals.map((hospital, index) => (
          hospital.location && hospital.location.lat && hospital.location.lng && (
            <Marker key={index} position={[hospital.location.lat, hospital.location.lng]}>
              <Popup className="rounded-xl">
                <div className="font-bold text-[#12b981] text-lg">{hospital.name}</div>
                <div className="text-sm text-gray-600 mt-1">{hospital.address}</div>
                {hospital.distanceMeters && (
                  <div className="text-xs font-semibold text-gray-500 mt-2 bg-gray-100 p-1 rounded inline-block">
                    {Math.round(hospital.distanceMeters)} meters away
                  </div>
                )}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default HospitalMap;