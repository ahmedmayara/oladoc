import React from "react";

import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { cn } from "@/lib/utils";

import { Geocoder } from "./geocoder";
import { MapMarker } from "./marker";

const markerIcon = L.icon({ iconUrl: "/images/marker-icon.png" });
const markerIcon2x = L.icon({ iconUrl: "/images/marker-icon-2x.png" });
const markerShadow = L.icon({ iconUrl: "/images/marker-shadow.png" });

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapProps {
  center?: number[];
  zoom?: number;
  className?: string;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function Map({ center, zoom, className }: MapProps) {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={(center && 16) || zoom || 2}
      scrollWheelZoom={false}
      className={cn("h-[25vh] rounded-lg", className)}
    >
      <TileLayer url={url} attribution={attribution} />
      {center && <MapMarker center={center as L.LatLngExpression} />}
      <Geocoder />
    </MapContainer>
  );
}
