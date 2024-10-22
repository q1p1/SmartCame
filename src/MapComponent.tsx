// src/MapComponent.tsx
import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new Map({
        basemap: "topo-vector",
      });

      new MapView({
        container: mapRef.current,
        map: map,
        zoom: 4,
        center: [15, 65], // الموقع الابتدائي
      });
    }
  }, []);

  return (
    <div>
      <h1>ArcGIS Map</h1>
      <div ref={mapRef} style={{ height: 500, width: "100%" }}></div>
    </div>
  );
};

export default MapComponent;
