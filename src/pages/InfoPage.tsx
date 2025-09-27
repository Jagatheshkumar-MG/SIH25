import { useNavigate } from "react-router-dom";

export default function InfoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img 
            src="/logo.png" 
            alt="Rainwater Harvesting Logo" 
            className="w-24 h-24 mx-auto mb-6 rounded-xl shadow-lg"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Rainwater Harvesting
          </h1>
          <p className="text-xl text-gray-600">
            Sustainable Water Conservation for Your Home
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              What is Rainwater Harvesting?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Rainwater harvesting is the collection and storage of rainwater for reuse. 
              It's an eco-friendly practice that reduces dependency on groundwater and 
              helps conserve this precious natural resource.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Benefits
            </h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Reduces water bills</li>
              <li>• Conserves groundwater</li>
              <li>• Prevents soil erosion</li>
              <li>• Reduces flood risk</li>
              <li>• Provides backup water supply</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold mb-2">Collection</h3>
              <p className="text-sm text-gray-600">Rainwater is collected from rooftops</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-semibold mb-2">Filtration</h3>
              <p className="text-sm text-gray-600">Water is filtered and purified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💧</span>
              </div>
              <h3 className="font-semibold mb-2">Storage</h3>
              <p className="text-sm text-gray-600">Clean water is stored for use</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-700 mb-8">
            Ready to discover if rainwater harvesting is feasible for your home?
          </p>
          <button
            onClick={() => navigate("/area")}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 px-8 rounded-full text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg"
          >
            Check Feasibility for Your Home
          </button>
        </div>
      </div>
    </div>
  );
}