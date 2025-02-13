import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://raljofhkwqazwgsuhhvr.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbGpvZmhrd3Fhendnc3VoaHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NDAxNjcsImV4cCI6MjA1NDUxNjE2N30.lPR_k7ywPE4QdNNXEo52SVLQ5b-rP3zr4SRl0X51OLM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
