import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    hotelname: "",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    logoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (user) {
      // User is already logged in
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "logoUrl") {
      setImageError("");
    }
  };

  const validateImageUrl = (url) => {
    if (!url) return { valid: true }; // Logo is optional
    
    // Check if URL is valid
    try {
      new URL(url);
    } catch (error) {
      return { valid: false, message: "Please enter a valid URL" };
    }

    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().endsWith(ext)
    );
    
    if (!hasImageExtension) {
      return { 
        valid: false, 
        message: "URL should point to an image (jpg, png, gif, webp, svg)" 
      };
    }

    return { valid: true };
  };

  const handleRegister = async () => {
    // Validate all fields
    if (
      !formData.hotelname ||
      !formData.name ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // Validate image URL if provided
    if (formData.logoUrl) {
      const validation = validateImageUrl(formData.logoUrl);
      if (!validation.valid) {
        setImageError(validation.message);
        return;
      }
    }

    setIsLoading(true);
    
    // Send registration data with logo URL
    const success = await register(
      formData.name,
      formData.mobile,
      formData.password,
      formData.hotelname,
      formData.logoUrl // Pass URL instead of file
    );
    
    setIsLoading(false);

    if (success) {
      navigate("/login");
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-700">
            You are already logged in. You cannot register again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            <h2 className="text-3xl font-bold text-orange-700 mt-4">
              Create Your Flavaro Account
            </h2>
          </div>

          <div className="space-y-4">
            <input
              name="hotelname"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Hotel Name *"
              value={formData.hotelname}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-2">
              <input
                name="logoUrl"
                type="url"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
                placeholder="Hotel Logo URL (optional) - e.g., https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={handleChange}
              />
              {imageError && (
                <p className="text-red-500 text-sm">{imageError}</p>
              )}
              {formData.logoUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="w-24 h-24 object-cover rounded border mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setImageError("Could not load image from this URL");
                    }}
                    onLoad={() => setImageError("")}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Enter a direct image URL (jpg, png, gif, webp, svg). You can upload your logo to services like Imgur, Cloudinary, or any image hosting service.
              </p>
            </div>

            <input
              name="name"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="mobile"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Mobile number *"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className={`w-full py-3 mt-2 rounded-full text-white font-semibold text-md bg-orange-500 hover:bg-orange-600 shadow-lg ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating account..." : "Register"}
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