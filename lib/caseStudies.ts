// Adapted from the owner's silk-portfolio/src/case-studies/data.js.
// Preserve implementation limits and distinguish built features from measured outcomes.
export const caseStudies = [
  {
    "id": "party-crashers",
    "name": "Party Crashers",
    "short": "From scattered flyers to a useful plan.",
    "subtitle": "A Lagos-first event product with a source-aware collection pipeline, authenticated submissions and delivery beyond the browser.",
    "kind": "Discovery / data pipelines",
    "role": "Product concept · Brand & product design · Full-stack development",
    "accent": "#ff895b",
    "ink": "#2d190f",
    "repo": "party-crashers",
    "sha": "9780504016f677b049d597662895038c4c96ec0c",
    "url": "https://party-crashers-seven.vercel.app",
    "fallback": "/assets/party-crashers-live.jpg",
    "stack": [
      "Next.js 16",
      "React + TypeScript",
      "Clerk",
      "Supabase Edge Functions",
      "PostgreSQL",
      "Tesseract.js",
      "Web Push",
      "Android / Java"
    ],
    "summary": "Finding an event is only useful if its date, venue and registration link are trustworthy. I built Party Crashers around that practical job: discover local events, understand the details, save a plan, and let organisers contribute without requiring every field to be retyped by hand.",
    "problem": "Lagos events are spread across flyers, organiser websites and social feeds. The information is inconsistent, and a discovery feed becomes expensive to maintain if every listing needs manual transcription and map coordinates.",
    "audience": "People planning what to do in Lagos, campus and community groups, and organisers who need a route into local discovery.",
    "constraint": "Freshness, missing venues and duplicate listings matter as much as visual design. Public browsing should work without an account, while personal data, uploads and publishing actions require verified ownership.",
    "decisions": [
      {
        "title": "Discover first. Sign in for personal actions.",
        "why": "Visitors should be able to inspect real events before committing to an account.",
        "how": "Public event pages and a server-readable catalogue sit alongside a Clerk-authenticated application for saved plans, preferences and submissions.",
        "path": "src/server/events.ts"
      },
      {
        "title": "Treat the venue as data, not decoration.",
        "why": "An approximate city-centre pin can make a listing look complete while sending someone to the wrong place.",
        "how": "Reuse reviewed venues, then attempt an exact named OpenStreetMap POI match inside Lagos bounds. Ambiguous matches remain unresolved. Successful and failed lookups use different cache lifetimes.",
        "path": "supabase/functions/_shared/venues.ts"
      },
      {
        "title": "Keep expensive and intrusive work opt-in.",
        "why": "OCR, browser permissions and paid search should not start just because a screen mounts.",
        "how": "Flyer OCR runs in a lazy device worker after a tap. Push permission has an explicit profile action. Paid extraction requires global and source-level configuration.",
        "path": "docs/WEB-DISCOVERY-SETUP.md"
      }
    ],
    "flows": [
      {
        "label": "Event pipeline",
        "title": "Source facts become a canonical event.",
        "steps": [
          {
            "title": "Collect",
            "body": "Scheduled adapters read approved organiser feeds. A separate bounded discovery worker checks permitted websites and queues relevant event links.",
            "path": "supabase/functions/pc-discover/index.ts"
          },
          {
            "title": "Extract",
            "body": "Read schema.org/Event JSON-LD first. A conservative text fallback produces drafts; optional Firecrawl JSON extraction is enabled separately and never fills missing facts by guessing.",
            "path": "supabase/functions/pc-discover/extract.ts"
          },
          {
            "title": "Resolve & reconcile",
            "body": "Normalise dates to the Lagos context, classify the event and resolve venues. Source records and canonical events are reconciled to reduce duplicate listings and preserve provenance.",
            "path": "supabase/functions/pc-collect/adapters.ts"
          },
          {
            "title": "Publish",
            "body": "Source policy and complete-record validation decide automatic publication or review. Explicit source cancellation can archive a canonical event when no active source remains.",
            "path": "docs/WEB-DISCOVERY-SETUP.md"
          }
        ]
      },
      {
        "label": "Notifications",
        "title": "Publish once. Deliver only with consent.",
        "steps": [
          {
            "title": "Subscribe",
            "body": "A signed-in user chooses interests and enables notifications. The authenticated API stores explicit consent and the current device subscription.",
            "path": "src/product/notifications/NotificationSettings.tsx"
          },
          {
            "title": "Queue",
            "body": "A database trigger queues a delivery when an event first becomes publicly published. Catalogue backfill and subsequent edits do not create fresh alerts.",
            "path": "database/push-notifications.sql"
          },
          {
            "title": "Recheck",
            "body": "The minute dispatcher checks current consent, event status, expiry, interests and coarse area before sending encrypted Web Push with bounded retries.",
            "path": "supabase/functions/pc-push/index.ts"
          },
          {
            "title": "Open the plan",
            "body": "A service worker opens same-origin event links. The separate Android widget reads the public feed and uses local preferences without account credentials or GPS.",
            "path": "docs/notifications-and-widgets.md"
          }
        ]
      }
    ],
    "integrations": [
      [
        "Clerk + jose",
        "Account sessions, verified JWTs and remote signing keys.",
        "Mutations derive ownership from the verified subject; client-supplied IDs are not the authority."
      ],
      [
        "Supabase",
        "Event catalogue, source records, review queues, quotas and scheduled workers.",
        "Private ingestion and delivery tables have restricted access; privileged workers enforce application ownership."
      ],
      [
        "Firecrawl API",
        "Rotating Lagos searches and optional structured page extraction.",
        "Key-dependent and bounded. Source approval and extraction switches still apply; configured code is not proof of an active paid connection."
      ],
      [
        "Photon / OpenStreetMap",
        "Named-venue lookup, attribution and caching.",
        "Only unambiguous named POIs in the Lagos bounding box are accepted; street and city centroids are rejected."
      ],
      [
        "Tesseract.js",
        "On-device flyer text recognition.",
        "Worker/WASM assets are served by the app; English model data downloads on first use. A person confirms missing or corrected details."
      ],
      [
        "Web Push + Android",
        "Opt-in browser alerts and a native Java home-screen widget.",
        "Push delivery depends on device conditions. Android requests a 30-minute refresh, subject to JobScheduler; it is independent of push."
      ]
    ],
    "challenge": {
      "title": "Automate the repetitive work without inventing the missing facts.",
      "body": "A page can mention Lagos and an event name while omitting its year, venue or price. Blind auto-publication would turn incomplete source material into confident misinformation.",
      "resolution": "I separated discovery leads, conservative drafts and publishable events. Network checks bound public crawling; source policies and complete-event validation control publication. Venue reuse removes repeated work where evidence exists.",
      "path": "supabase/functions/pc-discover/network.ts"
    },
    "quality": [
      {
        "title": "Ingestion has adversarial checks.",
        "body": "Repository regression suites cover private/reserved URLs, DNS and redirect escapes, robots denials, incomplete or expired events, taxonomy, venue ambiguity and user confirmation.",
        "path": "tests/discovery-regression.cjs"
      },
      {
        "title": "Auth and notification boundaries are tested separately.",
        "body": "The repository contains auth, consent, push and recommendation regressions. Its documentation distinguishes provider acceptance from a notification actually displayed on a phone.",
        "path": "tests/notification-consent.cjs"
      },
      {
        "title": "Social integrations have honest limits.",
        "body": "Public indexed social links can be search leads. The X collector requires credentials and an explicit paid-search switch; Instagram/Facebook account OAuth is not implemented in the audited version.",
        "path": "docs/social-discovery.md"
      }
    ],
    "outcome": "The public site exposes real event listings and organiser registration links. The repository includes collectors, venue resolution, review tooling, saved preferences, opt-in push and an Android widget companion. Listing coverage, attendance impact and real-device delivery are separate from implementation completeness.",
    "next": "Validate first-time event selection with Lagos users, test browser push on real Android devices, and complete signed widget distribution and launcher QA. Measure freshness and unresolved-venue rates before expanding sources.",
    "screens": [
      {
        "file": "party-crashers-feed",
        "label": "Public event catalogue",
        "note": "Public listings make the information accessible before sign-in and link directly to event detail pages.",
        "url": "https://party-crashers-seven.vercel.app/events"
      },
      {
        "file": "party-crashers-detail",
        "label": "Event detail",
        "note": "Date, venue, organiser context and external registration are the decision-making information.",
        "url": "https://party-crashers-seven.vercel.app/events/moonshot-2026"
      }
    ],
    "sources": [
      "src/product/services.ts",
      "supabase/functions/pc-api/index.ts",
      "supabase/functions/pc-discover/extract.ts",
      "supabase/functions/pc-discover/network.ts",
      "supabase/functions/_shared/venues.ts",
      "docs/WEB-DISCOVERY-SETUP.md",
      "docs/social-discovery.md",
      "docs/notifications-and-widgets.md",
      "tests/discovery-regression.cjs"
    ]
  },
  {
    "id": "rabbithole",
    "name": "RabbitHole",
    "short": "Follow what you love across culture.",
    "subtitle": "Cross-catalogue discovery that joins films, books, television and music without requiring an account.",
    "kind": "API orchestration / interaction design",
    "role": "Product concept · Art direction · Front-end development",
    "accent": "#b9a3f3",
    "ink": "#241934",
    "repo": "rabbithole",
    "sha": "0dea117ffad0d1880cec867ec4208389cf84fd8a",
    "url": "https://rabbithole-sand.vercel.app",
    "fallback": "/assets/rabbithole-live.jpg",
    "stack": [
      "JavaScript",
      "Open Library",
      "TVmaze",
      "Apple Search API",
      "Firecrawl API route",
      "Canvas",
      "Local storage"
    ],
    "summary": "A favourite film often leads to a book, an album or another story with the same feeling. RabbitHole turns that instinct into a product: choose what you liked, follow a theme across catalogues and save the discoveries in your own named universe.",
    "problem": "Most recommendation lists stop at a media category. People have a feeling or a specific favourite in mind, then have to search separate film, book and music services to continue exploring.",
    "audience": "Curious readers, film lovers and music listeners looking for connected discoveries rather than another isolated list.",
    "constraint": "The initial experience should work without accounts or a database. Independent APIs have different formats, availability and artwork coverage, so one failed provider must not empty the whole interface.",
    "decisions": [
      {
        "title": "Ask what someone loved.",
        "why": "The soundtrack, visual world and story of a film point to different kinds of discovery.",
        "how": "A taste-choice dialog narrows theme and catalogue queries. Results explain whether the connection is editorial, thematic or a metadata match.",
        "path": "dist/app.js"
      },
      {
        "title": "Make collecting feel personal.",
        "why": "A generic favourites list is easy to forget; a named collection gives people a reason to return and share.",
        "how": "Save a universe locally, mark items watched/read/listened, calculate exploration progress and export a 1080 × 1350 canvas taste card.",
        "path": "dist/app.js"
      },
      {
        "title": "A failed cover should still look intentional.",
        "why": "Cross-provider results have uneven artwork, and cultural discovery depends on a readable visual rhythm.",
        "how": "Provider-host image validation and original typographic cover fallbacks preserve titles and hierarchy. Featured threads use manual, swipe and keyboard controls.",
        "path": "dist/app.js"
      }
    ],
    "flows": [
      {
        "label": "Catalogue search",
        "title": "Four independent requests. One readable result set.",
        "steps": [
          {
            "title": "Start a query",
            "body": "Bound and clean the input, create a request generation and show loading feedback. A short client-side pacing window reduces accidental repeated searches.",
            "path": "dist/app.js"
          },
          {
            "title": "Fan out",
            "body": "Search Open Library books, TVmaze television, Apple movies and Apple albums concurrently with Promise.allSettled. Requests have timeouts; Apple uses a cleaned-up JSONP callback.",
            "path": "dist/app.js"
          },
          {
            "title": "Normalise",
            "body": "Provider-specific adapters produce a shared record with ID, title, creator, type, source, artwork, URL and a connection reason. Results are interleaved and deduplicated by ID.",
            "path": "dist/app.js"
          },
          {
            "title": "Render what survived",
            "body": "Discard stale generations so an older response cannot overwrite the current query. Cache successful requests and show partial results with an explicit unavailable-source message.",
            "path": "dist/app.js"
          }
        ]
      },
      {
        "label": "Save & share",
        "title": "A universe can travel without a user account.",
        "steps": [
          {
            "title": "Collect locally",
            "body": "Save up to 60 normalised discoveries in local storage. Item state and a bounded custom name persist on this browser.",
            "path": "dist/app.js"
          },
          {
            "title": "Track exploration",
            "body": "A separate set marks items watched, read or listened to. Board statistics reflect the actual saved and explored state.",
            "path": "dist/app.js"
          },
          {
            "title": "Share a snapshot",
            "body": "Serialize up to 30 saved items into a UTF-8/base64 URL fragment. The recipient receives a snapshot, not a live collaborative board.",
            "path": "dist/app.js"
          },
          {
            "title": "Validate the import",
            "body": "Incoming records are length-bounded and normalised. Provider links and images are allowlisted, and provider text is escaped before rendering.",
            "path": "tests/functional.cjs"
          }
        ]
      }
    ],
    "integrations": [
      [
        "Open Library",
        "Book search, authors, subject metadata and covers.",
        "The adapter requests a small field set and produces the common discovery record."
      ],
      [
        "TVmaze",
        "Television search and show metadata.",
        "HTML summaries are stripped; source links and image hosts are validated."
      ],
      [
        "Apple Search API",
        "Movie and album discovery via JSONP.",
        "Unique callback names, script cleanup and timeouts handle the transport; the current query uses the US storefront."
      ],
      [
        "Firecrawl",
        "A server-side companion-source route for featured titles.",
        "Allowlisted seed IDs constrain searches. The route returns up to three HTTPS links with CDN caching and a safe unavailable response."
      ],
      [
        "Browser APIs",
        "Local storage, Canvas export, Web Share and clipboard.",
        "No account or cloud board sync. Shared links expose their snapshot to people who receive them."
      ]
    ],
    "challenge": {
      "title": "Different providers should not dictate the product’s reliability.",
      "body": "A film request can fail while book results succeed. Meanwhile, someone can submit another search before the first one returns.",
      "resolution": "I used allSettled for partial success, request generations for stale-response protection, in-memory caching and provider adapters that reduce different payloads to one view model.",
      "path": "dist/app.js"
    },
    "quality": [
      {
        "title": "Functional checks cover the real interaction code.",
        "body": "The test suite executes app.js in a simulated browser environment and checks saving, removal, filtering, taste-card drawing, board progress and snapshot sharing/import.",
        "path": "tests/functional.cjs"
      },
      {
        "title": "Failure and hostile inputs are exercised.",
        "body": "Tests cover partial API failure, rejected javascript links, disallowed image hosts, length limits and escaped provider text. These checks are not a substitute for a full browser visual suite.",
        "path": "tests/functional.cjs"
      },
      {
        "title": "The recommendation claim stays precise.",
        "body": "Current connections use editorial themes, a person’s chosen facet and catalogue metadata. There is no embedding recommender or trained personalisation model in the audited repository.",
        "path": "README.md"
      }
    ],
    "outcome": "The live product offers cross-media discovery, local collecting and shareable taste cards. The audited repository uses lightweight browser JavaScript, not a React application. The portfolio case study uses React and Motion; that presentation stack is separate from the product’s implementation.",
    "next": "Measure whether visitors follow a thread, save a result and return to their collection. Validate the quality of theme matches and Apple result coverage before adding account sync or a more complex recommendation model.",
    "screens": [
      {
        "file": "rabbithole-home",
        "label": "A starting point for curiosity",
        "note": "The featured thread introduces a theme while the catalogue separates Watch, Read and Listen.",
        "url": "https://rabbithole-sand.vercel.app"
      },
      {
        "file": "rabbithole-detail",
        "label": "The connection behind the pick",
        "note": "A result’s detail explains its source and provides a path into the next discovery.",
        "url": "https://rabbithole-sand.vercel.app"
      }
    ],
    "sources": [
      "dist/app.js",
      "dist/api/inspiration.js",
      "tests/functional.cjs",
      "README.md"
    ]
  }
] as const;
