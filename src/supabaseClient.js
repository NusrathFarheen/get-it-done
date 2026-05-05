import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzdvcprqudikcwilhfzq.supabase.co';
const supabaseKey = 'sb_publishable_o73sQRICE99GL0IV4ayAhQ_GJpEhVVe';

export const supabase = createClient(supabaseUrl, supabaseKey);
