
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface SecurityLevelProps {
  className?: string;
}

export const SecurityLevel = ({ className }: SecurityLevelProps) => {
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [faceEnabled, setFaceEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [behaviometricEnabled, setBehaviometricEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('status');
  const { toast } = useToast();
  
  // Simulated security score based on enabled factors
  const calculateSecurityScore = () => {
    let score = 0;
    if (faceEnabled) score += 25;
    if (voiceEnabled) score += 25;
    if (locationEnabled) score += 20;
    if (behaviometricEnabled) score += 20;
    
    // Additional score for security level
    if (securityLevel === 'high') score += 10;
    if (securityLevel === 'medium') score = Math.min(90, score + 5);
    
    return score;
  };
  
  const [securityScore, setSecurityScore] = useState(calculateSecurityScore());
  
  useEffect(() => {
    setSecurityScore(calculateSecurityScore());
  }, [faceEnabled, voiceEnabled, locationEnabled, behaviometricEnabled, securityLevel]);
  
  const handleChangeSecurity = (level: 'low' | 'medium' | 'high') => {
    setSecurityLevel(level);
    toast({
      title: "Security Level Updated",
      description: `Security level set to ${level.toUpperCase()}.`,
      duration: 3000,
    });
  };
  
  const toggleFactor = (factor: string) => {
    switch (factor) {
      case 'face':
        setFaceEnabled(prev => !prev);
        toast({
          title: `Face Authentication ${faceEnabled ? 'Disabled' : 'Enabled'}`,
          description: faceEnabled 
            ? "Face authentication has been disabled." 
            : "Face authentication has been enabled.",
          duration: 3000,
        });
        break;
      case 'voice':
        setVoiceEnabled(prev => !prev);
        toast({
          title: `Voice Authentication ${voiceEnabled ? 'Disabled' : 'Enabled'}`,
          description: voiceEnabled 
            ? "Voice authentication has been disabled." 
            : "Voice authentication has been enabled.",
          duration: 3000,
        });
        break;
      case 'location':
        setLocationEnabled(prev => !prev);
        toast({
          title: `Location Verification ${locationEnabled ? 'Disabled' : 'Enabled'}`,
          description: locationEnabled 
            ? "Location verification has been disabled." 
            : "Location verification has been enabled.",
          duration: 3000,
        });
        break;
      case 'behaviometric':
        setBehaviometricEnabled(prev => !prev);
        toast({
          title: `Behaviometric Analysis ${behaviometricEnabled ? 'Disabled' : 'Enabled'}`,
          description: behaviometricEnabled 
            ? "Behaviometric analysis has been disabled." 
            : "Behaviometric analysis has been enabled.",
          duration: 3000,
        });
        break;
      default:
        break;
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/30 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold">Security Status</CardTitle>
            <CardDescription>Continuous authentication settings</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`
              px-3 py-1 font-medium
              ${securityScore > 80 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : securityScore > 50 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                  : 'bg-red-100 text-red-800 border-red-200'
              }
            `}
          >
            {securityScore > 80 
              ? 'Secure' 
              : securityScore > 50 
                ? 'Moderate' 
                : 'Vulnerable'
            }
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="status" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="status" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Security</span>
                    <span className={`font-medium ${
                      securityScore > 80 
                        ? 'text-green-500' 
                        : securityScore > 50 
                          ? 'text-yellow-500' 
                          : 'text-red-500'
                    }`}>
                      {securityScore}%
                    </span>
                  </div>
                  <Progress 
                    value={securityScore} 
                    className="h-3 rounded-md" 
                    indicatorClassName={`rounded-md ${
                      securityScore > 80 
                        ? 'bg-green-500' 
                        : securityScore > 50 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Face Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${faceEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {faceEnabled ? 'Active' : 'Inactive'}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${faceEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Voice Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${voiceEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {voiceEnabled ? 'Active' : 'Inactive'}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${voiceEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Location Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${locationEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {locationEnabled ? 'Active' : 'Inactive'}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${locationEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Behaviometric Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${behaviometricEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {behaviometricEnabled ? 'Active' : 'Inactive'}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${behaviometricEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="text-primary" onClick={() => setActiveTab('settings')}>
                    Change Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Security Level</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={securityLevel === 'low' ? 'default' : 'outline'}
                      className={`h-auto py-2 ${securityLevel === 'low' ? 'bg-primary' : ''}`}
                      onClick={() => handleChangeSecurity('low')}
                    >
                      Low
                    </Button>
                    <Button 
                      variant={securityLevel === 'medium' ? 'default' : 'outline'}
                      className={`h-auto py-2 ${securityLevel === 'medium' ? 'bg-primary' : ''}`}
                      onClick={() => handleChangeSecurity('medium')}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant={securityLevel === 'high' ? 'default' : 'outline'}
                      className={`h-auto py-2 ${securityLevel === 'high' ? 'bg-primary' : ''}`}
                      onClick={() => handleChangeSecurity('high')}
                    >
                      High
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Authentication Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Face Authentication</p>
                        <p className="text-xs text-muted-foreground">Use facial recognition for verification</p>
                      </div>
                      <Button 
                        variant={faceEnabled ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => toggleFactor('face')}
                        className={faceEnabled ? "bg-primary" : ""}
                      >
                        {faceEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Voice Authentication</p>
                        <p className="text-xs text-muted-foreground">Use voice recognition for verification</p>
                      </div>
                      <Button 
                        variant={voiceEnabled ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => toggleFactor('voice')}
                        className={voiceEnabled ? "bg-primary" : ""}
                      >
                        {voiceEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Location Verification</p>
                        <p className="text-xs text-muted-foreground">Check device location during authentication</p>
                      </div>
                      <Button 
                        variant={locationEnabled ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => toggleFactor('location')}
                        className={locationEnabled ? "bg-primary" : ""}
                      >
                        {locationEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Behaviometric Analysis</p>
                        <p className="text-xs text-muted-foreground">Track behavior patterns for verification</p>
                      </div>
                      <Button 
                        variant={behaviometricEnabled ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => toggleFactor('behaviometric')}
                        className={behaviometricEnabled ? "bg-primary" : ""}
                      >
                        {behaviometricEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="text-primary" onClick={() => setActiveTab('status')}>
                    View Status
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecurityLevel;
