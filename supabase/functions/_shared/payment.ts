export interface VerifiedPayment {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  id: string | number;
}

export function validatePayment(data: VerifiedPayment, reference: string): void {
  if (!data || data.status !== 'success' || data.reference !== reference) throw new Error('Payment was not successfully verified.');
  if (data.currency !== 'NGN') throw new Error('Payment currency must be NGN.');
  if (!Number.isSafeInteger(data.amount) || data.amount <= 0) throw new Error('Invalid payment amount.');
  if (!data.id || !['string', 'number'].includes(typeof data.id)) throw new Error('Missing payment transaction ID.');
}

export async function finalizePayment(supabase: any, data: VerifiedPayment, reference: string) {
  validatePayment(data, reference);
  const { data: result, error } = await supabase.rpc('finalize_order_payment', {
    p_reference: reference, p_amount_kobo: data.amount, p_currency: data.currency,
    p_provider_id: String(data.id),
  });
  if (error) throw new Error(`Payment could not be recorded: ${error.message}`);
  if (!result?.order_id) throw new Error('Payment could not be recorded.');
  return result as { order_id: string; status: string; already_processed: boolean };
}
