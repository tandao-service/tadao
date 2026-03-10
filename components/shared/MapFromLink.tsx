"use client";
import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -1.286389, // Default center (Nairobi, Kenya)
  lng: 36.817223,
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const MapFromLink = () => {
  const [mapLink, setMapLink] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY, libraries: ["places"] });

  // Extract coordinates from a full Google Maps URL
  const extractCoordinates = (url: string) => {
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
  };

  // Open a popup window and instruct the user to copy the final URL
  const openPopup = () => {
    const popup = window.open(mapLink, "GoogleMapsPopup", "width=800,height=600");
    if (!popup) {
      alert("Please allow popups for this site.");
    } else {
      alert("After the map loads, copy the full URL and paste it below.");
    }
  };

  // Extract coordinates when the final URL is pasted
  const handleFinalUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const finalUrl = e.target.value;
    setMapLink(finalUrl); // Update input field
    const coords = extractCoordinates(finalUrl);
    if (coords) {
      setCoordinates(coords);
    } else {
      console.warn("Could not extract coordinates.");
    }
  };

  if (!isLoaded) return <p className="text-center">Loading Map...</p>;

  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-semibold mb-2">Enter Google Maps Short Link</h2>

      <input
        type="text"
        placeholder="Paste short Google Maps link..."
        value={mapLink}
        onChange={(e) => setMapLink(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      />

      <button
        onClick={openPopup}
        className="p-2 bg-blue-500 text-white rounded w-full mb-4"
      >
        Open in Popup
      </button>

      <h3 className="text-md font-semibold mb-2">Paste the final URL here:</h3>
      <input
        type="text"
        placeholder="Paste final Google Maps URL..."
        onChange={handleFinalUrlChange}
        className="p-2 border rounded w-full mb-4"
      />

      <GoogleMap mapContainerStyle={containerStyle} center={coordinates || defaultCenter} zoom={15}>
        {coordinates && <Marker position={coordinates} />}
      </GoogleMap>
    </div>
  );
};

export default MapFromLink;
