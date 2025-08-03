import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }
    register(username, password);
    toast.success("Account created!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen flex items-center justify-center bg-opacity-90 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <img
              src="/food-logo.png"
              alt="Flavaro Logo"
              className="mx-auto w-24 h-24 rounded-full"
            />
            <h2 className="text-3xl font-bold text-orange-700 mt-4">Create Your Flavaro Account</h2>
            <p className="text-sm text-orange-600 mt-1">
              Register now to start enjoying your favorite meals 🥗🍜
            </p>
          </div>

          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full py-3 mt-2 rounded-full text-white font-semibold text-md bg-orange-500 hover:bg-orange-600 shadow-lg"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-orange-600 hover:underline mx-2">
              Sign in
            </a>
          </p>

          <p className="text-center text-xs text-white mt-6">
            © 2025 Flavaro Foods. Freshly coded with 💻🍽️
          </p>
        </div>
      </div>
    </div>
  );
}
