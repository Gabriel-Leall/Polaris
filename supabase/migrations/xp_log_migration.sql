-- ============================================
-- XP Log table for deduplication and history
-- ============================================

CREATE TABLE IF NOT EXISTS public.xp_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  xp_amount INTEGER NOT NULL DEFAULT 0,
  reference_id TEXT,  -- e.g. task_id, note_id, "2026-03-05" for daily_login
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint for deduplication: same user + action + reference = no double XP
CREATE UNIQUE INDEX IF NOT EXISTS xp_log_dedup_idx
  ON public.xp_log(user_id, action_type, reference_id)
  WHERE reference_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own xp log" ON public.xp_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp log" ON public.xp_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS xp_log_user_id_idx ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS xp_log_created_at_idx ON public.xp_log(created_at);
