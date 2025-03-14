import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api";
import Link from "next/link";
import Image from "next/image";
import { IAd } from "@/lib/database/models/ad.model";
import { formatKsh } from "@/lib/help";

type CardProps = {
  data: any;
  handleAdView: (id:string) => void;
};

const mapContainerStyle = {
  height: "500px",
  width: "100%",
  borderRadius: "8px", // equivalent to `rounded-xl`
};

const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates

const GoogleMapAll = ({ data,handleAdView }: CardProps) => {
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [myloc, setMyloc] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEAPIKEY!, // Replace with your Google Maps API key
  });

  useEffect(() => {
  //  const query = new URLSearchParams(window.location.search);
   // const latitude = query.get("latitude");
  //  const longitude = query.get("longitude");

    //if (latitude && longitude) {
    //  setMyloc({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
//}

    // Find the first property with a valid location
    const firstValidAd = data.find(
      (ad: any) =>
        ad.data?.propertyarea?.location?.coordinates
    );

    if (firstValidAd) {
      setMapCenter(firstValidAd.data.propertyarea.location.coordinates);
    }
  }, [data]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={mapCenter}>
      {/* Custom div overlay for user location displaying an amount */}
      {myloc && (
        <OverlayView
          position={myloc}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#333",
            }}
            onClick={() => setSelectedAd(null)}
          >
            {/* Display an amount or custom content here */}
          </div>
        </OverlayView>
      )}

      {/* Markers for each ad */}
      {data.map((ad: any) => (
        ad.data.propertyarea?.location && (
          <OverlayView
            key={ad._id}
            position={ad.data.propertyarea.location.coordinates}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                backgroundColor: "#000000",
                padding: "5px 10px",
                borderRadius: "8px",
                width: "100px",
                color: "#ffffff",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                position: "relative",
                textAlign: "center",
              }}
              onClick={() => setSelectedAd(ad)}
            >
              {formatKsh(ad.data.price)}

              {/* Pointer */}
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "0",
                  height: "0",
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "8px solid #000000",
                }}
              />
            </div>
          </OverlayView>
        )
      ))}

      {/* InfoWindow for selected ad */}
      {selectedAd && (
        <InfoWindow
        position={selectedAd.data.propertyarea.location.coordinates}
          onCloseClick={() => setSelectedAd(null)}
        >
          <div
            className="relative flex items-center justify-center p-0 w-[150px] h-[100px] rounded-lg bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${selectedAd.data.imageUrls[0]})` }}
          >
            <div
              onClick={() => {
              
                handleAdView(selectedAd._id);
              }}
              className="absolute inset-0 bg-black/50 rounded-lg"
            ></div>
            <div className="relative z-10 flex flex-col items-start p-2">
              <div
                onClick={() => {
              
                  handleAdView(selectedAd._id);
                }}
                className=" text-xs text-white">
                {selectedAd.data.title}
              </div>
              <b className="text-xs font-semibold text-white">
                {formatKsh(selectedAd.data.price)}
              </b>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapAll;
