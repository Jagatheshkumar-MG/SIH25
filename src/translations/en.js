export const en = {
  // Header/Navigation
  header: {
    title: "RWH Feasibility",
    rooftop: "Rooftop",
    material: "Material", 
    rainfall: "Rainfall",
    feasibility: "Feasibility",
    soil: "Soil",
    report: "Report",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
  },

  // Landing Page
  landing: {
    title: "Rainwater Harvesting Feasibility",
    subtitle: "This is a web for checking the feasibility of rooftop rain water harvesting. Sign up or log in to get started.",
    getStarted: "Get started",
    skipToSteps: "Skip to steps",
    features: {
      rooftopArea: {
        title: "Rooftop Area",
        description: "Calculate effective catchment area."
      },
      material: {
        title: "Material",
        description: "Upload details for filtration and storage."
      },
      rainfall: {
        title: "Rainfall", 
        description: "Provide rainfall data for your region."
      },
      waterFeasibility: {
        title: "Water Feasibility",
        description: "Estimate potential harvest and savings."
      },
      soilAquifer: {
        title: "Soil & Aquifer",
        description: "Analyze percolation capacity and soil."
      },
      reportChatbot: {
        title: "Report & Chatbot",
        description: "Generate report and Q&A."
      }
    }
  },

  // Login Page
  login: {
    loginTitle: "Login",
    signupTitle: "Sign Up",
    subtitle: "This is a web for checking the feasibility of rooftop rain water harvesting. Please {mode} to continue.",
    email: "Email",
    password: "Password", 
    loginButton: "Login",
    createAccount: "Create Account",
    switchToSignup: "Switch to Sign Up",
    switchToLogin: "Switch to Login",
    loggedIn: "Logged in",
    signedUp: "Signed up"
  },

  // Steps
  steps: {
    step1: {
      title: "Step 1: Rooftop Area",
      description: "Search your location, then click rooftop corners to trace the shape.",
      searchPlaceholder: "Search your location (address, place)",
      useMyLocation: "Use my location",
      clear: "Clear",
      clickInstruction: "Click on rooftop corners to add points. Coordinates will appear below.",
      calculateArea: "Calculate Area",
      area: "Area"
    },
    step2: {
      title: "Step 2: Material",
      description: "Upload a clear photo of your rooftop surface.",
      classifying: "Classifying…",
      classify: "Classify",
      prediction: "Prediction",
      runoffCoefficient: "Runoff coefficient", 
      confidence: "Confidence",
      tip: "Tip: Ensure your backend URL is correct and CORS is properly configured."
    },
    step3: {
      title: "Step 3: Rainfall",
      description: "Pick your State and District. We'll geocode and fetch rainfall for the area.",
      states: "States",
      districts: "Districts",
      districtsIn: "Districts in {state}",
      selectState: "Select a state to view districts",
      searchState: "Search state...",
      searchDistrict: "Search district...",
      selectStateFirst: "Select a state first",
      selectDistrict: "Select a district",
      noStatesMatch: "No states match.",
      noDistrictsMatch: "No districts match.",
      fetchRainfall: "Fetch Rainfall",
      fetching: "Fetching…",
      yearlyRain: "Yearly rain",
      avgTemp: "Avg temp",
      source: "Source",
      monthly: "Monthly (raw)",
      locationError: "Could not resolve location. Please refine your selection.",
      geocodingError: "Geocoding failed. Check your network/API key.",
      noRainfallData: "No rainfall data available for this location.",
      fetchError: "Failed to fetch rainfall data."
    },
    step4: {
      title: "Step 4: Soil & Aquifer", 
      description: "Your location is auto-detected. Adjust if needed and analyze.",
      latitude: "Latitude",
      longitude: "Longitude",
      useMyLocation: "Use My Location",
      analyze: "Analyze",
      analyzing: "Analyzing...",
      soilType: "Soil type",
      aquiferType: "Aquifer type", 
      rechargeEfficiency: "Recharge efficiency",
      pitVolume: "Pit volume (m³)",
      geolocationNotSupported: "Geolocation not supported.",
      locationError: "Unable to get your location. Please check permissions.",
      provideCoordsError: "Please provide latitude and longitude.",
      analyzeError: "Failed to analyze soil"
    },
    step5: {
      title: "Step 5: Feasibility",
      description: "Adjust inputs to estimate yearly yield and savings.",
      dwellers: "Dwellers",
      litersPerPersonPerDay: "Liters per person per day",
      areaSqm: "Area sqm", 
      yearlyRainMm: "Yearly rain mm",
      runoffCoefficient: "Runoff coefficient",
      auto: "auto",
      compute: "Compute",
      yearlyNeed: "Yearly need",
      potentialYield: "Potential yield",
      savings: "Savings",
      feasible: "Feasible",
      yes: "Yes",
      no: "No"
    },
    step6: {
      title: "Step 6: Report",
      description: "Generate a report based on Soil & Aquifer, Rainfall, Material, Runoff Coefficient, and Area.",
      area: "Area (m²)",
      yearlyRain: "Yearly Rain (mm)",
      runoffCoefficient: "Runoff Coefficient", 
      material: "Material",
      coordinates: "Coordinates",
      soilAquifer: "Soil & Aquifer",
      soil: "Soil",
      aquifer: "Aquifer",
      rechargeEfficiency: "Recharge efficiency",
      feasibilityOverview: "Feasibility overview",
      chartNote: "Chart will populate after you Generate Report (we compute feasibility if needed).",
      language: "Language (e.g., en, hi)",
      generateReport: "Generate Report", 
      downloadPdf: "Download PDF",
      noReportText: "No report text returned by backend.",
      reportError: "Error generating report. Please check backend logs."
    }
  },

  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    back: "Back",
    next: "Next",
    finish: "Finish",
    na: "N/A"
  }
};