
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { validateURL, sanitizeTextInput } from '@/utils/securityUtils';

interface NotificationFormProps {
  feature: string;
  onSuccess: () => void;
}

export function NotificationForm({ feature, onSuccess }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation (optional)
    if (formData.phone.trim()) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Name validation (optional)
    if (formData.name.trim() && formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeTextInput(formData.email.trim(), 100);
      const sanitizedPhone = formData.phone.trim() ? 
        sanitizeTextInput(formData.phone.replace(/[\s-()]/g, ''), 20) : null;
      const sanitizedName = formData.name.trim() ? 
        sanitizeTextInput(formData.name.trim(), 50) : null;

      const { error } = await supabase
        .from('qrthis_notifications')
        .insert({
          email: sanitizedEmail,
          phone_number: sanitizedPhone,
          name: sanitizedName,
          feature_requested: feature,
          user_agent: navigator.userAgent,
        });

      if (error) {
        if (error.message.includes('Duplicate notification request')) {
          toast({
            title: "Already Registered",
            description: "You've already requested notifications for this feature in the last 24 hours.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        onSuccess();
        toast({
          title: "🎉 You're on the list!",
          description: "We'll notify you as soon as this feature is available!",
        });
      }
    } catch (error) {
      console.error('Notification signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          maxLength={50}
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
          maxLength={100}
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
            Signing up...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Notify Me When Available
          </>
        )}
      </Button>
    </form>
  );
}
