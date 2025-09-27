// src/pages/LoginPage.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Define a type for our form data for type safety
type UserFormData = {
  name: string;
  dob: string;
  gender: string;
  aadhaar: string;
  phone: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  email: string;
  password: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    dob: "",
    gender: "",
    aadhaar: "",
    phone: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    email: "",
    password: "",
  });

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let userCredential: UserCredential;
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error(
            "Full Name, Email, and Password are required for signup."
          );
        }
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Exclude auth fields before saving to Firestore
        const { email, password, ...userProfileData } = formData;

        await setDoc(doc(db, "users", user.uid), {
          ...userProfileData,
          registeredAt: new Date(),
        });
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d5598] to-[#189886] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M8%2012C9.10457%2012%2010%2011.1046%2010%2010C10%208.89543%208.89543%208%208%208C7.10457%208%206%208.89543%206%2010C6%2011.1046%206.89543%2012%208%2012Z%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] animate-[water-flow_45s_linear_infinite]"></div>

      <div
        className={`w-full ${
          mode === "signup" ? "max-w-lg" : "max-w-md"
        } text-center text-white bg-white/15 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10 transition-all duration-300`}
      >
        {mode === "login" ? (
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-200 mb-6">
              Log in to check your rainwater potential.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-gray-200 mb-6">
              Join us on the water conservation journey.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
        >
          {mode === "signup" && (
            <>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                onChange={handleFormChange}
                value={formData.name}
                required
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="dob"
                type="date"
                placeholder="Date of Birth"
                onChange={handleFormChange}
                value={formData.dob}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
                style={{ colorScheme: "dark" }}
              />
              <select
                id="gender"
                onChange={handleFormChange}
                value={formData.gender}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
              >
                <option value="" className="text-gray-500 bg-gray-800">
                  Select Gender
                </option>
                <option value="male" className="bg-gray-800">
                  Male
                </option>
                <option value="female" className="bg-gray-800">
                  Female
                </option>
                <option value="other" className="bg-gray-800">
                  Other
                </option>
              </select>
              <input
                id="aadhaar"
                type="text"
                placeholder="Aadhaar Number"
                onChange={handleFormChange}
                value={formData.aadhaar}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                onChange={handleFormChange}
                value={formData.phone}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="state"
                type="text"
                placeholder="State"
                onChange={handleFormChange}
                value={formData.state}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="district"
                type="text"
                placeholder="District"
                onChange={handleFormChange}
                value={formData.district}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="city"
                type="text"
                placeholder="City"
                onChange={handleFormChange}
                value={formData.city}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
              <input
                id="pincode"
                type="text"
                placeholder="Pincode"
                onChange={handleFormChange}
                value={formData.pincode}
                className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
              />
            </>
          )}
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
            {isLoading
              ? "Processing..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-gray-200">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-white font-semibold hover:underline focus:outline-none"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}