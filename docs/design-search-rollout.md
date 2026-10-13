# Search, motion and Moremi redesign

Based on design/project-first-homepage at 127e683cd3de1eb50c92c35d16eb72aac8ed9678. Publish this branch as a Vercel preview. The old design branch, main, earlier preview deployments and payment backup branch are preserved.

Changes: local site search for service ordering and project navigation; GSAP word reveals with reduced-motion support; Gemini restored; studio moved to /studio; detailed free brief dialog; service preselection and order layout; Moremi redesign with the existing character assets and existing Formspree endpoint.

Search never sets prices. Orders retain server-side pricing and payment verification from the security branch. The previously documented Supabase rollout is still required before real payment verification can be claimed. The brief form prepares a WhatsApp message; it does not submit until the visitor chooses WhatsApp. Moremi submits adult waitlist details to the existing Formspree endpoint.

Replacement archive photos are illustrative previews, not evidence of completed client work. Restaurant and summit images: Unsplash, downloaded locally from images.unsplash.com/photo-1517248135467-4c7edcad34c4 and photo-1540575467063-178a50c2df87. Dashboard: original SVG interface illustration. Existing category assets replace other missing archive images.

Rollback: deploy the previous design commit 127e683cd3de1eb50c92c35d16eb72aac8ed9678 or restore its existing Vercel preview. No database migration is included in this design change.
