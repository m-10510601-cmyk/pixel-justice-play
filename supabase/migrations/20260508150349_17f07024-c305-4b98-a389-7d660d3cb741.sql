CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  lang TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT feedbacks_message_length CHECK (char_length(message) BETWEEN 1 AND 1000)
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.feedbacks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (char_length(message) BETWEEN 1 AND 1000);
-- No SELECT policy: reads only via service-role edge function.