import { getRainfall, getWeather } from "../lib/api";
import { useState } from "react";
import indiaLocations from "../data/india_locations.json";
import StepNav from './ui/StepNav'
import { useAppData } from '../context/AppDataContext'

export default function RainfallInfo() {
  const { setYearlyRainMM, setLatLng: setCtxLatLng, setLandType } = useAppData()
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [latlng, setLatlng] = useState(null);
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hasPitSpace, setHasPitSpace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stateQuery, setStateQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [lastQuery, setLastQuery] = useState(null);

  const geocode = async (query) => {
    try {
      setError(null);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const j = await res.json();
      const loc = j.results?.[0]?.geometry?.location;
      const norm = normalizeCoords(loc);
      if (norm) {
        setLatlng(norm);
        try { 
          setCtxLatLng(norm);
          const detectedLandType = detectLandType(norm);
          setLandType(detectedLandType);
        } catch {}
        return norm;
      } else {
        setLatlng(null);
        setError('Could not resolve location. Please refine your selection.');
        return null;
      }
    } catch (e) {
      setLatlng(null);
      setError('Geocoding failed. Check your network/API key.');
      return null;
    }
  };

  const onSelectState = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict(null);
    setLatlng(null);
    setData(null);
    setError(null);
  };

  const onSelectDistrict = async (districtName) => {
    setSelectedDistrict(districtName);
    const query = `${districtName}, ${selectedState}, India`;
    const loc = await geocode(query);
    if (loc) {
      await fetchRain(loc);
    }
  };

  const fetchRain = async (coords = latlng) => {
    const norm = normalizeCoords(coords);
    if (!norm) {
      setError('Invalid coordinates.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const latQ = Number(norm.lat.toFixed(6));
      const lngQ = Number(norm.lng.toFixed(6));
      setLastQuery({ lat: latQ, lng: lngQ });
      const [resp, wthr] = await Promise.all([
        getRainfall(latQ, lngQ),
        getWeather(latQ, lngQ)
      ]);
      if (!resp || typeof resp !== 'object') {
        setData(null);
        setError('No rainfall data available for this location.');
      } else {
        setData(resp);
        const yr = getYearlyRain(resp);
        if (Number.isFinite(Number(yr))) {
          try { setYearlyRainMM(Number(yr)); } catch {}
        }
      }
      setWeather(wthr || null);
    } catch (e) {
      setData(null);
      setError('Failed to fetch rainfall data.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (v, digits = 1) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v.toFixed(digits);
    const n = Number(v);
    if (Number.isFinite(n)) return n.toFixed(digits);
    return String(v ?? 'N/A');
  };

  const getYearlyRain = (resp) => {
    if (!resp) return undefined;
    const yr = resp.yearly_rain_mm;
    const yrNum = Number(yr);
    if (Number.isFinite(yrNum)) return yrNum;
    const fromMonthly = resp.monthly_rain_mm?.year_total_mm;
    const fromMonthlyNum = Number(fromMonthly);
    if (Number.isFinite(fromMonthlyNum)) return fromMonthlyNum;
    return undefined;
  };

  const normalizeCoords = (c) => {
    if (!c || typeof c !== 'object') return null;
    const rawLat = typeof c.lat === 'function' ? c.lat() : (c.lat ?? c.latitude);
    const rawLng = typeof c.lng === 'function' ? c.lng() : (c.lng ?? c.lon ?? c.long ?? c.longitude);
    const latNum = Number(rawLat);
    const lngNum = Number(rawLng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;
    return { lat: latNum, lng: lngNum };
  };

  const detectLandType = (coords) => {
    if (!coords || !coords.lat || !coords.lng) return "Urban";
    
    const majorCityCoords = [
      { lat: 28.6139, lng: 77.2090, city: "Delhi" },
      { lat: 19.0760, lng: 72.8777, city: "Mumbai" },
      { lat: 12.9716, lng: 77.5946, city: "Bangalore" },
      { lat: 13.0827, lng: 80.2707, city: "Chennai" },
      { lat: 22.5726, lng: 88.3639, city: "Kolkata" },
      { lat: 17.3850, lng: 78.4867, city: "Hyderabad" },
      { lat: 23.0225, lng: 72.5714, city: "Ahmedabad" },
      { lat: 18.5204, lng: 73.8567, city: "Pune" }
    ];
    
    const isUrban = majorCityCoords.some(city => {
      const distance = Math.sqrt(
        Math.pow((coords.lat - city.lat) * 111, 2) + 
        Math.pow((coords.lng - city.lng) * 111 * Math.cos(coords.lat * Math.PI / 180), 2)
      );
      return distance < 50;
    });
    
    return isUrban ? "Urban" : "Rural";
  };

  const states = indiaLocations.states.map((s) => s.name);
  const lc = (s) => (s || '').toLowerCase();
  const filteredStates = states.filter((s) => lc(s).includes(lc(stateQuery)));
  const districts = selectedState
    ? indiaLocations.states.find((s) => s.name === selectedState)?.districts || []
    : [];
  const filteredDistricts = districts.filter((d) => lc(d).includes(lc(districtQuery)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rainfall Information</h1>
          <p className="text-gray-600">Step 3: Select your location to get rainfall data</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏛️ Select State
              {selectedState && (
                <span className="ml-auto text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{selectedState}</span>
              )}
            </h3>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search state..."
              value={stateQuery}
              onChange={(e) => setStateQuery(e.target.value)}
            />
            <div className="max-h-64 overflow-auto border border-gray-200 rounded-lg">
              {filteredStates.map((st) => (
                <button
                  key={st}
                  onClick={() => onSelectState(st)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedState === st ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-800"
                  }`}
                >
                  {st}
                </button>
              ))}
              {filteredStates.length === 0 && (
                <div className="px-4 py-3 text-gray-600">No states match your search</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🏘️ Select District {selectedState ? `in ${selectedState}` : ''}
            </h3>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search district..."
              value={districtQuery}
              onChange={(e) => setDistrictQuery(e.target.value)}
              disabled={!selectedState}
            />
            <div className="max-h-64 overflow-auto border border-gray-200 rounded-lg">
              {!selectedState && (
                <div className="px-4 py-3 text-gray-600">Select a state first</div>
              )}
              {selectedState && filteredDistricts.map((d) => (
                <button
                  key={d}
                  onClick={() => onSelectDistrict(d)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedDistrict === d ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-800"
                  }`}
                >
                  {d}
                </button>
              ))}
              {selectedState && filteredDistricts.length === 0 && (
                <div className="px-4 py-3 text-gray-600">No districts match your search</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
                onClick={fetchRain}
                disabled={!latlng || loading}
              >
                {loading ? '🔄 Fetching…' : '🌧️ Get Rainfall Data'}
              </button>
              {latlng && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  📍 {formatNumber(latlng.lat, 6)}, {formatNumber(latlng.lng, 6)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Recharge pit space available?</span>
              <button 
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  hasPitSpace === true ? "bg-green-100 border-green-300 text-green-700" : "border-gray-300 hover:bg-gray-50"
                }`} 
                onClick={() => setHasPitSpace(true)}
              >
                ✅ Yes
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  hasPitSpace === false ? "bg-red-100 border-red-300 text-red-700" : "border-gray-300 hover:bg-gray-50"
                }`} 
                onClick={() => setHasPitSpace(false)}
              >
                ❌ No
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            {lastQuery && (
              <p className="text-sm text-red-600 mt-2">Location: {lastQuery.lat}, {lastQuery.lng}</p>
            )}
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Rainfall Data</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Annual Rainfall</div>
                <div className="text-2xl font-bold text-green-600">{formatNumber(getYearlyRain(data), 1)} mm</div>
              </div>
              {typeof data.avg_temp_c !== 'undefined' && data.avg_temp_c !== null && (
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Average Temperature</div>
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(data.avg_temp_c, 1)} °C</div>
                </div>
              )}
              {weather?.current && (
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Current Weather</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {formatNumber(weather.current.temperature,1)}°C • {formatNumber(weather.current.windspeed,1)} km/h
                  </div>
                </div>
              )}
            </div>
            {data.source && (
              <div className="mt-4 text-sm text-gray-600">Data source: {String(data.source)}</div>
            )}
          </div>
        )}

        <div className="mt-8">
          <StepNav />
        </div>
      </div>
    </div>
  );
}