/**
 * Password Validation Utility
 * 
 * Validates password strength according to security policy:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (@$!%*?&#)
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'medium' | 'strong';
  strengthPercentage: number;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length check (minimum 8)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2; // Bonus for 12+ characters
  } else {
    score += 1;
  }

  // Uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Lowercase letter
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Number
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one number');
  }

  // Special character
  if (/[@$!%*?&#]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one special character (@$!%*?&#)');
  }

  // Calculate strength
  const maxScore = 6;
  const percentage = (score / maxScore) * 100;

  let strength: 'weak' | 'fair' | 'medium' | 'strong' = 'weak';
  if (percentage >= 80) strength = 'strong';
  else if (percentage >= 60) strength = 'medium';
  else if (percentage >= 40) strength = 'fair';

  return {
    valid: errors.length === 0,
    errors,
    strength,
    strengthPercentage: percentage,
  };
}

/**
 * Get password requirements as a checklist
 */
export function getPasswordRequirements(): Array<{
  id: string;
  label: string;
  regex: RegExp;
}> {
  return [
    {
      id: 'length',
      label: 'At least 8 characters',
      regex: /.{8,}/,
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter (A-Z)',
      regex: /[A-Z]/,
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter (a-z)',
      regex: /[a-z]/,
    },
    {
      id: 'number',
      label: 'One number (0-9)',
      regex: /[0-9]/,
    },
    {
      id: 'special',
      label: 'One special character (@$!%*?&#)',
      regex: /[@$!%*?&#]/,
    },
  ];
}

/**
 * Calculate password strength score (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  const result = validatePassword(password);
  return result.strengthPercentage;
}
