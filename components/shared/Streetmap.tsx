import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet library
type CardProps = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  imageUrls: string[];
};

const Streetmap = ({ id, title, price, imageUrls, lat, lng }: CardProps) => {
  // const center = parseFloat(lat)
  // ? [parseFloat(lat), parseFloat(lng)]
  //   : [52.4797, -1.90269];
  const customIcon = L.icon({
    iconUrl: "/assets/icons/pin.png",
    iconSize: [25, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="map h-72 w-full rounded-lg z-0"
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="z-0"
      />
      <Marker position={[lat, lng]} icon={customIcon}>
        <Popup>
          <div className="flex gap-1 p-1 w-[200px]">
            <Image
              src={imageUrls[0]}
              alt=""
              className="w-24 h-12 object-cover"
              width={900}
              height={500}
            />
            <div className="flex flex-col">
              <div>{title}</div>
              <b>Ksh {price}</b>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Streetmap;
