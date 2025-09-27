import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db, testFirestoreWrite } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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

export default function SignUpPage() {
  const [step, setStep] = useState(1);
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testFirestore = async () => {
    setTestResult('Testing...');
    const success = await testFirestoreWrite();
    setTestResult(success ? '✅ Firestore connection works!' : '❌ Firestore connection failed');
  };
  const navigate = useNavigate();

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting user registration...');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      // Prepare user data for Firestore
      const { email, password, ...userProfileData } = formData;
      const userData = {
        ...userProfileData,
        email: formData.email, // Keep email in Firestore
        registeredAt: new Date(),
        uid: user.uid
      };
      
      console.log('Saving user data to Firestore:', userData);
      
      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), userData);
      console.log('User data saved to Firestore successfully');

      navigate("/dashboard");
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d5598] to-[#189886] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M8%2012C9.10457%2012%2010%2011.1046%2010%2010C10%208.89543%208.89543%208%208%208C7.10457%208%206%208.89543%206%2010C6%2011.1046%206.89543%2012%208%2012Z%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] animate-[water-flow_45s_linear_infinite]"></div>

      <div className="w-full max-w-lg text-center text-white bg-white/15 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10">
        <div className="mb-6">
          <img 
            src="/logo.png" 
            alt="App Logo" 
            className="w-16 h-16 mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-200">Step {step} of 2</p>
          
          {/* Debug: Test Firestore Connection */}
          <div className="mt-4 p-3 bg-black/20 rounded-lg">
            <button
              onClick={testFirestore}
              className="text-xs bg-white/20 px-3 py-1 rounded text-white hover:bg-white/30"
            >
              Test Firestore
            </button>
            {testResult && <div className="text-xs mt-2 text-yellow-200">{testResult}</div>}
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <input
              id="name"
              type="text"
              placeholder="Full Name *"
              onChange={handleFormChange}
              value={formData.name}
              required
              className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
            />
            <input
              id="email"
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 bg-white/20 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-gray-300"
            />
            <input
              id="password"
              type="password"
              placeholder="Password *"
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
              onClick={handleNext}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/30"
            >
              Next
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
              <option value="" className="text-gray-500 bg-gray-800">Select Gender</option>
              <option value="male" className="bg-gray-800">Male</option>
              <option value="female" className="bg-gray-800">Female</option>
              <option value="other" className="bg-gray-800">Other</option>
            </select>
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
            
            {error && (
              <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <p className="text-gray-200">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-white font-semibold hover:underline focus:outline-none"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}