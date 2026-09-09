import { ContactInfo } from '../order/types';

export function validateOrderSubmission(
  contact: ContactInfo,
  subService: string | null,
  isCustomQuote: boolean
): { isValid: boolean; error?: string } {
  if (!contact.firstName?.trim()) {
    return { isValid: false, error: 'Please enter your first name.' };
  }
  if (!contact.whatsapp?.trim() || contact.whatsapp.trim() === '+234') {
    return { isValid: false, error: 'Please provide a valid WhatsApp number.' };
  }
  if (!subService) {
    return { isValid: false, error: 'Please select a service.' };
  }
  if (!isCustomQuote && !contact.email?.trim()) {
    return { isValid: false, error: 'Please provide an email address to proceed with Paystack payment.' };
  }
  return { isValid: true };
}
