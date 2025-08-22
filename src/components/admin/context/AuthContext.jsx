import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('adminUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/admin/login', {
        username,
        password
      });
      
      if (response.data.success) {
        const userData = { 
          username: response.data.user.username, 
          hotelId: response.data.user.hotelId,
          role: response.data.user.role || 'admin'
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        toast.success(`Welcome back! Hotel ID: ${response.data.user.hotelId}`);
        return true;
      }
      toast.error('Invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/admin/register', {
        username,
        password
      });
      
      if (response.data.success) {
        toast.success(`Registration successful! Your Hotel ID: ${response.data.hotelId}`);
        
       
        return {
          success: true,
          username: response.data.username,
          hotelId: response.data.hotelId,
          message: response.data.message
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
  };

 
  const validateSession = async () => {
    if (!user) return false;
    
    try {
      const response = await axios.get('http://localhost:4000/api/validate-hotel', {
        params: {
          username: user.username,
          hotelId: user.hotelId
        }
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Session validation error:', error);
     
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      validateSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};