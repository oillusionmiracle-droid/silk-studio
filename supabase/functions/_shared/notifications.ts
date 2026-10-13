/** Run only after the verified payment handler succeeds. No credentials reach clients. */
export function kickPaymentNotifications(): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return Promise.resolve();
  return fetch('https://www.silkstudios.com.ng/api/payment-notifications', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: '{}', signal: AbortSignal.timeout(20000),
  }).then(async response => { await response.body?.cancel(); if (!response.ok) console.error('Payment email worker unavailable', response.status); }).catch(() => { console.error('Payment email worker request failed'); });
}
