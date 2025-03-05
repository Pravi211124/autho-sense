
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface FaceAuthProps {
  mode: 'register' | 'verify' | 'continuous';
  onComplete?: (success: boolean) => void;
  className?: string;
}

export const FaceAuth = ({ mode, onComplete, className }: FaceAuthProps) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate progress for demo purposes
    if (active && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => {
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(prev + increment, 100);
          
          if (newProgress === 100) {
            setTimeout(() => {
              if (mode === 'continuous') {
                setVerified(true);
                toast({
                  title: "Identity Verified",
                  description: "Continuous authentication is active.",
                  duration: 3000,
                });
                if (onComplete) onComplete(true);
              } else {
                setStep(prev => prev + 1);
              }
            }, 500);
          }
          
          return newProgress;
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [active, progress, mode, onComplete, toast]);
  
  const handleStart = () => {
    setActive(true);
    setProgress(0);
    
    toast({
      title: mode === 'register' ? "Registering Face" : "Verifying Face",
      description: "Please look directly at the camera.",
      duration: 3000,
    });
  };
  
  const handleComplete = () => {
    toast({
      title: mode === 'register' ? "Registration Complete" : "Authentication Successful",
      description: mode === 'register' 
        ? "Your face has been registered successfully." 
        : "Your identity has been verified.",
      duration: 3000,
    });
    
    if (onComplete) onComplete(true);
  };
  
  return (
    <Card className={`w-full max-w-md overflow-hidden ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">
          {mode === 'register' 
            ? 'Face Registration' 
            : mode === 'verify' 
              ? 'Face Verification'
              : 'Continuous Authentication'
          }
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'register' 
            ? 'Register your face for secure authentication' 
            : mode === 'verify' 
              ? 'Verify your identity using face recognition'
              : 'Your face is being continuously authenticated'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {mode === 'continuous' ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/30">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground animate-pulse">Camera feed</span>
              </div>
              {verified && (
                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-pulse opacity-50"></div>
              )}
            </div>
            
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Authentication Status</span>
                <span className="font-medium text-green-500">{verified ? 'Verified' : 'Checking...'}</span>
              </div>
              <Progress value={verified ? 100 : progress} className="h-2" />
            </div>
            
            <Button
              variant={active ? "outline" : "default"}
              onClick={() => setActive(!active)}
              className={`w-full ${active ? "border-red-500 text-red-500 hover:bg-red-50" : ""}`}
            >
              {active ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-64 h-64 bg-muted rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {active ? (
                      <span className="text-primary font-medium animate-pulse">Processing...</span>
                    ) : (
                      <span className="text-muted-foreground">Camera will appear here</span>
                    )}
                  </div>
                  {active && (
                    <div className="absolute inset-0">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-primary/30 animate-pulse"></div>
                      <div className="absolute left-1/2 top-0 w-px h-full bg-primary/30 animate-pulse"></div>
                      <div className="absolute inset-0 border-2 border-primary/50 animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <Button
                  onClick={handleStart}
                  disabled={active}
                  className="w-full"
                >
                  {active ? "Processing..." : (mode === 'register' ? "Start Registration" : "Start Verification")}
                </Button>
              </div>
            )}
            
            {step === 2 && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-medium text-green-500">
                    {mode === 'register' ? 'Registration Successful' : 'Verification Successful'}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {mode === 'register' 
                      ? 'Your face has been registered successfully.' 
                      : 'Your identity has been verified.'
                    }
                  </p>
                </div>
                
                <Button onClick={handleComplete} className="w-full">
                  Continue
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceAuth;
