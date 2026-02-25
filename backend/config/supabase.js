import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http') ? process.env.SUPABASE_URL : 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';

if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase credentials in environment. Application will not connect to the database.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
