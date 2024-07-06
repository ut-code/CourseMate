import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://luwkbkrpjkbbkpixsasc.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);
export { supabase };
