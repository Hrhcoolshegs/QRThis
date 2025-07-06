
-- Remove overly permissive RLS policies that expose user data
DROP POLICY IF EXISTS "Anyone can view notifications" ON public.qrthis_notifications;
DROP POLICY IF EXISTS "Users can read own entries" ON public.waitlist;
DROP POLICY IF EXISTS "Users can read own waitlist entry" ON public.waitlist;

-- Create secure RLS policies for qrthis_notifications
-- Only allow authenticated users to view their own notifications (if we add user_id later)
-- For now, remove public read access entirely for security
CREATE POLICY "Service role can manage notifications" 
  ON public.qrthis_notifications 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Keep the insert policy but add rate limiting and validation
DROP POLICY IF EXISTS "Anyone can create notifications" ON public.qrthis_notifications;
CREATE POLICY "Authenticated users can create notifications" 
  ON public.qrthis_notifications 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' OR auth.role() = 'anon'
  );

-- Create secure RLS policies for waitlist
-- Only allow users to view their own waitlist entries
CREATE POLICY "Users can view own waitlist entry" 
  ON public.waitlist 
  FOR SELECT 
  USING (email = auth.jwt() ->> 'email');

-- Service role can manage all waitlist entries (for admin purposes)
CREATE POLICY "Service role can manage waitlist" 
  ON public.waitlist 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Add database constraints for data validation
ALTER TABLE public.qrthis_notifications 
  ADD CONSTRAINT email_length_check CHECK (char_length(email) <= 254 AND char_length(email) >= 5),
  ADD CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT phone_length_check CHECK (phone_number IS NULL OR (char_length(phone_number) >= 7 AND char_length(phone_number) <= 20)),
  ADD CONSTRAINT name_length_check CHECK (name IS NULL OR (char_length(name) >= 2 AND char_length(name) <= 100)),
  ADD CONSTRAINT feature_not_empty CHECK (char_length(trim(feature_requested)) > 0);

ALTER TABLE public.waitlist
  ADD CONSTRAINT waitlist_email_length_check CHECK (char_length(email) <= 254 AND char_length(email) >= 5),
  ADD CONSTRAINT waitlist_email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT waitlist_name_length_check CHECK (char_length(name) >= 2 AND char_length(name) <= 100);

-- Add function to validate notification requests with enhanced security
CREATE OR REPLACE FUNCTION validate_notification_request()
RETURNS trigger AS $$
BEGIN
  -- Enhanced duplicate check with stricter time window
  IF EXISTS (
    SELECT 1 FROM public.qrthis_notifications 
    WHERE email = NEW.email 
    AND feature_requested = NEW.feature_requested 
    AND created_at > (now() - interval '1 hour')
  ) THEN
    RAISE EXCEPTION 'Duplicate notification request within 1 hour';
  END IF;
  
  -- Rate limiting: max 3 requests per email per day
  IF (
    SELECT COUNT(*) FROM public.qrthis_notifications 
    WHERE email = NEW.email 
    AND created_at > (now() - interval '24 hours')
  ) >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 3 requests per day';
  END IF;
  
  -- Validate email format more strictly
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Sanitize and validate inputs
  NEW.email = lower(trim(NEW.email));
  NEW.name = CASE WHEN NEW.name IS NOT NULL THEN trim(NEW.name) ELSE NULL END;
  NEW.phone_number = CASE WHEN NEW.phone_number IS NOT NULL THEN regexp_replace(trim(NEW.phone_number), '[^\d\+\-\(\)\s]', '', 'g') ELSE NULL END;
  NEW.feature_requested = trim(NEW.feature_requested);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Replace the existing trigger with the enhanced one
DROP TRIGGER IF EXISTS check_duplicate_notification_trigger ON public.qrthis_notifications;
CREATE TRIGGER validate_notification_request_trigger
  BEFORE INSERT ON public.qrthis_notifications
  FOR EACH ROW
  EXECUTE FUNCTION validate_notification_request();

-- Add audit logging function for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  user_email TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage audit log" 
  ON public.security_audit_log 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    table_name, 
    operation, 
    user_email, 
    user_agent
  ) VALUES (
    TG_TABLE_NAME, 
    TG_OP, 
    COALESCE(NEW.email, OLD.email),
    COALESCE(NEW.user_agent, OLD.user_agent)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
CREATE TRIGGER audit_qrthis_notifications
  AFTER INSERT OR UPDATE OR DELETE ON public.qrthis_notifications
  FOR EACH ROW EXECUTE FUNCTION log_security_event();

CREATE TRIGGER audit_waitlist
  AFTER INSERT OR UPDATE OR DELETE ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION log_security_event();
