
import React from 'react';
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface SecurityLevelProps {
  value: number;
  maxValue?: number;
  showIndicator?: boolean;
  className?: string;
}

const getSecurityLevelColor = (value: number, maxValue: number = 100): string => {
  const percentage = (value / maxValue) * 100;
  
  if (percentage < 40) {
    return "bg-destructive"; // Low security - red
  } else if (percentage < 70) {
    return "bg-yellow-500"; // Medium security - yellow
  } else {
    return "bg-green-500"; // High security - green
  }
};

const getSecurityLevelText = (value: number, maxValue: number = 100): { label: string; description: string; icon: React.ReactNode } => {
  const percentage = (value / maxValue) * 100;
  
  if (percentage < 40) {
    return {
      label: "Low Security",
      description: "Your account security is weak. Add more authentication factors.",
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />
    };
  } else if (percentage < 70) {
    return {
      label: "Medium Security",
      description: "Your account has basic protection. Consider enhancing your security.",
      icon: <Shield className="h-6 w-6 text-yellow-500" />
    };
  } else {
    return {
      label: "High Security",
      description: "Your account is well protected with multiple authentication factors.",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />
    };
  }
};

export const SecurityLevelIndicator: React.FC<SecurityLevelProps> = ({ 
  value, 
  maxValue = 100,
  showIndicator = true,
  className = ""
}) => {
  const percentage = Math.round((value / maxValue) * 100);
  const progressColor = getSecurityLevelColor(value, maxValue);
  const { label, description, icon } = getSecurityLevelText(value, maxValue);
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {showIndicator && icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-2" />
      
      {showIndicator && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export const SecurityLevelCard: React.FC<SecurityLevelProps> = ({
  value,
  maxValue = 100,
  className = ""
}) => {
  const { label, description, icon } = getSecurityLevelText(value, maxValue);
  const percentage = Math.round((value / maxValue) * 100);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Security Level</CardTitle>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{label}</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <CardDescription>{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityLevelIndicator;
