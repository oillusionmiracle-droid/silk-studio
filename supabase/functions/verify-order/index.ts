declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };
import { kickPaymentNotifications } from '../_shared/notifications.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.115.0';
import { verifyOrderHandler } from '../_shared/payments.ts';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const handler = verifyOrderHandler(supabase, Deno.env.get('PAYSTACK_SECRET_KEY'));
Deno.serve(async (req: Request) => {
  const response = await handler(req);
  if (req.method === 'POST' && response.status === 200) {
    // The outbox contains only payments recorded by the atomic settlement RPC.
    EdgeRuntime.waitUntil(kickPaymentNotifications());
  }
  return response;
});
