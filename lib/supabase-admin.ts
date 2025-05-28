import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Client Supabase avec la clé service qui peut contourner la RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Ce client ne doit JAMAIS être exposé au navigateur
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey); 