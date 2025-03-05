
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  type: 'register' | 'login';
  onSubmit: (data: any) => void;
  onSwitchMode?: () => void;
  className?: string;
}

export const AuthCard = ({ type, onSubmit, onSwitchMode, className }: AuthCardProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: type === 'register' ? '' : undefined,
  });
  
  const [authMethod, setAuthMethod] = useState<'credentials' | 'face' | 'voice'>('credentials');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, method: authMethod });
  };
  
  return (
    <Card className={cn("w-full max-w-md shadow-xl border-0 overflow-hidden animate-scale-in", className)}>
      <CardHeader className="space-y-1 bg-gradient-to-r from-secondary to-background p-6">
        <CardTitle className="text-2xl font-semibold text-center">
          {type === 'register' ? 'Create an account' : 'Welcome back'}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {type === 'register' 
            ? 'Sign up to start using our continuous authentication system' 
            : 'Sign in to your account to continue'
          }
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="credentials" className="w-full" onValueChange={(value) => setAuthMethod(value as any)}>
        <TabsList className="grid grid-cols-3 w-[90%] mx-auto my-4">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="face">Face</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
        </TabsList>
        
        <CardContent className="p-6 pt-0">
          <TabsContent value="credentials">
            <form onSubmit={handleSubmit} className="space-y-4">
              {type === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={handleChange}
                    required 
                    className="focus-visible:ring-primary"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  required 
                  className="focus-visible:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {type === 'login' && (
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  required 
                  className="focus-visible:ring-primary"
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {type === 'register' ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="face" className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-64 h-64 bg-muted rounded-xl overflow-hidden mb-4 border-2 border-dashed border-muted-foreground/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground animate-pulse">Camera will appear here</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
              {type === 'register' ? 'Register Face' : 'Authenticate with Face'}
            </Button>
          </TabsContent>
          
          <TabsContent value="voice" className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-64 h-64 bg-muted rounded-xl overflow-hidden mb-4 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
            </div>
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
              {type === 'register' ? 'Register Voice' : 'Authenticate with Voice'}
            </Button>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
        <div className="text-sm text-center text-muted-foreground">
          {type === 'register' 
            ? 'Already have an account? ' 
            : 'Don\'t have an account? '
          }
          <button 
            type="button" 
            onClick={onSwitchMode} 
            className="text-primary hover:underline font-medium"
          >
            {type === 'register' ? 'Sign in' : 'Create one'}
          </button>
        </div>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <div className="flex space-x-2 w-full">
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
