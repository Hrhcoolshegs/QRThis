
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { validateEmail, validatePhone, validateName, isRateLimited } from '@/utils/validationUtils';

interface SecureNotificationFormProps {
  feature: string;
  onSuccess: () => void;
}

export function SecureNotificationForm({ feature, onSuccess }: SecureNotificationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityCheck, setSecurityCheck] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Invalid email';
    }

    // Validate phone (optional)
    if (formData.phone.trim()) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error || 'Invalid phone number';
      }
    }

    // Validate name (optional)
    if (formData.name.trim()) {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.error || 'Invalid name';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Client-side rate limiting
    const rateLimitKey = `notification_${formData.email.toLowerCase().trim()}`;
    if (isRateLimited(rateLimitKey, 3)) {
      toast({
        title: "Rate limit exceeded",
        description: "You can only make 3 requests per day. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSecurityCheck(true);

    try {
      // Validate and sanitize inputs
      const emailValidation = validateEmail(formData.email);
      const phoneValidation = validatePhone(formData.phone);
      const nameValidation = validateName(formData.name);

      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const { error } = await supabase
        .from('qrthis_notifications')
        .insert({
          email: emailValidation.sanitized!,
          phone_number: phoneValidation.sanitized || null,
          name: nameValidation.sanitized || null,
          feature_requested: feature,
          user_agent: navigator.userAgent,
        });

      if (error) {
        if (error.message.includes('Duplicate notification request')) {
          toast({
            title: "Already Registered",
            description: "You've already requested notifications for this feature recently.",
            variant: "destructive",
          });
        } else if (error.message.includes('Rate limit exceeded')) {
          toast({
            title: "Rate limit exceeded",
            description: "You've made too many requests today. Please try again tomorrow.",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid email format')) {
          setErrors({ email: 'Please enter a valid email address' });
        } else {
          throw error;
        }
      } else {
        onSuccess();
        setFormData({ name: '', email: '', phone: '' });
        toast({
          title: "🎉 You're on the list!",
          description: "We'll notify you as soon as this feature is available!",
        });
      }
    } catch (error) {
      console.error('Secure notification signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSecurityCheck(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {securityCheck && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
          <Shield className="w-4 h-4" />
          <span>Performing security validation...</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name (Optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={isSubmitting}
          className={errors.name ? 'border-red-500' : ''}
          maxLength={100}
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={isSubmitting}
          className={errors.email ? 'border-red-500' : ''}
          maxLength={254}
          autoComplete="email"
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          disabled={isSubmitting}
          className={errors.phone ? 'border-red-500' : ''}
          maxLength={20}
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Securing your request...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Notify Me When Available
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        <Shield className="w-3 h-3 inline mr-1" />
        Your data is securely validated and protected
      </p>
    </form>
  );
}
