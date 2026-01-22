
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Upload, X } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    hotelname: "",
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (
      !formData.hotelname ||
      !formData.name ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);
    
    // Send registration data with image
    const success = await register(
      formData.name,
      formData.mobile,
      formData.password,
      formData.hotelname,
      selectedImage
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
          <div className="w-full flex flex-row gap-2">
            <div className="w-1/2">
              <input
                name="hotelname"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
                placeholder="Hotel Name"
                value={formData.hotelname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center block cursor-pointer hover:border-orange-500 transition-colors w-full h-full"
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <span className="text-xs text-gray-500">
                    Hotel Logo (optional)
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="mobile"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
              placeholder="Confirm Password"
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
