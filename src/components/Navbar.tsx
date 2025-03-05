
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is on the landing page
  const isLandingPage = location.pathname === '/';
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleDemoClick = () => {
    toast({
      title: "Demo Mode Activated",
      description: "You're now experiencing the demo version of our authentication system.",
      duration: 3000,
    });
  };
  
  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled || !isLandingPage 
          ? "bg-white/80 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <span className="text-primary font-bold text-2xl">AuthoSense</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/features" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isLandingPage && (
              <Link to="/">
                <Button variant="ghost" className="hover:bg-secondary">
                  Home
                </Button>
              </Link>
            )}
            
            <Link to={isLandingPage ? "/register" : "/dashboard"}>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2 rounded-full transition-all"
              >
                {isLandingPage ? "Get Started" : "Dashboard"}
              </Button>
            </Link>
            
            {isLandingPage && (
              <Button 
                variant="outline" 
                className="hidden md:inline-flex border-primary text-primary hover:bg-primary/5 font-medium px-5 py-2 rounded-full transition-all"
                onClick={handleDemoClick}
              >
                Try Demo
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
