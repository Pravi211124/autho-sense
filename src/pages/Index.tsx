
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Shield, Fingerprint, Video, Mic, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleDemoClick = () => {
    toast({
      title: "Demo Mode",
      description: "Entering demo experience with sample data.",
      duration: 3000,
    });
    // In a real app, this would load demo data
    setTimeout(() => navigate('/register'), 1000);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };
  
  const features = [
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Face Recognition",
      description: "Authenticate users with advanced facial recognition that works even in variable lighting conditions."
    },
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "Voice Biometrics",
      description: "Verify identity through voice patterns that are as unique as fingerprints."
    },
    {
      icon: <Fingerprint className="h-8 w-8 text-primary" />,
      title: "Continuous Authentication",
      description: "Maintain security with periodic checks rather than one-time logins."
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Multi-factor Security",
      description: "Combine multiple verification methods for enhanced security."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Privacy Focused",
      description: "All biometric data is encrypted and stored securely on your device."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Frictionless Experience",
      description: "Security that doesn't get in the way of productivity."
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-bl-[100px] transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-tr-[100px] transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="container relative z-10 px-4 mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Next Generation Security
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl"
            >
              Continuous Authentication with{' '}
              <span className="text-primary">Face and Voice</span> Recognition
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
            >
              Move beyond passwords with a sophisticated system that continuously verifies identity through biometric markers, creating a seamless yet secure user experience.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                onClick={() => navigate('/register')}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleDemoClick}
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/5 px-8 rounded-full"
              >
                Try Demo
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 md:mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">AuthoSense</h3>
                          <p className="text-white/70 text-sm">Continuous Authentication</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <div className="text-white/70 text-xs">Secure</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white text-sm">Face Authentication</div>
                        <div className="text-green-400 text-sm">Verified</div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-white text-sm">Voice Authentication</div>
                        <div className="text-green-400 text-sm">Verified</div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-white/70 text-sm">Last verified: Just now</div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full text-xs px-3">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Animated elements in the background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-4/5 h-10 bg-black/20 blur-xl rounded-full"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Authentication Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system combines multiple biometric factors to create a security solution that's both highly secure and easy to use.
            </p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={item}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover-translate"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full transform translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your authentication system?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of organizations that have already moved beyond passwords to a more secure and user-friendly authentication experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary text-primary hover:bg-primary/5 px-8 rounded-full"
                  onClick={() => window.open('#', '_blank')}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AuthoSense</h3>
              <p className="text-muted-foreground mb-4">
                Next generation authentication for a passwordless future.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Face Authentication</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Voice Authentication</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Continuous Monitoring</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Enterprise Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AuthoSense. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </div>
  );
};

export default Index;
