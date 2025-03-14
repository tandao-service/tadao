"use client";

import { useState, useRef } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
  StreetViewPanorama,
  useLoadScript,
} from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';;
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import OpenWithOutlinedIcon from '@mui/icons-material/OpenWithOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEAPIKEY as string;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};
type infodata = {
  area: number;
  polygonPath: any;
};

const MapAreaCalculator = ({
  selected,
  name,
  onChange,
  onSave,
}: {
  selected: infodata;
  name: string;
  onChange: (field: string, value: infodata) => void;
  onSave: () => void;
}) => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [polygonPath, setPolygonPath] = useState<any[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [area, setArea] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(16);
  const [distance, setDistance] = useState<string | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [amenityType, setAmenityType] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [inputMode, setInputMode] = useState<'address' | 'coordinates'>('address');
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry", "drawing"],
  });
//  Initialize Places Autocomplete
const { suggestions, setValue, value, clearSuggestions } = usePlacesAutocomplete();

// Handle Address Selection
const handleSelect = async (address: string) => {
  setValue(address, false);
  clearSuggestions();
  try {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setCenter({ lat, lng });
  } catch (error) {
    console.error("Error getting geocode:", error);
  }
};
 // Handle Coordinate Search
 const handleCoordinateSearch = () => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (!isNaN(lat) && !isNaN(lng)) {
    setCenter({ lat, lng });
  }
};
  // Handle Polygon Drawing
  const handleDrawPolygon = () => {
    if (!mapRef.current) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "red",
        fillOpacity: 0.4,
        strokeColor: "red",
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(mapRef.current);
    drawingManagerRef.current = drawingManager;

    google.maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon;
        polygonsRef.current.push(polygon);
        handlePolygonComplete(polygon);
        drawingManager.setDrawingMode(null);
      }
    });
  };

  // Handle Polygon Completion
  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setPolygonPath(path);
    calculateArea(polygon);
  };

  // Calculate Polygon Area
  const calculateArea = (polygon: google.maps.Polygon) => {
    if (window.google && window.google.maps) {
      const calculatedArea = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
      setArea(calculatedArea);
    }
  };
 
  // Fetch Nearby Places
  const fetchNearbyPlaces = (type: string, color: string) => {
    if (!mapRef.current) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: center,
      radius: 2000,
      type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setAmenities(
          (results || []).map((place) => ({
            ...place,
            color, // Assign color to each place type
          }))
        );
        setShowAmenities(true);
      }
    });
  };
