"use client";

import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle
} from "@react-google-maps/api";

//const MAP_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const DEFAULT_CENTER = { lat: -1.286389, lng: 36.817223 }; // Default: Nairobi, Kenya

interface Property {
  id: string;
  name: string;
  location: { lat: number; lng: number };
}

const properties: Property[] = [
  { id: "1", name: "House A", location: { lat: -1.285, lng: 36.82 } },
  { id: "2", name: "House B", location: { lat: -1.29, lng: 36.81 } },
  { id: "3", name: "House C", location: { lat: -1.295, lng: 36.825 } },
];

const MapSearch = () => {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [radius, setRadius] = useState(5000); // Default radius: 5km
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Function to calculate distance between two points (Haversine formula)
  const getDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const distance = getDistance(mapCenter, property.location);
      return distance <= radius;
    });

    setFilteredProperties(filtered);
  }, [mapCenter, radius]);

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-xl font-semibold mb-2">Search Properties by Distance</h2>
      <p className="text-sm text-gray-600 mb-2">Click on the map to set a location.</p>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={13}
            onClick={(e) =>
              setMapCenter({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 })
            }
          >
            <Marker position={mapCenter} />
            <Circle center={mapCenter} radius={radius} options={{ fillColor: "#4285F4", fillOpacity: 0.2, strokeColor: "#4285F4" }} />
            {filteredProperties.map((property) => (
              <Marker key={property.id} position={property.location} />
            ))}
          </GoogleMap>
        </div>
      </LoadScript>

      <div className="mt-4 w-full">
        <label className="block text-gray-700 font-medium mb-1">
          Select Distance: {radius / 1000} km
        </label>
        <input
          type="range"
          min="1000"
          max="20000"
          step="1000"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {mapCenter && (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-semibold mb-2">Properties within {radius / 1000} km</h3>
          {filteredProperties.length > 0 ? (
            <ul className="list-disc pl-5">
              {filteredProperties.map((property) => (
                <li key={property.id} className="text-gray-700">{property.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No properties found in this range.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSearch;
