import { analyzeSoil } from "../lib/api";
import { useState, useEffect } from "react";
import StepNav from "./ui/StepNav";
import { useAppData } from "../context/AppDataContext";

export default function SoilAnalysis() {
  const { latLng, setSoilData } = useAppData();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latLng?.lat && latLng?.lng) {
      setLat(latLng.lat.toFixed(6));
      setLng(latLng.lng.toFixed(6));
    }
  }, [latLng]);

  useEffect(() => {
    if (lat || lng) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toFixed(6));
        setLng(coords.longitude.toFixed(6));
      },
      () => {}
    );
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toFixed(6));
        setLng(coords.longitude.toFixed(6));
      },
      (err) => {
        console.warn("Geolocation error", err);
        alert("Unable to get your location. Please check permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async () => {
    if (!lat || !lng) return alert("Please provide latitude and longitude.");
    setLoading(true);
    try {
      console.log('Sending soil analysis request:', { lat: Number(lat), lng: Number(lng) });
      const result = await analyzeSoil(Number(lat), Number(lng));
      console.log('Soil analysis result:', result);
      setData(result);
      setSoilData(result);
    } catch (err) {
      console.error('Soil analysis error:', err);
      alert(`Failed to analyze soil: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Soil & Aquifer Analysis</h1>
          <p className="text-gray-600">Step 4: Analyze soil conditions for rainwater harvesting</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                placeholder="Enter latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                placeholder="Enter longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <button
              onClick={useMyLocation}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg"
            >
              📍 Use My Location
            </button>
            <button
              onClick={submit}
              disabled={!lat || !lng || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
            >
              {loading ? "🔄 Analyzing..." : "🔬 Analyze Soil"}
            </button>
          </div>
        </div>

        {data && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Soil Type</div>
                <div className="text-lg font-semibold text-gray-800">{String(data.soil_class ?? 'Unknown')}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Aquifer Type</div>
                <div className="text-lg font-semibold text-gray-800">{String(data.aquifer ?? 'Unknown')}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Recharge Efficiency</div>
                <div className="text-lg font-semibold text-blue-600">{String(data.recharge_efficiency ?? 'N/A')}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Recommended Pit Volume</div>
                <div className="text-lg font-semibold text-purple-600">{String(data.pit_volume_cum ?? 'N/A')} m³</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About Soil Analysis</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🏔️</span>
              </div>
              <div className="font-medium">Soil Classification</div>
              <div>Determines water absorption capacity</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">💧</span>
              </div>
              <div className="font-medium">Aquifer Analysis</div>
              <div>Evaluates groundwater recharge potential</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📏</span>
              </div>
              <div className="font-medium">Pit Sizing</div>
              <div>Calculates optimal storage volume</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StepNav />
        </div>
      </div>
    </div>
  );
}