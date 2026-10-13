import LegalPage from '@/components/LegalPage';
const sections = [
  {
    id: 'acceptance',
    number: '01',
    title: 'Acceptance of Terms',
    content: 'By accessing and using Silk Studio\'s platform, website, apparel shop, and services (collectively, the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use our Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of the updated terms.',
  },
  {
    id: 'services',
    number: '02',
    title: 'Services Offered',
    bullets: [
      { label: 'Platform Services', detail: 'Connects clients with vetted professional printers across Lagos for custom print and design work.' },
      { label: 'Design Services', detail: 'Logo design, custom templates, and branding, with promotional discounts for first-time customers as advertised from time to time.' },
      { label: 'Print Products', detail: 'Business cards, flyers, banners, custom apparel (bulk/custom orders), wedding souvenirs, billboards, and event packages, quoted individually.' },
      { label: 'Apparel Shop ("Wears")', detail: 'Direct-to-consumer print-on-demand apparel — t-shirts, hoodies, and caps — sold at fixed, listed prices through our online shop, separate from our custom quote-based services.' },
      { label: '48-Hour Guarantee (Custom Orders)', detail: 'Turnaround from order confirmation to ready-for-pickup/delivery status for standard custom print and design orders. This guarantee applies to custom quote-based orders and does not apply to apparel shop purchases, which follow production timelines described in Section 7.' },
      { label: 'Logistics Management', detail: 'Real-time order dispatch, quality assurance, and delivery coordination for both custom orders and apparel shop purchases.' },
    ],
  },
  {
    id: 'eligibility',
    number: '03',
    title: 'Eligibility',
    content: 'You represent and warrant that you are at least 18 years old with legal capacity to enter binding agreements. You are not prohibited by law from using our Service. All information you provide is accurate, complete, and truthful. You will not use the Service for unlawful, fraudulent, or harmful purposes. We reserve the right to suspend or terminate your account or refuse an order if these requirements are breached.',
  },
  {
    id: 'account',
    number: '04',
    title: 'Account Registration & Responsibilities',
    bullets: [
      { label: 'Confidentiality', detail: 'You are responsible for maintaining confidentiality of your account credentials (password, email), where an account is required.' },
      { label: 'Guest Purchases', detail: 'Our apparel shop may permit guest checkout without a full account. In this case, you remain responsible for the accuracy of the contact and delivery information provided at checkout.' },
      { label: 'Account Activity', detail: 'You are solely responsible for all activities under your account.' },
      { label: 'Security Notification', detail: 'Notify us immediately of any unauthorized access or use of your account.' },
      { label: 'Account Violations', detail: 'We reserve the right to suspend or terminate accounts used in violation of these terms.' },
    ],
  },
  {
    id: 'ordering',
    number: '05',
    title: 'Ordering & Payment',
    content: 'All orders placed through Silk Studio — whether a custom print/design commission or an apparel shop purchase — are binding agreements once payment is confirmed. You must provide accurate project specifications, sizing, and delivery details.\n\nPricing is displayed in Nigerian Naira (₦) and includes applicable taxes. For visitors browsing our apparel shop from outside Nigeria, an approximate conversion (e.g. to USD) may be displayed for convenience — however, all charges are processed and billed exclusively in Nigerian Naira through Paystack, regardless of the currency displayed.\n\nPayment must be completed before order confirmation. We accept Paystack payments exclusively — we do not store card or bank details.\n\nFor custom print/design orders: A non-refundable 75% deposit is required at order confirmation; the remaining 25% is due before final delivery.\n\nFor apparel shop purchases: Full payment is required at checkout to confirm your order, as items are produced to order.\n\nIf we fail to meet a guaranteed turnaround due to our error, you are entitled to a full refund or a discount on a future order, as outlined in Section 7.',
  },
  {
    id: 'deposits',
    number: '06',
    title: 'Deposits, Cancellations & Refunds',
    bullets: [
      { label: 'Custom 75% Deposit', detail: 'Non-refundable once design work or printing has commenced.' },
      { label: 'Custom Order Cancellation', detail: 'Before design approval: forfeit deposit. After design approval: forfeit 50% of total order value. Post-printing: no refunds.' },
      { label: 'Apparel Shop Purchases', detail: 'Because every item is produced to order through our print-on-demand process, apparel purchases cannot be cancelled once production has started. If you need to cancel, contact us via WhatsApp immediately after ordering.' },
      { label: 'Exchange & Return Policies', detail: 'Size exchanges for apparel are governed by our separate Exchange Policy. Refunds for damaged, defective, or incorrect apparel items are governed by our separate Return Policy.' },
      { label: 'Design Service Discounts', detail: 'Any advertised discount for design services applies to one order per customer and is non-transferable, unless otherwise stated.' },
    ],
  },
  {
    id: 'fulfillment',
    number: '07',
    title: 'Order Fulfillment & Turnaround Time',
    bullets: [
      { label: 'Custom Print/Design Orders', detail: 'Silk Studio guarantees 48-hour turnaround from order confirmation (after design approval and full payment) to ready-for-collection/delivery, for standard orders. Bulk or high-volume orders (10+ pieces) may require extended timelines.' },
      { label: 'Apparel Shop Orders', detail: 'Apparel shop purchases are produced to order and are not held in pre-made stock. Standard production and delivery timelines will be communicated at checkout or via order confirmation. Delivery is currently available within Lagos only.' },
      { label: 'Quality Assurance', detail: 'All printed materials and apparel items undergo quality checks before delivery. Defective items due to our error will be reprinted/reproduced and redelivered at no cost.' },
      { label: 'Delays', detail: 'We are not liable for delays caused by incomplete briefs, late approvals, payment delays, power outages, logistics delays, or third-party capacity issues. If custom order delays exceed 72 hours due to our error, you are entitled to a 25% refund or credit toward a future order.' },
    ],
  },
  {
    id: 'intellectual-property',
    number: '08',
    title: 'Intellectual Property & Content',
    bullets: [
      { label: 'Your Content', detail: 'You retain full ownership of designs, briefs, and assets you upload for custom orders. You grant us license to use content solely for fulfilling your order. You warrant you own the content and it does not infringe third-party rights.' },
      { label: 'Our Content', detail: 'Silk Studio branding, logos, website design, apparel designs, platform code, and product photography are our exclusive intellectual property. Reproduction without written permission is prohibited.' },
      { label: 'Third-Party Content', detail: 'Some custom designs may be licensed from third parties. Use is restricted to your specific order.' },
    ],
  },
  {
    id: 'printer-network',
    number: '09',
    title: 'Printer Network, Fulfillment Partners & Liability',
    content: 'Silk Studio operates a network of vetted professional printers across Lagos for custom orders, and works with print-on-demand fulfillment partner(s) for apparel shop production. While we conduct quality screening of our partners, each operates independently. Silk Studio is responsible for quality assurance, delivery coordination, and customer service across both. Our total liability for any order shall not exceed the amount you paid for that specific order. We are not liable for indirect, incidental, special, or consequential damages, or for issues arising from incomplete briefs, third-party service failures, or unlawful use of materials or apparel.',
  },
  {
    id: 'indemnification',
    number: '10',
    title: 'Indemnification',
    content: 'You agree to indemnify, defend, and hold harmless Silk Studio from any claims, damages, or losses arising from: your use of the Service in violation of these terms, your content infringing third-party intellectual property rights, or your use of printed materials or apparel in violation of applicable law.',
  },
  {
    id: 'acceptable-use',
    number: '11',
    title: 'Acceptable Use Policy',
    content: 'Do not upload malware, attempt unauthorized access to our systems, engage in harassment, submit defamatory or unlawful content, use our Service for fraud, reverse-engineer our platform, scrape data from our site (including our apparel shop\'s product catalog or pricing), or resell our services or products without authorization. Violations result in immediate account suspension, order cancellation, and potential legal action.',
  },
  {
    id: 'disputes',
    number: '12',
    title: 'Disputes & Resolution',
    bullets: [
      { label: 'Informal Resolution', detail: 'Email thesilkstudiong@gmail.com within 7 days of the issue arising. We respond within 48 hours.' },
      { label: 'Mediation', detail: 'If informal resolution fails, both parties agree to attempt mediation in Lagos, Nigeria, under Nigerian law before pursuing formal legal action.' },
      { label: 'Jurisdiction', detail: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Legal proceedings shall be brought exclusively in Lagos State courts.' },
    ],
  },
  {
    id: 'termination',
    number: '13',
    title: 'Termination of Service',
    content: 'Silk Studio reserves the right to terminate or suspend your account or refuse to fulfill an order immediately, without notice, if you violate these Terms, engage in fraudulent activity, abuse the Service, or fail to complete payment. Upon termination, you lose all account access and any active orders may be cancelled. Non-refundable deposits, where applicable, are forfeited.',
  },
  {
    id: 'confidentiality',
    number: '14',
    title: 'Confidentiality',
    content: 'We treat all project briefs, designs, and business information as confidential. Our team and fulfillment partners are bound by confidentiality obligations. We will not disclose your information to third parties except as outlined in our Privacy Policy or as required by law.',
  },
  {
    id: 'warranties',
    number: '15',
    title: 'Limitation of Warranties',
    content: 'Silk Studio provides its Service, platform, and apparel shop on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding continuous availability, accuracy of product or pricing information, fitness for a particular purpose, or quality, except as expressly guaranteed in Section 7.',
  },
  {
    id: 'changes',
    number: '16',
    title: 'Changes to Terms',
    content: 'We may update these Terms and Conditions at any time, including to reflect new services such as our apparel shop. Material changes will be communicated via email or a notice on our website. Your continued use of the Service constitutes acceptance of updated terms. We recommend reviewing these terms periodically.',
  },
  {
    id: 'contact',
    number: '17',
    title: 'Contact & Support',
    bullets: [
      { label: 'Email', detail: 'thesilkstudiong@gmail.com' },
      { label: 'Website', detail: 'silkstudios.com.ng' },
      { label: 'WhatsApp', detail: '+2347064829776' },
      { label: 'Location', detail: 'Lagos, Nigeria' },
    ],
  },
];
export default function Page() { return <LegalPage title='Terms & conditions.' subtitle='Clear expectations. Better work.' sections={sections} updated="2 September 2026" other='/privacy'/>; }
