import { getServerSupabase } from '@/lib/serverSupabase';
import { paymentNotificationHandler } from '@/lib/paymentNotifications';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
async function run(req: Request) {
  return paymentNotificationHandler({
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    cronSecret: process.env.CRON_SECRET,
    resendKey: process.env.RESEND_API_KEY,
    from: process.env.ORDER_EMAIL_FROM,
  }, {
    async claimOrders() {
      const { data, error } = await getServerSupabase().rpc('claim_payment_notifications');
      if (error) throw new Error('Notification queue unavailable.');
      return data || [];
    },
    async updateQueue(id, update) {
      const { error } = await getServerSupabase().from('payment_notifications').update(update).eq('order_id', id);
      if (error) throw new Error('Notification receipt could not be saved.');
    },
  })(req);
}
export const POST = run;
export const GET = run;
