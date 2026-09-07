-- Add role/company column to testimonials table
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS role TEXT;

-- Seed initial client testimonials
INSERT INTO public.testimonials (customer_name, role, testimonial, display_order, published)
VALUES
  (
    'Afolabi M.',
    'Operations Lead at Vantage Events',
    'Finding a reliable print shop in Lagos used to be a gamble for our event planning business. Silk Studio delivered our entire batch of branded souvenirs and conference materials in under 48 hours, and the quality was top-tier.',
    1,
    true
  ),
  (
    'Chidinma E.',
    'Founder of Lumina Brands',
    'Beyond the physical prints, having them handle our web design and automated customer workflows changed how our brand operates online. They bridge the gap between creative design and serious tech.',
    2,
    true
  )
ON CONFLICT DO NOTHING;

