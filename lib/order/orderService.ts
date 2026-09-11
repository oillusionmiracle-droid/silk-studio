import { supabase } from '@/lib/supabase';
import { DbProduct } from '@/lib/pricing';
import { ContactInfo, OrderSpecs } from './types';

export function formatSpecsText(subService: string, specs: OrderSpecs): string {
  if (subService === 'Flyers & Handbills') {
    return `${specs.size}, ${specs.sides}, ${specs.lamination} Lamination`;
  }
  if (subService === 'Banners') {
    return `${specs.width}ft × ${specs.height}ft, Eyelets: ${specs.eyelets}`;
  }
  if (subService === 'Jotters & Notepads') {
    return `${specs.innerSheets}, ${specs.lamination}, ${specs.binding}, ${specs.cover}`;
  }
  if (subService === 'ID Cards') {
    return specs.idType;
  }
  if (subService === 'Business Cards') {
    return `${specs.stock}, ${specs.lamination}, ${specs.corners} Corners`;
  }
  if (subService === 'Letterheads') {
    return `${(specs as any).paperType || 'Standard'} Letterhead`;
  }
  if (subService === 'Event Merch Set') {
    return 'Custom Brief';
  }
  if (['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService)) {
    const s = specs.apparelSizes;
    return `S(${s.S}) M(${s.M}) L(${s.L}) XL(${s.XL}) XXL(${s.XXL})`;
  }
  return 'Custom Specifications';
}

export function formatOrderMessage({
  orderRef,
  subService,
  specsText,
  quantity,
  specs,
  referenceFileUrl,
  contact,
  isCustomQuote,
  total,
  deposit,
}: {
  orderRef: string;
  subService: string;
  specsText: string;
  quantity: number;
  specs: OrderSpecs;
  referenceFileUrl: string;
  contact: ContactInfo;
  isCustomQuote: boolean;
  total: number;
  deposit: number;
}): string {
  return `*NEW ORDER BRIEF [${orderRef}]*
------------------------------
*Service:* ${subService}
*Specs:* ${specsText}
*Quantity:* ${quantity}
*Deadline:* ${specs.deadline || 'Flexible'}

*Description:*
${specs.description || 'No description'}

*Reference File:* ${referenceFileUrl || 'None'}

*Customer:*
- Name: ${contact.firstName} ${contact.lastName}
- WhatsApp: ${contact.whatsapp}
- Email: ${contact.email || 'N/A'}
- Via: ${contact.source || 'N/A'}

*Price:* ${isCustomQuote ? 'Quote Requested' : `Total: ₦${total.toLocaleString()} | Deposit: ₦${deposit.toLocaleString()}`}
------------------------------`.trim();
}

export const loadPaystackScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window is undefined.'));
    if ((window as any).PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script.'));
    document.body.appendChild(script);
  });

export interface LaunchPaystackParams {
  orderRef: string;
  orderMessage: string;
  contact: ContactInfo;
  amount: number;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export async function launchPaystackPayment({
  orderRef,
  contact,
  amount,
  onSuccess,
  onCancel,
}: LaunchPaystackParams) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    alert('Paystack public key is missing.');
    return;
  }
  try {
    await loadPaystackScript();
  } catch (error) {
    console.error(error);
    alert('Unable to load Paystack. Please try again later.');
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: publicKey,
    email: contact.email || `${contact.whatsapp.replace(/\D/g, '')}@silk.studio`,
    amount: Math.round(amount * 100),
    currency: 'NGN',
    ref: orderRef,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: `${contact.firstName} ${contact.lastName}`.trim() },
        { display_name: 'WhatsApp', variable_name: 'whatsapp', value: contact.whatsapp },
      ],
    },
    onClose: () => {
      if (onCancel) onCancel();
      else alert('Payment was cancelled. Your order was not submitted.');
    },
    callback: (response: { reference: string; status: string }) => {
      if (response.status === 'success') {
        onSuccess(response.reference);
      } else {
        alert('Payment was not completed. Please try again.');
      }
    },
  });

  handler.openIframe();
}

export async function submitServerOrder({
  userId,
  contact,
  subService,
  specsText,
  quantity,
  specs,
  referenceFileUrl,
  currentProduct,
  isCustomQuote,
  total,
  deposit,
  payFull,
  fallbackOrderRef,
}: {
  userId?: string | null;
  contact: ContactInfo;
  subService: string;
  specsText: string;
  quantity: number;
  specs: OrderSpecs;
  referenceFileUrl: string;
  currentProduct?: DbProduct;
  isCustomQuote: boolean;
  total: number;
  deposit: number;
  payFull: boolean;
  fallbackOrderRef: string;
}): Promise<string> {
  let orderRef = fallbackOrderRef;

  try {
    const payload = {
      type: 'custom',
      customer_name: `${contact.firstName} ${contact.lastName}`.trim(),
      phone: contact.whatsapp,
      email: contact.email || null,
      address: 'Custom Design Order',
      area: 'Lagos',
      items: currentProduct ? [{ product_id: currentProduct.id, quantity }] : [],
      specs: {
        service: subService,
        specs: specsText,
        quantity,
        deadline: specs.deadline,
        description: specs.description,
      },
      reference_files: referenceFileUrl ? [referenceFileUrl] : [],
    };

    const { data: functionData, error: fnError } = await supabase.functions.invoke('create-order', {
      body: payload,
    });

    if (fnError) {
      console.warn('Edge Function invoke notice (falling back to direct client):', fnError);
      await supabase.from('orders').insert({
        user_id: userId || null,
        type: 'custom',
        customer_name: payload.customer_name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        area: payload.area,
        subtotal: isCustomQuote ? 0 : total,
        delivery_fee: 0,
        total: isCustomQuote ? 0 : (payFull ? total : deposit),
        status: isCustomQuote ? 'quote_requested' : 'pending',
        paystack_ref: orderRef,
        specs: payload.specs,
        reference_files: payload.reference_files,
        status_history: [
          {
            status: isCustomQuote ? 'quote_requested' : 'pending',
            timestamp: new Date().toISOString(),
            note: isCustomQuote ? 'Quote requested via Studio Form' : 'Order initiated for deposit payment',
          },
        ],
      });
    } else if (functionData?.paystack_ref) {
      orderRef = functionData.paystack_ref;
    }
  } catch (err) {
    console.error('Error in submitServerOrder:', err);
  }

  return orderRef;
}
