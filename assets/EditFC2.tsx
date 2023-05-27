import React, { useEffect, useRef } from 'react';
import "leaflet-draw/dist/leaflet.draw.css";
import { FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import type { FeatureCollection, GeoJsonObject } from 'geojson';
import L from 'leaflet';

// interface Props {
//   geojson: FeatureCollection;
//   setGeojson: (geojson: FeatureCollection) => void;
// }

export default function EditControlFC({ geojson, setGeojson }: any) {
  const ref = useRef<null | L.FeatureGroup>(null);

  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      geojson.features.forEach((feature: any) => {
        const layer = L.geoJSON(feature);
        ref.current?.addLayer(layer);
      });
    }
  }, [geojson]);

  const handleChange = () => {
    const geo = ref.current?.toGeoJSON() as FeatureCollection;
    console.log(geo);
    if (geo && geo.type === 'FeatureCollection') {
      setGeojson(geo);
    }
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleChange}
        draw={{
          rectangle: false,
          circle: false,
          polyline: true,
          polygon: true,
          marker: true,
          circlemarker: false,
        }}
      />
      {geojson && <GeoJSON data={geojson} />}
    </FeatureGroup>
  );
}
