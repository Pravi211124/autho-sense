
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface VoiceAuthProps {
  mode: 'register' | 'verify' | 'continuous';
  onComplete?: (success: boolean) => void;
  className?: string;
}

export const VoiceAuth = ({ mode, onComplete, className }: VoiceAuthProps) => {
  const [step, setStep] = useState(1);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verified, setVerified] = useState(false);
  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(5));
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulates audio visualizer
    if (recording) {
      const interval = setInterval(() => {
        setVisualizerValues(prev => 
          prev.map(() => Math.max(5, Math.floor(Math.random() * 50)))
        );
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setVisualizerValues(Array(20).fill(5));
    }
  }, [recording]);
  
  useEffect(() => {
    // Simulate progress
    if (recording && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => {
          const increment = Math.random() * 10 + 5;
          const newProgress = Math.min(prev + increment, 100);
          
          if (newProgress === 100) {
            setTimeout(() => {
              setRecording(false);
              if (mode === 'continuous') {
                setVerified(true);
                toast({
                  title: "Voice Verified",
                  description: "Your voice signature matches our records.",
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
  }, [recording, progress, mode, onComplete, toast]);
  
  const handleStartRecording = () => {
    setRecording(true);
    setProgress(0);
    
    toast({
      title: mode === 'register' ? "Recording Voice" : "Verifying Voice",
      description: "Please speak the phrase displayed below.",
      duration: 3000,
    });
  };
  
  const handleComplete = () => {
    toast({
      title: mode === 'register' ? "Registration Complete" : "Authentication Successful",
      description: mode === 'register' 
        ? "Your voice has been registered successfully." 
        : "Your voice has been verified.",
      duration: 3000,
    });
    
    if (onComplete) onComplete(true);
  };
  
  const getPassphrase = () => {
    const phrases = [
      "My voice is my passport, verify me.",
      "The quick brown fox jumps over the lazy dog.",
      "Authentication is more secure with my voice.",
      "Today is a beautiful day for voice verification."
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  };
  
  return (
    <Card className={`w-full max-w-md overflow-hidden ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-center">
          {mode === 'register' 
            ? 'Voice Registration' 
            : mode === 'verify' 
              ? 'Voice Verification'
              : 'Continuous Voice Auth'
          }
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'register' 
            ? 'Register your voice for secure authentication' 
            : mode === 'verify' 
              ? 'Verify your identity using voice recognition'
              : 'Your voice is being continuously authenticated'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {mode === 'continuous' ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full h-32 bg-muted rounded-lg overflow-hidden flex items-end justify-center p-4">
              {visualizerValues.map((value, i) => (
                <div 
                  key={i}
                  className="w-2 mx-1 bg-primary rounded-t-md transition-all duration-100"
                  style={{ 
                    height: `${value}%`,
                    opacity: recording ? 1 : 0.5
                  }}
                ></div>
              ))}
            </div>
            
            <div className="w-full p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Please repeat this phrase:</p>
              <p className="font-medium">{getPassphrase()}</p>
            </div>
            
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Authentication Status</span>
                <span className="font-medium text-green-500">{verified ? 'Verified' : 'Checking...'}</span>
              </div>
              <Progress value={verified ? 100 : progress} className="h-2" />
            </div>
            
            <Button
              variant={recording ? "outline" : "default"}
              onClick={() => recording ? setRecording(false) : handleStartRecording()}
              className={`w-full ${recording ? "border-red-500 text-red-500 hover:bg-red-50" : ""}`}
            >
              {recording ? "Stop Recording" : "Start Speaking"}
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full h-32 bg-muted rounded-lg overflow-hidden flex items-end justify-center p-4">
                  {visualizerValues.map((value, i) => (
                    <div 
                      key={i}
                      className="w-2 mx-1 bg-primary rounded-t-md transition-all duration-100"
                      style={{ 
                        height: `${value}%`,
                        opacity: recording ? 1 : 0.5
                      }}
                    ></div>
                  ))}
                </div>
                
                <div className="w-full p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Please repeat this phrase:</p>
                  <p className="font-medium">{getPassphrase()}</p>
                </div>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <Button
                  variant={recording ? "outline" : "default"}
                  onClick={() => recording ? setRecording(false) : handleStartRecording()}
                  className={`w-full ${recording ? "border-red-500 text-red-500 hover:bg-red-50" : ""}`}
                >
                  {recording ? "Stop Recording" : (mode === 'register' ? "Start Registration" : "Start Verification")}
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
                      ? 'Your voice has been registered successfully.' 
                      : 'Your voice has been verified.'
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

export default VoiceAuth;
