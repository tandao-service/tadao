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
  height: "90vh",
};

const defaultCenter = {
  lat: -1.286389, // Nairobi, Kenya
  lng: 36.817223,
};

type CardProps = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  imageUrls: string[];
};

const MapWithFeatures = ({ id, title, price, imageUrls, lat, lng }: CardProps) => {
  const [center, setCenter] = useState({ lat: Number(lat), lng: Number(lng) });
  const [markerPosition, setMarkerPosition] = useState({ lat: Number(lat), lng: Number(lng) });
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
  const handleDirectionClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${markerPosition.lat},${markerPosition.lng}`,
      "_blank"
    );
  };
  const handleWideViewClick = () => {
    window.open(
      process.env.NEXT_PUBLIC_DOMAIN_URL+"location?title="+title+"&price="+price+"&lat="+markerPosition.lat+"&lng="+markerPosition.lng,
      "_blank"
    );
  };
  const handleRouteFromMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Set the user location as the starting point
          setSelectedPoints([userLocation, markerPosition]);
  
          // Call function to get route
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
         // calculateRoute(userLocation, markerPosition);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  

  // Handle Distance Calculation
  const handleDistanceCalculation = () => {
    if (selectedPoints.length < 2) {
      alert("Please select point on the map to measure route from to the destination marked point.");
      return;
    }

    const [point1, point2] = selectedPoints;
    const calculatedDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    );

    setDistance(`${(calculatedDistance / 1000).toFixed(2)} km`);
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
  const [inputMode, setInputMode] = useState<'area' | 'routeFromSelect' | 'routeFromMyLocation' | 'schools' | 'hospitals' | 'malls' | 'trunsits'>('routeFromSelect');
  return isLoaded ? (
    <div className="w-full p-0 dark:bg-[#2D3236] bg-gray-100 rounded-xl">
       {/* Alert Dialog */}
       {error && (
        <AlertDialog open={error} onOpenChange={setError}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
             {/* <AlertDialogCancel onClick={() => setError(false)}>Cancel</AlertDialogCancel>*/} 
              <AlertDialogAction onClick={() => setError(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Action Buttons */}
      <div className="grid grid-cols-7 mb-0 flex gap-1">

      <button  title="Calculate the best route from selected points" onClick={()=> {setInputMode('routeFromSelect'); setZoom(16); handleClear();}} 
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] rounded-tl-xl ${inputMode === 'routeFromSelect' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //</div>className="p-1 flex flex-col items-center text-[10px] bg-green-100 border border-green-500 text-green-500 rounded"
        >
  <PushPinOutlinedIcon sx={{ fontSize: 16 }}/> Select point route
</button>
  
  <button  title="Draw a polygon to measure land area"  onClick={()=> {setInputMode('area');  handleClear(); setZoom(18); handleDrawPolygon();}} 
      //  className="p-1 flex flex-col items-center text-[10px] bg-blue-100 border border-blue-500 text-blue-500 rounded"
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'area' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        >
          <MapOutlinedIcon sx={{ fontSize: 16 }}/> Land Area
        </button>
      
     <button   title="Calculate the route from your current location" onClick={()=> {setInputMode('routeFromMyLocation');  handleClear(); setZoom(17);}}  
       className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'routeFromMyLocation' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
     //className="p-1 flex flex-col items-center text-[10px] bg-gray-100 border border-gray-900 text-gray-900 rounded"
     >
         <GpsFixedOutlinedIcon sx={{ fontSize: 16 }}/> My location route
      </button>

        <button   title="Show nearby schools on the map" onClick={() => {setInputMode('schools');  handleClear(); setZoom(14); fetchNearbyPlaces("school", "yellow");}} 
           className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'schools' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
       // className="p-1 flex flex-col items-center text-[10px]  bg-yellow-100 border border-yellow-500 text-yellow-500 rounded"
        >
         <EscalatorWarningOutlinedIcon sx={{ fontSize: 16 }}/> Show Schools
        </button>
        <button  title="Show nearby hospitals on the map" onClick={() => {setInputMode('hospitals');  handleClear(); setZoom(14); fetchNearbyPlaces("hospital", "red");}} 
          className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'hospitals' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px] bg-red-100 border border-red-500 text-red-500 rounded"
        >
         <LocalHospitalOutlinedIcon sx={{ fontSize: 16 }}/> Show Hospitals
        </button>
        <button   title="Show nearby shopping malls on the map" onClick={() => {setInputMode('malls');  handleClear(); setZoom(14); fetchNearbyPlaces("shopping_mall", "purple");}} 
          className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] ${inputMode === 'malls' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px]  bg-purple-100 border border-purple-500 text-purple-500 rounded"
        >
         <LocalMallOutlinedIcon  sx={{ fontSize: 16 }}/> Show Malls
        </button>
        <button  title="Show nearby transit stations on the map" onClick={() =>  {setInputMode('trunsits');  handleClear(); setZoom(14); fetchNearbyPlaces("transit_station", "indigo");}} 
        className={`p-1 flex gap-1 flex-col lg:flex-raw items-center text-[10px] rounded-tr-xl ${inputMode === 'trunsits' ? 'bg-white text-gray-700  dark:bg-[#131B1E] dark:text-white' : 'bg-green-600 text-white'}`}
        //className="p-1 flex flex-col items-center text-[10px]  bg-indigo-100 border border-indigo-500 text-indigo-500 rounded"
        >
        <AirportShuttleOutlinedIcon sx={{ fontSize: 16 }}/>
          Show Bus Stations
        </button>
       {/*  <button  title="Clear all markers, routes, and polygons from the map" onClick={handleClear} className="p-1 flex flex-col items-center text-[10px] border border-gray-500 bg-gray-100 text-gray-500 rounded">
         <ClearOutlinedIcon sx={{ fontSize: 16 }}/> Clear
        </button>*/}
      </div>

      {/* Display Calculated Area and Distance */}
     
      {/* Google Map */}
      <div className="bg-white rounded-b-xl dark:bg-[#131B1E] p-2 flex flex-col">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onClick={(e) => {
            if (e.latLng) {
               const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                setSelectedPoints([markerPosition,newPoint]);
              
              }
          }}
          options={{
            zoomControl: true, // Enable zoom controls
            mapTypeControl: true, // Enable map type switch
            streetViewControl: true, // Enable Street View control
            fullscreenControl: true, // Enable Fullscreen button
            mapTypeId: "satellite", // Set default to Satellite mode
          }}
        onLoad={(map) => {
            mapRef.current = map;
          }}
      >
        {/* Draggable Marker */}
        <Marker
          position={markerPosition}
          title={title} // Set the title here
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
     
        {selectedPoints.map((point, index) => (
            <Marker
              key={index}
              position={point}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 1,
                scale: 10,
              }}
            />
        ))}

        {/* Nearby Amenities Markers with Colors */}
        {showAmenities &&
          amenities.map((place, index) => (
            <Marker
              key={index}
              position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
              title={place.name} // Set the title here
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: place.color,
                fillOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}

        {/* Street View */}
        {streetViewVisible && (
          <StreetViewPanorama
            options={{
              position: markerPosition,
              pov: { heading: 100, pitch: 0 },
              zoom: 1,
            }}
          />
        )}
        {area !== null && (
  <div className="absolute top-20 left-5 p-2 text-white bg-black z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Land Area:</strong>
      <div>{area.toFixed(2)} m²</div>
      <div>{(area / 10000).toFixed(2)} ha</div>
      <div>{(area / 4046.86).toFixed(2)} acres</div>
    </div>
  </div>
)}
{lat && lng && (<div className="absolute top-3 right-20 z-5 text-sm text-white bg-black py-3 px-1 flex gap-1 items-center hover:bg-green-700 rounded-sm">📍 Property: ({lat},{lng})</div>)}
{distance && (
  <div className="absolute top-20 right-5 p-2 text-white bg-black z-5 rounded-md shadow-md">
    <div className="text-sm">
      <strong>Distance:</strong>
      <div>{distance}</div>
    </div>
  </div>
)}
{(inputMode === 'routeFromSelect') && (
  <div className="absolute top-[55px] w-[170px] left-[10px] z-10 shadow-sm">
  <button  title="flex-block Calculate the best route from selected points to propery location" onClick={()=> handleBestRouteCalculation()} 
   className="p-2 flex gap-1 items-center text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
      >
<PushPinOutlinedIcon sx={{ fontSize: 16 }}/> Get route distance from selected location to the property location
</button>
</div>
)}

{(inputMode === 'routeFromMyLocation') && (
  <div className="absolute top-[55px] w-[170px] left-[10px] z-10 shadow-md">
  <button  title="Calculate the route from your current location" onClick={()=> handleDirectionClick()} 
   className="p-2 flex gap-1 items-center text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
      >
<GpsFixedOutlinedIcon sx={{ fontSize: 16 }}/>  Get route distance from my current location to the property location?
</button>
</div>
)}

      </GoogleMap>
    </div>

    </div>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapWithFeatures;
