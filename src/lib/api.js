// frontend/src/lib/api.js
const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"; // from .env

// Rooftop area
export async function getRooftopArea(corners) {
  try {
    const res = await fetch(`${SERVER_URL}/calculate-area`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ corners }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error fetching rooftop area:", err);
    return null;
  }
}

// Material upload
export async function uploadMaterialImage(file) {
  try {
    if (!SERVER_URL) {
      throw new Error(
        "VITE_BACKEND_URL is not set. Create a .env with VITE_BACKEND_URL."
      );
    }
    const form = new FormData();
    // Append with common field names to match various backends
    form.append("image", file, file?.name || "upload.jpg");
    form.append("file", file, file?.name || "upload.jpg");

    const credentials =
      import.meta.env.VITE_BACKEND_CREDENTIALS === "true"
        ? "include"
        : "same-origin";

    const res = await fetch(`${SERVER_URL}/classify-material`, {
      method: "POST",
      body: form,
      // Do not set Content-Type when sending FormData; the browser sets the boundary
      headers: { Accept: "application/json, text/plain, */*" },
      credentials,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        typeof payload === "string"
          ? payload
          : payload?.error || JSON.stringify(payload);
      throw new Error(`Upload failed (${res.status}): ${message}`);
    }

    // If backend returns string, wrap it
    if (typeof payload === "string") return { raw: payload };
    return payload;
  } catch (err) {
    console.error("Error uploading material image:", err);
    return { error: err.message };
  }
}

export async function uploadMaterialImageGemini(file) {
  try {
    const form = new FormData();
    form.append("image", file, file?.name || "upload.jpg");
    const res = await fetch(`${SERVER_URL}/classify-material-gemini`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json, text/plain, */*" },
    });
    return await res.json();
  } catch (err) {
    console.error("Error uploading material to Gemini:", err);
    return { error: err.message };
  }
}

// Rainfall info
export async function getRainfall(lat, lng) {
  try {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    const url = `${SERVER_URL}/rainfall?${params.toString()}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("Error fetching rainfall:", err);
    return null;
  }
}

// Soil analysis
export async function analyzeSoil(lat, lng) {
  try {
    const url = `${SERVER_URL}/soil-analysis`;
    const payload = { lat, lng };
    console.log("Soil API call:", { url, payload });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Soil API response status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log("Soil API error response:", errText);
      throw new Error(`Soil analysis failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    console.log("Soil API success response:", data);
    return data;
  } catch (err) {
    console.error("Error analyzing soil:", err);
    throw err;
  }
}

// Water feasibility
export async function calculateWaterFeasibility(inputs) {
  try {
    const res = await fetch(`${SERVER_URL}/water-usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    return await res.json();
  } catch (err) {
    console.error("Error calculating water feasibility:", err);
    return null;
  }
}

// Report generation
export async function generateReport(payload, language) {
  try {
    const res = await fetch(`${SERVER_URL}/report-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, language }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error generating report:", err);
    return null;
  }
}

export async function getWeather(lat, lng) {
  try {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    const url = `${SERVER_URL}/weather?${params.toString()}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("Error fetching weather:", err);
    return null;
  }
}

export async function getImprovementSuggestions(payload, language = "en") {
  try {
    const res = await fetch(`${SERVER_URL}/improvement-suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, language }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error getting improvement suggestions:", err);
    return null;
  }
}
