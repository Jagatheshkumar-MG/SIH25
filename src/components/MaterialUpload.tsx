import { uploadMaterialImage } from "../lib/api";
import { useMemo, useState } from "react";
import StepNav from "./ui/StepNav";
import { useAppData } from "../context/AppDataContext";

export default function MaterialUpload() {
  const [file, setFile] = useState(null);
  const appData = useAppData();
  const { setRunoffCoefficient } = appData;
  const useAppDataRef = appData;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const submit = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const data = await uploadMaterialImage(file);

      if (data && typeof data === "object") {
        setResult(data);
        if (typeof data.runoff_coefficient !== 'undefined' && data.runoff_coefficient !== null) {
          try { setRunoffCoefficient(Number(data.runoff_coefficient)); } catch {}
        }
        if (data.label) {
          try { useAppDataRef?.setMaterialLabel?.(String(data.label)); } catch {}
        }
      } else {
        setErrorMsg("Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to get a response from the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Rooftop Material Classification</h1>
          <p className="text-gray-600">Step 2: Upload a clear photo of your rooftop surface</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">📷</span>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Click to upload rooftop image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>

            {previewUrl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Image Preview</h3>
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            disabled={!file || loading}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
            onClick={submit}
          >
            {loading ? "Classifying…" : "Classify Material"}
          </button>
        </div>

        {result && !errorMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Classification Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {result.label && (
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Material Type</div>
                  <div className="text-lg font-semibold text-gray-800">{String(result.label)}</div>
                </div>
              )}
              {typeof result.runoff_coefficient !== "undefined" && (
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Runoff Coefficient</div>
                  <div className="text-lg font-semibold text-gray-800">{String(result.runoff_coefficient)}</div>
                </div>
              )}
              {typeof result.confidence !== "undefined" && (
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {String((Number(result.confidence) * 100).toFixed(2))}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{errorMsg}</p>
          </div>
        )}

        <div className="mt-8">
          <StepNav />
        </div>
      </div>
    </div>
  );
}