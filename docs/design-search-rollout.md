# Search, motion and Moremi redesign

Based on design/project-first-homepage at 127e683cd3de1eb50c92c35d16eb72aac8ed9678. Publish this branch as a Vercel preview. The old design branch, main, earlier preview deployments and payment backup branch are preserved.

Changes: local site search for service ordering and project navigation; GSAP word reveals with reduced-motion support; Gemini restored; studio moved to /studio; detailed free brief dialog; service preselection and order layout; Moremi redesign with the existing character assets and existing Formspree endpoint.

Search never sets prices. Orders retain server-side pricing and payment verification from the security branch. The previously documented Supabase rollout is still required before real payment verification can be claimed. The brief form first prepares a review. Visitors then choose Send brief (Formspree inbox) or WhatsApp. Moremi submits adult waitlist details to the existing Formspree endpoint.

Replacement archive photos are illustrative previews, not evidence of completed client work. Restaurant and summit images: Unsplash, downloaded locally from images.unsplash.com/photo-1517248135467-4c7edcad34c4 and photo-1540575467063-178a50c2df87. Dashboard: original SVG interface illustration. Existing category assets replace other missing archive images.

Rollback: deploy the previous design commit 127e683cd3de1eb50c92c35d16eb72aac8ed9678 or restore its existing Vercel preview. No database migration is included in this design change.

## Formspree brief integration and verification

The supplied numeric project ID is a Formspree CLI project, not the Vercel project ID. `formspree.json` defines `projectBrief`; the client uses FormspreeProvider with project 3111554656879247341. The deploy key is not committed or exposed in client code. Direct submissions require an email address; the project brief includes the service, goal, timing, budget, details and optional WhatsApp number. A preview step separates writing from submission. New briefs are stored in the Formspree project inbox; no email notification action was configured because the supplied CLI project does not identify a recipient.

Browser checks confirmed service search preselection and service-specific brief placeholders. Moremi’s story choice and school form work. The Gemini panel is restored, but a real request failed with `Server database configuration is missing`: Vercel variables are Production-only and this is a Preview deployment. Do not describe this preview’s chat, checkout or uploads as provider-verified. The UI offers ordering/brief links when Gemini is unavailable.

Formspree deployment 3111591276558942013 returned HTTP 200 and created projectBrief with server field validation. No email action is configured, so review submissions in the Formspree project inbox.
