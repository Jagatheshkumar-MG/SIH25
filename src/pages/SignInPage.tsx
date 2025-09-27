import { useState, ChangeEvent, FormEvent } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d5598] to-[#189886] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M8%2012C9.10457%2012%2010%2011.1046%2010%2010C10%208.89543%208.89543%208%208%208C7.10457%208%206%208.89543%206%2010C6%2011.1046%206.89543%2012%208%2012Z%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] animate-[water-flow_45s_linear_infinite]"></div>

      <div className="w-full max-w-md text-center text-white bg-white/15 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10">
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="App Logo" 
            className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-200">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleFormChange}
            required
            className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
          />
          
          {error && (
            <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-gray-200">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/auth/signup")}
              className="text-white font-semibold hover:underline focus:outline-none"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}