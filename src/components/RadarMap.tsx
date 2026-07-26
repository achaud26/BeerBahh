"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bar,
  CLEMSON_CENTER,
  CLEMSON_DEFAULT_ZOOM,
  crowdCopy,
} from "@/data/bars";

function crowdIcon(crowd: Bar["crowd"], selected: boolean) {
  const color = crowdCopy[crowd].color;
  const size = selected ? 44 : 34;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <span style="position:absolute;inset:0;border-radius:999px;background:${color};opacity:0.35;animation:pulse-ring 1.8s ease-out infinite;"></span>
        <span style="position:absolute;inset:4px;border-radius:999px;background:${color};border:2.5px solid #f4f7f4;box-shadow:0 4px 12px rgba(0,0,0,0.45);"></span>
      </div>
    `,
  });
}

function FlyTo({ bar }: { bar: Bar | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bar) return;
    map.flyTo([bar.lat, bar.lng], 16, { duration: 0.7 });
  }, [bar, map]);
  return null;
}

type RadarMapProps = {
  bars: Bar[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function RadarMap({ bars, selectedId, onSelect }: RadarMapProps) {
  const selected = bars.find((b) => b.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[CLEMSON_CENTER.lat, CLEMSON_CENTER.lng]}
      zoom={CLEMSON_DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo bar={selected} />
      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={[bar.lat, bar.lng]}
          icon={crowdIcon(bar.crowd, bar.id === selectedId)}
          eventHandlers={{ click: () => onSelect(bar.id) }}
        />
      ))}
    </MapContainer>
  );
}
