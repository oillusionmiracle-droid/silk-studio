# Silk studio redesign — verification and rollback

Tested on 13 October 2026. Application commit: 9c0c67e9e8850b79e1335a7f71cff056c0acbca5.

Preview: https://silk-studio-ofpgf4fr5-oillusionmiracle-droids-projects.vercel.app/
PR: https://github.com/oillusionmiracle-droid/silk-studio/pull/3

## Implemented

- Project-led homepage and portfolio with black/lime identity, editorial typography, warm light sections, readable supporting text, and reduced-motion support.
- Eleven apps/website projects and twelve locally hosted images migrated from Miracle's current portfolio. Six selected projects on home, with an inline expansion to all eleven.
- Accessible native project dialogs with role, current scope, mockup disclosures, and original project links.
- AI advertising service section, existing studio motion sample, and ten explicitly credited third-party references. Reference films are not presented as Silk client projects.
- Reviewable WhatsApp brief; no automatic message sending or form persistence.
- Preserved published CMS archive, print-order routes and apparel art direction. Removed unsupported home statistics/testimonials, technology-logo trust claims, redundant marketing-page floating controls, and desktop hamburger. Enabled pinch zoom.

## Evidence

- Production build passed; TypeScript passed; lint passed with existing image warnings elsewhere in the app.
- All 41 existing pricing/payment/security tests passed.
- Desktop preview rendered without broken loaded images or horizontal overflow.
- Project dialog opened; Escape closed it and restored focus to its trigger.
- Portfolio Apps filter displayed SplitHouse, Moremi, Cutout and ProofRoom.
- Brief preparation produced the intended name, service, goal, timing and encoded WhatsApp link. No message was sent.
- Existing motion sample played through to 4.791667 seconds; the deployed media endpoint returned 200 and video/mp4.
- Home and portfolio rendered in 390px iframe viewports (384px content area after scrollbar), with scrollWidth equal to content width. Mobile menu opened/closed; home expansion displayed all eleven projects; Apps filtering displayed four.
- Navigation to print ordering rendered the existing category selector.

The mobile check validates responsive browser rendering, not physical-device touch behavior. External portfolio application backends and real paid transactions were not exercised by this design verification. The earlier security SQL migration and Edge Function deployment remain a separate external deployment task.

## Reversibility

Main remains at 444271b8224cf6d80a2575d1c6d42d01768fa7b2. The design PR is stacked on fix/security-payments-2026-10-13 (b812a8bee07f5deaedf900080a625af713e76fae). Existing production deployment and backup branch remain intact.

To undo only the design after merging, revert the design commits in reverse order (9c0c67e, then 17f550b) using git revert. Retain the security/payment commit. If promoted to production later, Vercel can also restore the prior production deployment. Do not revert the security database migration merely to change the visual design.

## Source and reference direction

The user's current preview-v14.html portfolio supplied project descriptions, images, links and advertising references. BASIC/DEPT and Locomotive informed the project-first hierarchy and restrained studio presentation; their visual designs were not copied.
