export const hi = {
  // Header/Navigation
  header: {
    title: "वर्षा जल संचयन व्यवहार्यता",
    rooftop: "छत",
    material: "सामग्री", 
    rainfall: "वर्षा",
    feasibility: "व्यवहार्यता",
    soil: "मिट्टी",
    report: "रिपोर्ट",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
  },

  // Landing Page
  landing: {
    title: "वर्षा जल संचयन व्यवहार्यता",
    subtitle: "यह छत पर वर्षा जल संचयन की व्यवहार्यता की जांच के लिए एक वेब है। आरंभ करने के लिए साइन अप या लॉगिन करें।",
    getStarted: "आरंभ करें",
    skipToSteps: "चरणों पर जाएं",
    features: {
      rooftopArea: {
        title: "छत का क्षेत्र",
        description: "प्रभावी जल संग्रह क्षेत्र की गणना करें।"
      },
      material: {
        title: "सामग्री",
        description: "निस्पंदन और भंडारण के लिए विवरण अपलोड करें।"
      },
      rainfall: {
        title: "वर्षा", 
        description: "अपने क्षेत्र के लिए वर्षा डेटा प्रदान करें।"
      },
      waterFeasibility: {
        title: "जल व्यवहार्यता",
        description: "संभावित संचयन और बचत का अनुमान लगाएं।"
      },
      soilAquifer: {
        title: "मिट्टी और जलभृत",
        description: "पुनर्भरण क्षमता और मिट्टी का विश्लेषण करें।"
      },
      reportChatbot: {
        title: "रिपोर्ट और चैटबॉट",
        description: "रिपोर्ट और प्रश्न-उत्तर उत्पन्न करें।"
      }
    }
  },

  // Login Page
  login: {
    loginTitle: "लॉगिन",
    signupTitle: "साइन अप",
    subtitle: "यह छत पर वर्षा जल संचयन की व्यवहार्यता की जांच के लिए एक वेब है। कृपया जारी रखने के लिए {mode} करें।",
    email: "ईमेल",
    password: "पासवर्ड", 
    loginButton: "लॉगिन",
    createAccount: "खाता बनाएं",
    switchToSignup: "साइन अप पर स्विच करें",
    switchToLogin: "लॉगिन पर स्विच करें",
    loggedIn: "लॉग इन हो गए",
    signedUp: "साइन अप हो गए"
  },

  // Steps
  steps: {
    step1: {
      title: "चरण 1: छत का क्षेत्र",
      description: "अपना स्थान खोजें, फिर आकार का पता लगाने के लिए छत के कोनों पर क्लिक करें।",
      searchPlaceholder: "अपना स्थान खोजें (पता, स्थान)",
      useMyLocation: "मेरा स्थान उपयोग करें",
      clear: "साफ़ करें",
      clickInstruction: "अंक जोड़ने के लिए छत के कोनों पर क्लिक करें। निर्देशांक नीचे दिखाई देंगे।",
      calculateArea: "क्षेत्रफल की गणना करें",
      area: "क्षेत्र"
    },
    step2: {
      title: "चरण 2: सामग्री",
      description: "अपनी छत की सतह की स्पष्ट तस्वीर अपलोड करें।",
      classifying: "वर्गीकरण कर रहे हैं…",
      classify: "वर्गीकृत करें",
      prediction: "पूर्वानुमान",
      runoffCoefficient: "अपवाह गुणांक", 
      confidence: "विश्वास",
      tip: "सुझाव: सुनिश्चित करें कि आपका बैकएंड URL सही है और CORS उचित रूप से कॉन्फ़िगर किया गया है।"
    },
    step3: {
      title: "चरण 3: वर्षा",
      description: "अपना राज्य और जिला चुनें। हम भूकोडिंग करेंगे और क्षेत्र के लिए वर्षा डेटा प्राप्त करेंगे।",
      states: "राज्य",
      districts: "जिले",
      districtsIn: "{state} में जिले",
      selectState: "जिले देखने के लिए एक राज्य चुनें",
      searchState: "राज्य खोजें...",
      searchDistrict: "जिला खोजें...",
      selectStateFirst: "पहले एक राज्य चुनें",
      selectDistrict: "एक जिला चुनें",
      noStatesMatch: "कोई राज्य मेल नहीं खाता।",
      noDistrictsMatch: "कोई जिला मेल नहीं खाता।",
      fetchRainfall: "वर्षा डेटा प्राप्त करें",
      fetching: "प्राप्त कर रहे हैं…",
      yearlyRain: "वार्षिक वर्षा",
      avgTemp: "औसत तापमान",
      source: "स्रोत",
      monthly: "मासिक (कच्चा)",
      locationError: "स्थान का समाधान नहीं हो सका। कृपया अपना चयन परिष्कृत करें।",
      geocodingError: "भूकोडिंग असफल। अपने नेटवर्क/API key की जांच करें।",
      noRainfallData: "इस स्थान के लिए कोई वर्षा डेटा उपलब्ध नहीं है।",
      fetchError: "वर्षा डेटा प्राप्त करने में असफल।"
    },
    step4: {
      title: "चरण 4: मिट्टी और जलभृत", 
      description: "आपका स्थान स्वतः-खोजा गया है। आवश्यकतानुसार समायोजित करें और विश्लेषण करें।",
      latitude: "अक्षांश",
      longitude: "देशांतर",
      useMyLocation: "मेरा स्थान उपयोग करें",
      analyze: "विश्लेषण करें",
      analyzing: "विश्लेषण कर रहे हैं...",
      soilType: "मिट्टी का प्रकार",
      aquiferType: "जलभृत का प्रकार", 
      rechargeEfficiency: "पुनर्भरण दक्षता",
      pitVolume: "गड्ढे का आयतन (m³)",
      geolocationNotSupported: "भूस्थान समर्थित नहीं है।",
      locationError: "आपका स्थान प्राप्त करने में असमर्थ। कृपया अनुमतियों की जांच करें।",
      provideCoordsError: "कृपया अक्षांश और देशांतर प्रदान करें।",
      analyzeError: "मिट्टी का विश्लेषण करने में असफल"
    },
    step5: {
      title: "चरण 5: व्यवहार्यता",
      description: "वार्षिक उत्पादन और बचत का अनुमान लगाने के लिए इनपुट समायोजित करें।",
      dwellers: "निवासी",
      litersPerPersonPerDay: "प्रति व्यक्ति प्रति दिन लीटर",
      areaSqm: "क्षेत्रफल वर्ग मीटर", 
      yearlyRainMm: "वार्षिक वर्षा मिमी",
      runoffCoefficient: "अपवाह गुणांक",
      auto: "स्वतः",
      compute: "गणना करें",
      yearlyNeed: "वार्षिक आवश्यकता",
      potentialYield: "संभावित उत्पादन",
      savings: "बचत",
      feasible: "व्यवहार्य",
      yes: "हां",
      no: "नहीं"
    },
    step6: {
      title: "चरण 6: रिपोर्ट",
      description: "मिट्टी और जलभृत, वर्षा, सामग्री, अपवाह गुणांक, और क्षेत्र के आधार पर रिपोर्ट उत्पन्न करें।",
      area: "क्षेत्र (m²)",
      yearlyRain: "वार्षिक वर्षा (mm)",
      runoffCoefficient: "अपवाह गुणांक", 
      material: "सामग्री",
      coordinates: "निर्देशांक",
      soilAquifer: "मिट्टी और जलभृत",
      soil: "मिट्टी",
      aquifer: "जलभृत",
      rechargeEfficiency: "पुनर्भरण दक्षता",
      feasibilityOverview: "व्यवहार्यता अवलोकन",
      chartNote: "रिपोर्ट उत्पन्न करने के बाद चार्ट भरा जाएगा (हम आवश्यकतानुसार व्यवहार्यता की गणना करते हैं)।",
      language: "भाषा (जैसे, en, hi)",
      generateReport: "रिपोर्ट उत्पन्न करें", 
      downloadPdf: "PDF डाउनलोड करें",
      noReportText: "बैकएंड द्वारा कोई रिपोर्ट टेक्स्ट वापस नहीं किया गया।",
      reportError: "रिपोर्ट उत्पन्न करने में त्रुटि। कृपया बैकएंड लॉग्स की जांच करें।"
    }
  },

  // Common
  common: {
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    remove: "हटाएं",
    back: "वापस",
    next: "अगला",
    finish: "समाप्त",
    na: "उपलब्ध नहीं"
  }
};