// Handle Save
const handleSave = () => {
  onChange(name, { area: area ?? 0, polygonPath });
  onSave();
};
  // Clear all markers and polygons
  const handleClear = () => {
    // Remove all polygons
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    polygonsRef.current = [];

    // Remove all markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
// Clear the route (polyline)
// Clear directions
setDirections(null); // Assuming you store directions in state
    // Clear selected points
    setSelectedPoints([]);
    setPolygonPath([]);
    setArea(null);
    setDistance(null);
    setShowAmenities(false);
    setAmenities([]);
  };
  const handleBestRouteCalculation = () => {
    if (selectedPoints.length < 2) {
      //alert("Please select from which point on the map.");
      setErrorMessage("Please select a point on the map to measure the route from the starting point to the destination..");
      setError(true);
      return;
    }
  
    const directionsService = new google.maps.DirectionsService();
    const [origin, destination] = selectedPoints;
   
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          
          const distanceValue = result.routes?.[0]?.legs?.[0]?.distance?.text;
          setDistance(distanceValue || null);
        } else {
          alert("Unable to find a route.");
        }
        
      }
    );
  };
  //const [inputMode, setInputMode] = useState<'area' | 'routeFromSelect' | 'routeFromMyLocation' | 'schools' | 'hospitals' | 'malls' | 'trunsits'>('routeFromSelect');
  return isLoaded ? (
    <div className="w-full p-1 dark:bg-[#2D3236] bg-gray-300 rounded-xl">
   <div className="flex justify-between">
        <div className="mb-0 flex gap-0">
          <button onClick={() => setInputMode('address')} className={`p-2 text-sm rounded-tl-xl ${inputMode === 'address' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}>Search by Address</button>
          <button onClick={() => setInputMode('coordinates')} className={`p-2 text-sm rounded-tr-xl ${inputMode === 'coordinates' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}>Enter Coordinates</button>
        </div>
        {area !== null && <div className="text-center flex-col lg:flex-row  items-center flex gap-2"><div className="flex text-xs lg:text-sm items-center text-gray-500 gap-1 w-full">
     <div className="text-gray-700 dark:text-white">Land Area:</div>
     <div className="text-green-600">{area.toFixed(2)} m² </div>|
     <div className="text-green-600">{(area / 10000).toFixed(2)} ha </div>|
     <div className="text-green-600">{(area / 4046.86).toFixed(2)} acres </div>
  
    </div>
    <div className="flex gap-1">
        <button
        onClick={handleSave}
        className="text-sm bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
      >
        Save
      </button> <button
        onClick={handleClear}
        className="text-sm bg-gray-700 text-white py-1 px-3 rounded hover:bg-gray-800 transition"
      >
        Clear
      </button></div></div>}
        </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-4 text-sm mb-0 flex gap-1">
      <label>
                    <input
                      type="checkbox"
                      name={" Land Area"}
                     // value={option}
                      onChange={(e) =>
                        handleDrawPolygon()
                      }
                    />
                   Draw a polygon to measure Land Area
                  </label>
 {/*  <button  title="Draw a polygon to measure land area"  onClick={()=> {setInputMode('area');  handleClear(); setZoom(18); handleDrawPolygon();}} 
      //  className="p-1 flex flex-col items-center text-[10px] bg-blue-100 border border-blue-500 text-blue-500 rounded"
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] lg:text-xs ${inputMode === 'area' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        >
          <MapOutlinedIcon sx={{ fontSize: 16 }}/> Land Area
        </button>
      */}
         <button  title="Clear all markers, routes, and polygons from the map" onClick={handleClear} className="p-1 flex flex-col items-center text-[10px] border border-gray-500 bg-gray-100 text-gray-500">
         <ClearOutlinedIcon sx={{ fontSize: 16 }}/> Clear
        </button>
      </div>

      {/* Display Calculated Area and Distance */}
     
      {/* Google Map */}
      <div className="bg-white rounded-b-xl rounded-tr-xl dark:bg-[#131B1E] p-2 flex flex-col">
        {/* Address Search Input */}
        {inputMode === 'address' && (
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by address..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  p-2 border border-gray-300 rounded-md"
            />
            {suggestions.status === "OK" && (
              <ul className="text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600  bg-white border border-gray-300 rounded-md mt-2 max-h-40 overflow-auto">
                {suggestions.data.map((suggestion: any) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 hover:bg-green-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelect(suggestion.description)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Coordinate Input Fields */}
        {inputMode === 'coordinates' && (
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="p-2 text-sm border dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="p-2 border text-sm dark:bg-[#131B1E] dark:text-gray-300 dark:border-gray-600 border-gray-300 rounded-md"
            />
            <button onClick={handleCoordinateSearch} className="p-1 text-sm bg-blue-500 text-white rounded">Go</button>
          </div>
        )}

        {/* Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        mapTypeId="satellite"
        onLoad={(map) => {
            mapRef.current = map;
          }}
      >
        {/* Draggable Marker */}
        <Marker
          position={markerPosition}
         // title={title} // Set the title here
          draggable
          onDragEnd={(e) =>
            setMarkerPosition({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 })
          }
          onClick={() => {setStreetViewVisible(!streetViewVisible)}}
        />

        {/* Drawn Polygon */}
        {polygonPath.length > 0 && (
          <Polygon paths={polygonPath} options={{ fillColor: "#FF0000", fillOpacity: 0.35,  strokeColor: "#0000FF", strokeWeight: 2 }} />
        )}

{directions && <DirectionsRenderer directions={directions} />}

        {/* Distance Measurement Points */}
  {area !== null && (
  <div className="absolute top-20 left-5 p-2 text-white bg-green-600 z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Land Area:</strong>
      <div>{area.toFixed(2)} m²</div>
      <div>{(area / 10000).toFixed(2)} ha</div>
      <div>{(area / 4046.86).toFixed(2)} acres</div>
    </div>
  </div>
)}

{distance && (
  <div className="absolute top-20 right-5 p-2 text-white bg-green-600 z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance}</div>
    </div>
  </div>
)}

      </GoogleMap>
    </div>
    
    </div>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapAreaCalculator;
