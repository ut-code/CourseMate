// import { createClient } from '@supabase/supabase-js';

// import { SUPABASE_KEY, SUPABASE_URL } from '../env';

// const supabaseUrl = 'https://luwkbkrpjkbbkpixsasc.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1d2tia3JwamtiYmtwaXhzYXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1MjI5NzcsImV4cCI6MjAzNDA5ODk3N30.S2KyfQt_7N8USCLhnb6FF96FsRzPZsJWxIX0l27FZ2k';

// export const supabase = createClient(supabaseUrl!, supabaseKey!);
import AsyncStorage from '@react-native-async-storage/async-storage'
// import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'

const url = 'https://luwkbkrpjkbbkpixsasc.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1d2tia3JwamtiYmtwaXhzYXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1MjI5NzcsImV4cCI6MjAzNDA5ODk3N30.S2KyfQt_7N8USCLhnb6FF96FsRzPZsJWxIX0l27FZ2k';

// Initialize the Supabase client
export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
})
