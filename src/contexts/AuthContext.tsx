
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  faceRegistered: boolean;
  voiceRegistered: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  registerFace: () => Promise<void>;
  registerVoice: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for stored user on load
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'demo1234') {
        const newUser: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          faceRegistered: true,
          voiceRegistered: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back to AuthoSense.',
          duration: 3000,
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Try demo@example.com / demo1234',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const registerUser = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        faceRegistered: false,
        voiceRegistered: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Now let\'s setup biometric authentication.',
        duration: 3000,
      });
      
      navigate('/setup-biometrics');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast({
      title: 'Logged Out',
      description: 'You have successfully logged out.',
      duration: 3000,
    });
    navigate('/');
  };
  
  const registerFace = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user) {
        const updatedUser = {
          ...user,
          faceRegistered: true
        };
        
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Face Registration Complete',
          description: 'Your face has been registered for authentication.',
          duration: 3000,
        });
        
        return Promise.resolve();
      }
    } catch (error) {
      console.error('Face registration error:', error);
      toast({
        title: 'Registration Error',
        description: 'Failed to register face. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const registerVoice = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user) {
        const updatedUser = {
          ...user,
          voiceRegistered: true
        };
        
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
        toast({
          title: 'Voice Registration Complete',
          description: 'Your voice has been registered for authentication.',
          duration: 3000,
        });
        
        return Promise.resolve();
      }
    } catch (error) {
      console.error('Voice registration error:', error);
      toast({
        title: 'Registration Error',
        description: 'Failed to register voice. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      registerUser,
      logout,
      registerFace,
      registerVoice
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
