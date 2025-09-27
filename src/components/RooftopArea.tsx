import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

import StepNav from './ui/StepNav'
import { useAppData } from '../context/AppDataContext'

export default function RooftopArea() {
  const mapRef = useRef(null);
  const { setAreaSqm } = useAppData()
  const mapInstance = useRef(null);
  const polygonRef = useRef(null);
  const markersRef = useRef([]);
  const autocompleteInputRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [area, setArea] = useState(null);

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        const map = mapInstance.current;
        if (map) {
          map.panTo(pos);
          map.setZoom(18);
          new google.maps.Marker({ position: pos, map, label: 'Me' });
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        alert('Unable to get your location. Please check permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry"],
    });
    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 20.59, lng: 78.96 },
        zoom: 5,
        mapTypeId: "satellite",
      });
      mapInstance.current = map;

      // Setup autocomplete search
      const input = autocompleteInputRef.current;
      const ac = new google.maps.places.Autocomplete(input, {
        fields: ["geometry", "name"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const loc = place?.geometry?.location;
        if (loc) {
          map.panTo(loc);
          map.setZoom(18);
        }
      });

      map.addListener("click", (e) => {
        const p = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPoints((prev) => [...prev, p]);
      });
    });
  }, []);

  // Update markers and polygon when points change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Add new markers
    points.forEach((p, idx) => {
      const m = new google.maps.Marker({ position: p, map, label: `${idx + 1}` });
      markersRef.current.push(m);
    });

    // Draw/Update polygon
    if (polygonRef.current) polygonRef.current.setMap(null);
    if (points.length >= 3) {
      polygonRef.current = new google.maps.Polygon({
        paths: points,
        strokeColor: "#2563eb",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        map,
      });
    }
  }, [points]);

  const calculate = () => {
    if (points.length < 3) return;
    const path = points.map((p) => new google.maps.LatLng(p.lat, p.lng));
    const m2 = google.maps.geometry.spherical.computeArea(path);
    const sqft = m2 * 10.7639;
    setArea({ m2, sqft });
    try { setAreaSqm(Number(m2.toFixed(2))); } catch {}
  };

  const clear = () => {
    setPoints([]);
    setArea(null);
    if (polygonRef.current) polygonRef.current.setMap(null);
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Measure Your Rooftop Area</h1>
          <p className="text-gray-600">Step 1: Click on your rooftop corners to calculate the area</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              ref={autocompleteInputRef}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search your location (address, place)"
            />
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={locateMe}
            >
              📍 Use My Location
            </button>
            <button 
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              onClick={clear}
            >
              🗑️ Clear
            </button>
          </div>

          <div
            ref={mapRef}
            style={{ height: 500 }}
            className="rounded-lg overflow-hidden shadow-md border border-gray-200"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Search or locate your address</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Click on rooftop corners to trace the shape</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Click "Calculate Area" when done</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Points Added ({points.length})</h3>
            {points.length > 0 ? (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {points.map((p, i) => (
                  <div key={i} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    Point {i + 1}: {p.lat.toFixed(6)}, {p.lng.toFixed(6)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No points added yet. Click on the map to start.</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            disabled={points.length < 3}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
            onClick={calculate}
          >
            {points.length < 3 ? `Add ${3 - points.length} more points` : 'Calculate Area'}
          </button>
        </div>

        {area && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Rooftop Area Calculated!</h3>
            <div className="text-2xl font-bold text-green-600">
              {area.m2.toFixed(2)} m² ({area.sqft.toFixed(2)} ft²)
            </div>
          </div>
        )}

        <div className="mt-8">
          <StepNav />
        </div>
      </div>
    </div>
  );
}
