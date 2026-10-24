# Silk Studio Blog — editorial redesign

Research captured 24 October 2026. Original implementation in Next.js; references inform hierarchy, not copied branding.

## Observed references
- https://screenrant.com/ — inspected homepage screenshot: dark masthead, white reading surface, one large image-led story, smaller supporting stories, compact latest rail, topic navigation. Article text includes bylines and descriptive image text. Desktop image hierarchy is observed; mobile layout is our own responsive treatment.
- https://blog.hubspot.com/marketing — inspected desktop screenshot: light page, serif section title, featured lead separated from smaller thumbnail-and-headline lists, clear author/date metadata and topic navigation. Extracted branding reports HubSpot Sans and HubSpot Serif. These fonts are not reused.
- https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/ — source announcement, not a design template. Published 20 October 2026.
- https://blog.youtube/news-and-events/made-on-youtube-creators-shorts-series-tv-features/ — source announcement, published 23 September 2026.

## Proposed design system
- Light background #fff; ink #171717; secondary #626262; separators #dcdcdc.
- Dark background #000, not charcoal; ink #f6f6f1; secondary #aaa; separators #303030.
- Existing studio Geist font, strong compact headlines; Georgia only for the newsletter invitation. No enormous slogan hero or abstract typographic placeholder art.
- 1200px content maximum; image-first lead / smaller reading-list column; ordinary story grid. On phones, lead precedes compact horizontal related-story rows and single-column latest stories.
- Article: breadcrumb, category, headline, short deck, studio byline, date, reading time, cover photo, tiny contextual caption and linked credit, readable 680px body, desktop contents rail, sources, related reading.
- Blog-only light/dark control, saved locally. Light is the first-visit default.
- Shared offer strip 36px desktop / 32px phone. Only repeated GET 40% OFF WEBSITES. Entire strip is a link; reduced-motion users see a static message.
- Footer social marks 20px in one row, with accessible names; small lime order button without arrow. Gemini restored; phone launcher 42px.

## Imagery
Downloaded to public/images/blog. Unsplash photo pages provide free-use license statements. Captions describe the editorial relevance; the photos are not represented as Silk Studio client work.
- gemini-business-tools.jpg — Google's actual announcement image, used to illustrate reporting about that announcement; credited and linked to The Keyword. Source: https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/
- creative-desk.jpg — Adeniji Abdullahi A; https://unsplash.com/photos/a-white-desk-topped-with-electronics-and-a-laptop-DKnh2zu0SbA
- camera-and-phone.jpg — Miguel A Amutio; https://unsplash.com/photos/black-and-white-view-of-a-camera-phone-and-laptop-Fqj1Zbu0CqE
- phone-and-camera.jpg — Ameen ALmayuf; https://unsplash.com/photos/black-iphone-7-plus-and-dslr-camera-on-table-8kpsiLhifq0
- colour-swatches.jpg — credited to photo page; https://unsplash.com/photos/a-bunch-of-different-colors-of-paper-on-a-table-iWmgD20Mne0

## Content and measurement
Five original articles. Two respond to verified platform announcements; three are practical studio opinion with clearly illustrative scenarios. No invented customer anecdotes, statistics or test results.

Every article has canonical/social metadata, descriptive alt text and BlogPosting structured data. Blog and article URLs and images are in sitemap.xml; robots.txt allows public crawling; RSS is available at /blog/feed.xml.

Published GTM-5X732MF6 container inspected: empty tags/rules arrays. Root consent now also gates direct GA4 support. Set NEXT_PUBLIC_GA_MEASUREMENT_ID to the owner's real G-… web-stream ID and redeploy. No invented identifier. Track initial/client-route page_view, article_view and article_read when the reader reaches the article-end note. Analytics account connection and live reporting still require authorized access. Indexing is a separate Search Console concern and is not guaranteed by installing analytics.
