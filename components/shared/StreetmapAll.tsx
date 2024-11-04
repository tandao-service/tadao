import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet library
import { IAd } from "@/lib/database/models/ad.model";
import Image from "next/image";
type CardProps = {
  data: IAd[];
};

const StreetmapAll = ({ data }: CardProps) => {
  // const center = parseFloat(lat)
  // ? [parseFloat(lat), parseFloat(lng)]
  //   : [52.4797, -1.90269];
  const customIcon = L.icon({
    iconUrl: "/assets/icons/pin.png",
    iconSize: [25, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });
  const myIcon = L.icon({
    iconUrl: "/assets/icons/mypin.png",
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });
  const { latitude, longitude } = data[0];
  let mylat = "";
  let mylng = "";
  const [myloc, setmyloc] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("latitude") && query.get("longitude")) {
      mylat = query.get("latitude") ?? "";
      mylng = query.get("longitude") ?? "";
      setmyloc(true);
    }
  }, []);
  //console.log("Latitude:", lat);
  // console.log("Longitude:", lng);
  return (
    <MapContainer
      center={[parseFloat(latitude), parseFloat(longitude)]}
      zoom={7}
      scrollWheelZoom={false}
      className="map h-[500px] w-full border rounded-lg z-0"
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="z-0"
      />
      {myloc && (
        <Marker position={[0.01324, 37.2748]} icon={myIcon}>
          <Popup>
            <div className="p-1">
              <Image
                src="/assets/icons/mypin.png"
                alt=""
                className="w-12 h-12 object-cover"
                width={50}
                height={50}
              />

              <div className="flex flex-col">
                <div>My Location</div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
      {data.map((ad, index) => {
        return (
          <Marker
            key={index}
            position={[parseFloat(ad.latitude), parseFloat(ad.longitude)]}
            icon={customIcon}
          >
            <Popup>
              <div className="flex gap-1 p-1 w-[200px]">
                <Link href={`/ads/${ad._id}`} className="flex justify-center">
                  <Image
                    src={ad.imageUrls[0]}
                    alt=""
                    className="w-24 h-12 object-cover"
                    width={900}
                    height={500}
                  />
                </Link>
                <div className="flex flex-col">
                  <div>
                    <Link
                      href={`/ads/${ad._id}`}
                      className="flex justify-center"
                    >
                      {ad.title}{" "}
                    </Link>
                  </div>
                  <b>Ksh {ad.price}</b>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default StreetmapAll;
