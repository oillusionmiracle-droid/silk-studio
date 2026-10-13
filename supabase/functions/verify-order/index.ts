import { createClient } from 'npm:@supabase/supabase-js@2.115.0';
import { verifyOrderHandler } from '../_shared/payments.ts';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
Deno.serve(verifyOrderHandler(supabase, Deno.env.get('PAYSTACK_SECRET_KEY')));
