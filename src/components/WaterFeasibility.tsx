import { calculateWaterFeasibility } from "../lib/api";
import { useState, useEffect } from "react";
import StepNav from './ui/StepNav'
import { useAppData } from "../context/AppDataContext"

export default function WaterFeasibility() {
  const { areaSqm, yearlyRainMM, runoffCoefficient, setFeasibilityResult } = useAppData();
  const [inputs, setInputs] = useState({
    dwellers: 4,
    liters_per_person_per_day: 135,
    area_sqm: null,
    yearly_rain_mm: null,
    runoff_coefficient: null,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const data = await calculateWaterFeasibility({
        ...inputs,
        area_sqm: Number(areaSqm ?? inputs.area_sqm ?? 0),
        yearly_rain_mm: Number(yearlyRainMM ?? inputs.yearly_rain_mm ?? 0),
        runoff_coefficient: Number(runoffCoefficient ?? inputs.runoff_coefficient ?? 0),
      });
      setResult(data);
      try { setFeasibilityResult(data) } catch {}
    } catch (error) {
      console.error('Feasibility calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k, v) => setInputs((prev) => ({ ...prev, [k]: Number(v) }));

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      area_sqm: areaSqm ?? prev.area_sqm ?? 0,
      yearly_rain_mm: yearlyRainMM ?? prev.yearly_rain_mm ?? 0,
      runoff_coefficient: runoffCoefficient ?? prev.runoff_coefficient ?? 0,
    }));
  }, [areaSqm, yearlyRainMM, runoffCoefficient]);

  const inputFields = [
    { key: 'dwellers', label: 'Number of Dwellers', icon: '👥', editable: true },
    { key: 'liters_per_person_per_day', label: 'Liters per Person per Day', icon: '💧', editable: true },
    { key: 'area_sqm', label: 'Rooftop Area (m²)', icon: '🏠', editable: false },
    { key: 'yearly_rain_mm', label: 'Yearly Rainfall (mm)', icon: '🌧️', editable: false },
    { key: 'runoff_coefficient', label: 'Runoff Coefficient', icon: '📊', editable: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Water Feasibility Analysis</h1>
          <p className="text-gray-600">Step 5: Calculate your rainwater harvesting potential</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Input Parameters</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {inputFields.map(({ key, label, icon, editable }) => (
              <div key={key} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="text-lg">{icon}</span>
                  {label}
                  {!editable && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Auto-filled</span>}
                </label>
                <input
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !editable 
                      ? "bg-blue-50 border-blue-200 text-gray-700" 
                      : "border-gray-300"
                  }`}
                  type="number"
                  value={inputs[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  disabled={!editable}
                  readOnly={!editable}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "🔄 Computing..." : "🧮 Calculate Feasibility"}
          </button>
        </div>

        {result && (
          <div className={`rounded-xl p-6 mb-6 ${
            result.feasibility 
              ? "bg-green-50 border border-green-200" 
              : "bg-orange-50 border border-orange-200"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              result.feasibility ? "text-green-800" : "text-orange-800"
            }`}>
              Feasibility Results
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Annual Water Need</div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.yearly_need_liters.toLocaleString()} L
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Potential Yield</div>
                <div className="text-2xl font-bold text-green-600">
                  {result.potential_yield_liters.toLocaleString()} L
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Water Savings</div>
                <div className="text-2xl font-bold text-purple-600">
                  {result.savings_liters.toLocaleString()} L
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Feasibility Status</div>
                <div className={`text-2xl font-bold ${
                  result.feasibility ? "text-green-600" : "text-orange-600"
                }`}>
                  {result.feasibility ? "✅ Feasible" : "⚠️ Limited"}
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
              <p className="text-gray-600">
                {result.feasibility 
                  ? "Great news! Rainwater harvesting is highly feasible for your location. You can potentially save significant amounts of water annually."
                  : "Rainwater harvesting has limited feasibility for your current setup. Consider optimizing your collection area or storage capacity."
                }
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Understanding the Analysis</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">💧</span>
              </div>
              <div className="font-medium">Water Demand</div>
              <div>Based on household size and daily consumption</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🌧️</span>
              </div>
              <div className="font-medium">Collection Potential</div>
              <div>Calculated from roof area and rainfall data</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">⚖️</span>
              </div>
              <div className="font-medium">Feasibility Score</div>
              <div>Compares supply potential with demand</div>
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