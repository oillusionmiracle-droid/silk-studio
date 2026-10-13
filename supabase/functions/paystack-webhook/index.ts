import { createClient } from 'npm:@supabase/supabase-js@2.115.0';
import { webhookHandler } from '../_shared/payments.ts';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
Deno.serve(webhookHandler(supabase, Deno.env.get('PAYSTACK_SECRET_KEY')));
