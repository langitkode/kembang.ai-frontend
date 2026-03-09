"use client";

import { Check, X } from "lucide-react";
import { validatePassword, getPasswordRequirements } from "@/lib/password-validation";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const result = validatePassword(password);
  const requirements = getPasswordRequirements();

  const getStrengthColor = () => {
    switch (result.strength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'fair':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStrengthLabel = () => {
    if (!password) return 'Enter password';
    
    const labels = {
      strong: 'Strong',
      medium: 'Medium',
      fair: 'Fair',
      weak: 'Weak',
    };
    return labels[result.strength];
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={cn(
            "font-semibold",
            result.strength === 'strong' && "text-green-500",
            result.strength === 'medium' && "text-yellow-500",
            result.strength === 'fair' && "text-orange-500",
            result.strength === 'weak' && "text-red-500"
          )}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              getStrengthColor()
            )}
            style={{ width: `${result.strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Requirements
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {requirements.map((req) => {
              const met = req.regex.test(password);
              return (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    met ? "text-green-500" : "text-muted-foreground"
                  )}
                >
                  {met ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
