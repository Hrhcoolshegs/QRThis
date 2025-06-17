
-- Create the qrthis_notifications table for notification signups
CREATE TABLE public.qrthis_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone_number TEXT,
  name TEXT,
  feature_requested TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.qrthis_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert notifications (public feature)
CREATE POLICY "Anyone can create notifications" 
  ON public.qrthis_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading notifications (for admin purposes)
CREATE POLICY "Anyone can view notifications" 
  ON public.qrthis_notifications 
  FOR SELECT 
  USING (true);

-- Add function to handle duplicate notifications
CREATE OR REPLACE FUNCTION check_duplicate_notification()
RETURNS trigger AS $$
BEGIN
  -- Check if there's a recent notification for the same email and feature
  IF EXISTS (
    SELECT 1 FROM public.qrthis_notifications 
    WHERE email = NEW.email 
    AND feature_requested = NEW.feature_requested 
    AND created_at > (now() - interval '24 hours')
  ) THEN
    RAISE EXCEPTION 'Duplicate notification request';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for duplicates
CREATE TRIGGER check_duplicate_notification_trigger
  BEFORE INSERT ON public.qrthis_notifications
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_notification();
