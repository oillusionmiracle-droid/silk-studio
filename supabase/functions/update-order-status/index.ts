import { createClient } from 'npm:@supabase/supabase-js@2.115.0';
import { failure, HttpError, json, methodCheck, readJson, UUID } from '../_shared/http.ts';
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
Deno.serve(async (req: Request) => {
  const method = methodCheck(req); if (method) return method;
  try {
    const token = /^Bearer\s+(.+)$/i.exec(req.headers.get('authorization') || '')?.[1];
    if (!token) throw new HttpError(401, 'Sign in to continue.');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new HttpError(401, 'Invalid session.');
    const body = await readJson(req);
    if (!UUID.test(body.order_id)) throw new HttpError(400, 'Invalid order ID.');
    const { data, error } = await supabase.rpc('admin_update_order', { p_admin_id: user.id, p_order_id: body.order_id, p_status: body.new_status, p_note: body.admin_note ?? null });
    if (error?.message.includes('ADMIN_REQUIRED')) throw new HttpError(403, 'Administrator access required.');
    if (error?.message.includes('PAYMENT_REQUIRED')) throw new HttpError(409, 'Payment must be verified before progressing this order.');
    if (error?.message.includes('INVALID_STATUS')) throw new HttpError(400, 'Invalid order status or note.');
    if (error || !data) throw new Error('Status update failed.');
    return json({ success: true, order: data });
  } catch (error) { return failure(error); }
});
