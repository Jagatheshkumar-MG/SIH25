import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d5598] to-[#189886] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M8%2012C9.10457%2012%2010%2011.1046%2010%2010C10%208.89543%208.89543%208%208%208C7.10457%208%206%208.89543%206%2010C6%2011.1046%206.89543%2012%208%2012Z%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] animate-[water-flow_45s_linear_infinite]"></div>

      <div className="w-full max-w-md text-center text-white bg-white/15 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10">
        <div className="mb-8">
          <img 
            src="/logo.png" 
            alt="Rainwater Harvesting Logo" 
            className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-4">Rainwater Harvesting</h1>
          <p className="text-gray-200 text-lg">
            Discover your water conservation potential
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
          >
            Sign In
          </button>
          
          <button
            onClick={() => navigate("/auth/signup")}
            className="w-full bg-white text-[#2d5598] hover:bg-gray-100 font-semibold py-3 px-6 rounded-full transition-all duration-200"
          >
            Create Account
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-300">
          Join thousands of users making a difference in water conservation
        </div>
      </div>
    </div>
  );
}