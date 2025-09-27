import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import StepNav from './ui/StepNav'
import { useAppData } from '../context/AppDataContext'

export default function WaterMap() {
  const mapRef = useRef(null);
  const { latLng } = useAppData();

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });
    loader.load().then(() => {
      const center = latLng || { lat: 20.59, lng: 78.96 };
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: latLng ? 12 : 5,
        mapTypeId: "terrain",
      });
      if (latLng) new google.maps.Marker({ position: latLng, map, title: "Your location" });
    });
  }, [latLng]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Water Map</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">View your area on map to plan recharge structures and storage locations.</p>
      </header>
      <div ref={mapRef} style={{ height: 480 }} className="rounded overflow-hidden shadow" />
      <div className="pt-2">
        <StepNav />
      </div>
    </div>
  );
}



