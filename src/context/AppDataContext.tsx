import { createContext, useContext, useState, useMemo } from "react";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [areaSqm, setAreaSqm] = useState(null);
  const [runoffCoefficient, setRunoffCoefficient] = useState(null);
  const [yearlyRainMM, setYearlyRainMM] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [materialLabel, setMaterialLabel] = useState(null)
  const [feasibilityResult, setFeasibilityResult] = useState(null)
  const [landType, setLandType] = useState(null)
  const [recommendedStructures, setRecommendedStructures] = useState([])

  const value = useMemo(
    () => ({
      areaSqm, setAreaSqm,
      runoffCoefficient, setRunoffCoefficient,
      yearlyRainMM, setYearlyRainMM,
      latLng, setLatLng,
      soilData, setSoilData,
      materialLabel, setMaterialLabel,
      feasibilityResult, setFeasibilityResult,
      landType, setLandType,
      recommendedStructures, setRecommendedStructures,
    }),
    [areaSqm, runoffCoefficient, yearlyRainMM, latLng, soilData, materialLabel, feasibilityResult, landType, recommendedStructures]
  )

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
