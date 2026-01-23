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
  const { register, user, checkExistingUser } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'existing', 'success', 'error'

  // Check for hotelId in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    if (hotelId) {
      document.title = `Register for Hotel ${hotelId}`;
    }
  }, []);

  // Check if user is already registered when component mounts
  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        setRegistrationStatus('existing');
      } else {
        // Check in localStorage first (for quick check)
        const registeredHotel = localStorage.getItem('registeredHotel');
        const registeredMobile = localStorage.getItem('registeredMobile');
        
        if (registeredHotel && registeredMobile) {
          // Optionally verify with backend
          try {
            const isRegistered = await checkExistingUser(registeredMobile);
            if (isRegistered) {
              setRegistrationStatus('existing');
            }
          } catch (error) {
            console.error("Error checking registration:", error);
          }
        }
      }
    };

    checkRegistration();
  }, [user, checkExistingUser]);

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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }
      
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

    // Check if mobile number already exists
    setIsLoading(true);
    const isExisting = await checkExistingUser(formData.mobile);
    
    if (isExisting) {
      setIsLoading(false);
      setRegistrationStatus('existing');
      
      // Store registration info in localStorage for quick check
      localStorage.setItem('registeredHotel', formData.hotelname);
      localStorage.setItem('registeredMobile', formData.mobile);
      
      alert("This mobile number is already registered. Please contact support if you need to update your information.");
      return;
    }

    const success = await register(
      formData.name,
      formData.mobile,
      formData.password,
      formData.hotelname,
      selectedImage
    );
    
    setIsLoading(false);

    if (success) {
      setRegistrationStatus('success');
      
      // Store registration info in localStorage
      localStorage.setItem('registeredHotel', formData.hotelname);
      localStorage.setItem('registeredMobile', formData.mobile);
      
      // Check if there's a hotelId in URL
      const urlParams = new URLSearchParams(window.location.search);
      const hotelId = urlParams.get('hotelId');
      
      // Wait 2 seconds then navigate
      setTimeout(() => {
        if (hotelId) {
          navigate(`/login?hotelId=${hotelId}`);
        } else {
          navigate("/login");
        }
      }, 2000);
    } else {
      setRegistrationStatus('error');
    }
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  const handleContactSupport = () => {
    // You can implement support contact logic here
    alert("Please contact support at: support@flavaro.com\nPhone: +1-234-567-8900");
  };

  // If user is already logged in or already registered
  if (user || registrationStatus === 'existing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="mb-6">
            <img
              src="/food-logo.png"
              alt="Flavaro Logo"
              className="mx-auto w-20 h-20 rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            {user ? "Already Logged In" : "Already Registered"}
          </h2>
          <p className="text-gray-700 mb-6">
            {user 
              ? "You are already logged in. You cannot register again."
              : "You have already registered with Flavaro. Your account information is stored in our database."
            }
          </p>
          <p className="text-gray-600 text-sm mb-8">
            {!user && "To make changes to your registration or delete your account, please contact our support team."}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleGoToHome}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Go to Home Page
            </button>
            
            {!user && (
              <button
                onClick={handleContactSupport}
                className="w-full px-6 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              >
                Contact Support
              </button>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Email us at support@flavaro.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success message after registration
  if (registrationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-700 mb-6">
            Your hotel <span className="font-semibold">{formData.hotelname}</span> has been registered successfully.
          </p>
          <p className="text-gray-600 text-sm mb-8">
            You will be redirected to the login page in a few seconds...
          </p>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your data is now securely stored in our database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original registration form
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
           
            <p className="text-xs text-orange-600 mt-1">
              Note: You can only register once per mobile number
            </p>
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
              {isLoading ? "Checking registration..." : "Register"}
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