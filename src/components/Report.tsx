import { generateReport, calculateWaterFeasibility } from "../lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import StepNav from './ui/StepNav'
import { useAppData } from "../context/AppDataContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Report() {
  const { 
    areaSqm, yearlyRainMM, runoffCoefficient, soilData, materialLabel, latLng, feasibilityResult,
    landType: contextLandType, setLandType: setContextLandType,
    recommendedStructures: contextRecommendedStructures, setRecommendedStructures: setContextRecommendedStructures
  } = useAppData();
  const [language, setLanguage] = useState("en");
  const [report, setReport] = useState("");
  const [chartData, setChartData] = useState(null);
  const [structureRecommendations, setStructureRecommendations] = useState([]);
  const [manualLandTypeOverride, setManualLandTypeOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  const rwhStructures = [
    {
      name: "Recharge Pit",
      application: ["Urban", "Rural"],
      areaReq: "Small area (50–200 sq.m)",
      suitableSoils: ["sandy", "loamy", "sand", "loam", "sandy loam"],
      unsuitableSoils: ["heavy clay", "impermeable"],
      description: "Ideal for individual buildings with good infiltration soil",
      minArea: 50,
      maxArea: 200,
      urbanPreference: 85,
      ruralPreference: 75,
      costEffectiveness: "High",
      maintenanceLevel: "Low"
    },
    {
      name: "Recharge Trench",
      application: ["Urban", "Rural"], 
      areaReq: "Medium (100–500 sq.m along roads/fields)",
      suitableSoils: ["sandy loam", "silty loam", "loam", "sandy"],
      unsuitableSoils: ["clay", "heavy clay", "impermeable clay"],
      description: "Perfect for linear installations along roads, driveways, or field boundaries",
      minArea: 100,
      maxArea: 500,
      urbanPreference: 70,
      ruralPreference: 90,
      costEffectiveness: "High",
      maintenanceLevel: "Medium"
    },
    {
      name: "Recharge Well / Injection Well",
      application: ["Urban", "Rural"],
      areaReq: "Small–Medium (requires bore area)", 
      suitableSoils: ["alluvium", "sandy", "fractured rock", "permeable"],
      unsuitableSoils: ["clayey", "clay", "impermeable"],
      description: "Excellent for areas with limited space but good aquifer connectivity",
      minArea: 20,
      maxArea: 150,
      urbanPreference: 95,
      ruralPreference: 70,
      costEffectiveness: "Medium",
      maintenanceLevel: "Medium"
    },
    {
      name: "Surface Storage Tank",
      application: ["Urban", "Rural"],
      areaReq: "Variable (medium–large, depends on demand)",
      suitableSoils: ["any"],
      unsuitableSoils: [],
      description: "Universal solution - lined tanks for sandy areas, natural clay lining for rural",
      minArea: 200,
      maxArea: 10000,
      urbanPreference: 60,
      ruralPreference: 85,
      costEffectiveness: "Medium",
      maintenanceLevel: "Low"
    }
  ];

  const detectLandType = (coords) => {
    if (!coords || !coords.lat || !coords.lng) return "Urban";
    
    const majorCityCoords = [
      { lat: 28.6139, lng: 77.2090, city: "Delhi" },
      { lat: 19.0760, lng: 72.8777, city: "Mumbai" },
      { lat: 12.9716, lng: 77.5946, city: "Bangalore" },
      { lat: 13.0827, lng: 80.2707, city: "Chennai" },
      { lat: 22.5726, lng: 88.3639, city: "Kolkata" },
      { lat: 17.3850, lng: 78.4867, city: "Hyderabad" }
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

  const getStructureRecommendations = (area, soilType, landTypeDetected) => {
    if (!area || !soilType) return [];
    
    const areaNum = Number(area);
    const soilLower = String(soilType).toLowerCase();
    
    return rwhStructures.filter(structure => {
      const areaFits = areaNum >= structure.minArea && areaNum <= structure.maxArea;
      const landTypeCompatible = structure.application.includes(landTypeDetected);
      const soilSuitable = structure.suitableSoils.includes('any') || 
        structure.suitableSoils.some(soil => soilLower.includes(soil.toLowerCase()));
      const soilUnsuitable = structure.unsuitableSoils && structure.unsuitableSoils.length > 0 &&
        structure.unsuitableSoils.some(soil => soilLower.includes(soil.toLowerCase()));
      
      return areaFits && landTypeCompatible && soilSuitable && !soilUnsuitable;
    }).map(structure => ({
      ...structure,
      suitabilityScore: calculateSuitabilityScore(structure, areaNum, soilLower, landTypeDetected),
      recommendationReason: generateRecommendationReason(structure, areaNum, soilLower, landTypeDetected)
    })).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  };

  const calculateSuitabilityScore = (structure, area, soilType, landTypeDetected) => {
    let score = 40;
    const areaRange = structure.maxArea - structure.minArea;
    const areaMidpoint = structure.minArea + (areaRange / 2);
    const areaDistance = Math.abs(area - areaMidpoint);
    const areaScore = Math.max(0, 25 - (areaDistance / areaRange) * 25);
    score += areaScore;
    
    if (structure.suitableSoils.includes('any')) {
      score += 15;
    } else {
      const soilMatches = structure.suitableSoils.filter(soil => 
        soilType.includes(soil.toLowerCase())
      ).length;
      score += Math.min(25, soilMatches * 12);
    }
    
    const preference = landTypeDetected === 'Urban' ? structure.urbanPreference : structure.ruralPreference;
    score += (preference / 100) * 15;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const generateRecommendationReason = (structure, area, soilType, landTypeDetected) => {
    const reasons = [];
    
    if (area >= structure.minArea && area <= structure.maxArea) {
      reasons.push("Perfect area match");
    }
    
    if (structure.suitableSoils.includes('any')) {
      reasons.push("Works with any soil type");
    } else if (structure.suitableSoils.some(soil => soilType.toLowerCase().includes(soil.toLowerCase()))) {
      reasons.push("Excellent soil compatibility");
    }
    
    const preference = landTypeDetected === 'Urban' ? structure.urbanPreference : structure.ruralPreference;
    if (preference >= 80) {
      reasons.push(`Highly suitable for ${landTypeDetected.toLowerCase()} areas`);
    }
    
    return reasons.slice(0, 2).join("; ");
  };

  const composedPayload = useMemo(() => ({
    coords: latLng,
    area_sqm: areaSqm,
    yearly_rain_mm: yearlyRainMM,
    runoff_coefficient: runoffCoefficient,
    material: materialLabel,
    soil: soilData,
  }), [latLng, areaSqm, yearlyRainMM, runoffCoefficient, materialLabel, soilData]);

  const computeFeasibility = async () => {
    const data = await calculateWaterFeasibility({
      dwellers: 4,
      liters_per_person_per_day: 135,
      area_sqm: Number(areaSqm || 0),
      yearly_rain_mm: Number(yearlyRainMM || 0),
      runoff_coefficient: Number(runoffCoefficient || 0),
    });
    if (data) {
      setChartData([
        { name: 'Need (L/yr)', value: data.yearly_need_liters },
        { name: 'Potential (L/yr)', value: data.potential_yield_liters },
      ]);
    }
    return data;
  }

  const submit = async () => {
    setLoading(true);
    try {
      const feas = feasibilityResult || await computeFeasibility();
      
      let finalLandType = contextLandType;
      if (!finalLandType && !manualLandTypeOverride) {
        finalLandType = detectLandType(latLng);
        setContextLandType(finalLandType);
      }
      
      const recommendations = getStructureRecommendations(areaSqm, soilData?.soil_class, finalLandType);
      setStructureRecommendations(recommendations);
      setContextRecommendedStructures(recommendations);
      
      const topStructureNames = recommendations.slice(0, 3).map(s => s.name);
      const primaryRecommendation = recommendations[0]?.name || 'Surface Storage Tank';
      
      const payload = { 
        ...composedPayload, 
        feasibility: feas,
        land_type: finalLandType,
        structure_recommendations: recommendations,
        primary_recommended_structure: primaryRecommendation,
        top_3_structures: topStructureNames,
        analysis_context: {
          area_category: areaSqm > 500 ? 'Large' : areaSqm > 200 ? 'Medium' : 'Small',
          soil_suitability: recommendations.length > 0 ? 'Compatible' : 'Limited options',
          location_context: finalLandType
        }
      };
      const data = await generateReport(payload, language);
      setReport(data?.report || "No report text returned by backend.");
    } catch (e) {
      setReport("Error generating report. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const printPDF = () => {
    window.print();
  };

  useEffect(() => {
    if (feasibilityResult) {
      setChartData([
        { name: 'Need (L/yr)', value: feasibilityResult.yearly_need_liters },
        { name: 'Potential (L/yr)', value: feasibilityResult.potential_yield_liters },
      ]);
    }
  }, [feasibilityResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Comprehensive Report</h1>
          <p className="text-gray-600">Step 6: Generate your rainwater harvesting feasibility report</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Project Summary</h3>
            </div>
            
            <div className="grid gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏠</span>
                    </div>
                    <span className="font-medium text-gray-700">Rooftop Area</span>
                  </div>
                  <span className="text-lg font-bold text-blue-700">{areaSqm ?? '—'} m²</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🌧️</span>
                    </div>
                    <span className="font-medium text-gray-700">Annual Rainfall</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{yearlyRainMM ?? '—'} mm</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📈</span>
                    </div>
                    <span className="font-medium text-gray-700">Runoff Coefficient</span>
                  </div>
                  <span className="text-lg font-bold text-purple-700">{runoffCoefficient ?? '—'}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🏗️</span>
                    </div>
                    <span className="font-medium text-gray-700">Material Type</span>
                  </div>
                  <span className="text-lg font-bold text-orange-700">{materialLabel ?? '—'}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📍</span>
                    </div>
                    <span className="font-medium text-gray-700">Location</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-700">{latLng ? `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}` : '—'}</span>
                </div>
              </div>
              
              {soilData && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🌱</span>
                        </div>
                        <span className="font-medium text-gray-700">Soil Type</span>
                      </div>
                      <span className="text-lg font-bold text-amber-700">{soilData.soil_class ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between pl-11">
                      <span className="font-medium text-gray-600">Aquifer Type</span>
                      <span className="text-sm font-semibold text-amber-600">{soilData.aquifer ?? '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Feasibility Chart</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toLocaleString()}L`}
                  >
                    {(chartData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} L`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {!chartData && (
              <div className="text-sm text-gray-500 text-center mt-4">
                Chart will populate after generating report
              </div>
            )}
          </div>
        </div>

        {structureRecommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🏗️ Recommended Structures</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {structureRecommendations.slice(0, 4).map((structure, idx) => (
                <div key={structure.name} className={`border rounded-lg p-4 ${
                  idx === 0 ? "border-green-300 bg-green-50" : "border-gray-200"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{structure.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      structure.suitabilityScore >= 80 ? "bg-green-100 text-green-700" :
                      structure.suitabilityScore >= 60 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {structure.suitabilityScore}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{structure.description}</p>
                  <div className="text-xs text-gray-500">
                    <div>Cost: {structure.costEffectiveness} • Maintenance: {structure.maintenanceLevel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Report Settings</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <input
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., en, hi"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area Type</label>
              <select
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={contextLandType || (latLng ? detectLandType(latLng) : 'Urban')}
                onChange={(e) => {
                  const newLandType = e.target.value;
                  setContextLandType(newLandType);
                  setManualLandTypeOverride(true);
                  if (areaSqm && soilData?.soil_class) {
                    const newRecommendations = getStructureRecommendations(areaSqm, soilData.soil_class, newLandType);
                    setStructureRecommendations(newRecommendations);
                    setContextRecommendedStructures(newRecommendations);
                  }
                }}
              >
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center gap-4">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "🔄 Generating..." : "📄 Generate Report"}
            </button>
            <button 
              className="px-6 py-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg"
              onClick={printPDF}
              disabled={!report}
            >
              📥 Download PDF
            </button>
          </div>
        </div>

        {report && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Generated Report</h3>
            <div ref={printRef} className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {report}
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