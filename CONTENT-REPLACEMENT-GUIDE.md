# Content replacement guide

All bracketed markers require approved content. Do not remove a marker by inventing company facts.

## Furniture browser and product popup

Each item in `src/data/furniture.js` has an editorial `group` for filtering: Chairs, Sofas, Tables & storage, or Lighting. These groups describe the existing item names; they do not replace the furniture website's official categories or imply new stock. English/Bengali search combines product names and groups in `src/data/filterFurniture.js`. Update both language labels in `src/i18n/bn.js` when adding a group or product.

Card images and View details open the native product dialog in `src/sections/Furniture.jsx`. It uses the existing image, name, group and official source link, with an enquiry button that closes this popup before opening the existing contact form. No prices, dimensions, materials, extra photos or stock claims are invented. Add verified specifications to the data layer before showing them. Product browser styling is in `src/styles/product-browser.css`; invalid images fall back to a visible text label. Product cards stay visible when filtering even after the page's scroll-reveal observer has initialized.

## Layout polish

`src/styles/polish.css` is the final shared layout layer after all section/theme styles. Keep spacing, card radii, typography and the 1100px compact-menu breakpoint consistent when adding content. Image dimensions and aspect ratios reserve space; service descriptions can expand naturally in both languages. No company claims or project URLs were changed during the responsive polish.

## AD Steel official website integration — 2026-10-14

Official content was retrieved from https://www.adsteel.co/ , https://www.adsteel.co/our-services/ and https://www.adsteel.co/steel-structure-projects/ . Construction-service summaries and source URLs are in `src/data/adsteel.js`. The detail block inside Services is in `src/sections/AdSteel.jsx`; its style is in `src/styles/adsteel.css` and supports both themes. Bengali translations are in `src/i18n/bn.js`.

The official Steel Structure Projects page identifies Pathao Central House as designed and built by AD Steel & Construction Company. Three images copied from that page are in `public/adsteel/pathao-1.jpeg` through `pathao-3.jpeg`; exact source URLs are stored with the image records. The AD Steel service card now uses the first official project photo instead of the previous illustrative stock image. Logo source: https://www.adsteel.co/wp-content/uploads/2026/09/adsteel.png . Images are linked to the official project page, not unrelated external galleries.

No additional project video was inserted into the existing nine-video gallery. No company statistic, certification, project date, budget, engineering specification or delivery promise was inferred. The RCC and warehouse project pages were inspected but contained no substantive project details; no project claims were derived from those empty pages. Site HTML used for inspection is ignored under `.tmp-adsteel/`. Construction enquiries open the existing contact form; credentials and data storage remain deferred.

## Night mode

`src/styles/night.css` holds the coordinated dark palette for all sections, cards, labels, buttons, navigation, feedback, contact popup, uploads and mobile quick contact. Adjust its `--paper`, `--stone`, `--ink`, `--muted`, `--brass` and `--night-border` tokens together. The moon/sun control is in `src/components/ThemeToggle.jsx`, with English/Bengali accessible labels. `public/theme-init.js` applies the saved or device theme before first paint; avoid moving it after the application script. Photography and social preview assets retain original colours. Theme preference is local to the browser and requires no database.

## Language and sharing content

Bengali translations are maintained in `src/i18n/bn.js` beside the English copy in the existing data/components. When editing English text, update its translation key and Bengali text together. Company/service information, furniture copy, UI controls, validation and accessibility labels are translated; original proper names and video titles stay intact. Original hero image lettering is English and cannot change through a text switch.

Localized search/social titles and descriptions are in `shared/seo.js`. Replace `public/social-preview.jpeg` and `public/brand-logo.png` to update sharing assets. Set `VITE_SITE_URL` at build time to the verified final domain. English and Bengali pages are generated from the same React components by `scripts/generate-pages.mjs`; do not create a separate static app. Gmail and data storage remain deferred.

## Contact attachments

The Let's talk dialog accepts optional JPG/JPEG, PNG, WebP and PDF files. Limits are shared in `shared/attachments.js`: three files, 2 MiB per file, 3 MiB total. Frontend selection and removal are in `src/sections/Contact.jsx`. Server-side signature, base64, filename and size checks plus Nodemailer attachment delivery are in `netlify/functions/contact.js`. Attachments are email buffers, not public uploads or stored assets. SMTP/deployment settings remain required; production receipt must be verified after configuration.

## ALLEX Furniture integration — 2026-10-14

### Our Clients Say

The Furniture section includes three testimonial summaries in `src/data/furniture.js`, `testimonials`. Names and roles come from the source homepage Our Clients Say section. The second and third original reviews explicitly concern website work; this context is retained on the cards. Summaries are paraphrases, not direct quotes or verified furniture-delivery endorsements. The original avatars were Elementor placeholders, so initials are displayed instead. No stars, ratings or new endorsements were added. A link lets visitors read the original website section.

`src/data/furniture.js` contains eight furniture/lighting item names, their original product-page links, image-source URLs, source-based mission/vision summaries and the category names listed in the furniture site's navigation. `src/sections/Furniture.jsx` displays this collection between Services and Project Films. Each enquiry opens the existing contact dialog with the product name as subject. The main navigation and custom furniture service link to this section.

Eight original 600px product images and the original furniture logo are stored in `public/furniture/`. These are the furniture site's displayed catalogue visuals; they do not establish current stock, specifications or manufacturing provenance. The custom furniture service now uses its Light Brown Sofa image. Replace assets and metadata together after catalogue updates. Image failures show an accessible text fallback.

Source: https://www.allexfurniturebd.com/ and its `/product/<slug>/` pages. Exact image URLs and product URLs are stored beside each item in `src/data/furniture.js`. Homepage HTML retrieved for inspection is ignored under `.tmp-furniture/`.

The source contains sample WooCommerce SKUs, clothing grouped under furniture products, placeholder Latin descriptions, questionable prices, unrelated website-design testimonials and a placeholder-looking phone number. These were excluded. No furniture prices, stock levels, material specifications, additional statistics, delivery promises, reviews or checkout were imported. Mission and Vision are concise paraphrases of the furniture homepage statements. The current ALLEX Design contact details and nine project videos remain unchanged.

| Content | Location | Required action |
| --- | --- | --- |
| Home, About Us & Services | `src/App.jsx`, `src/data/content.js` | Navigation and section copy use official-site and public Facebook information. Edit copy in `content.js`; source URLs and review date are stored in `sources`. |
| Hero animated phrases | `src/data/content.js`, `phrases` | Based on interior, furniture and development capabilities on the reference website. |
| Services | `src/data/content.js`, `services` | Source-based service labels; update when the company offering changes. |
| Company statistics | `src/data/content.js`, `statistics` | The official homepage reports 500+ completed projects. Re-verify before changing this number. |
| Project videos | `src/data/projects.json` | Contains only the nine original homepage YouTube embed URLs, in source order, including query parameters. Do not add invented projects or metadata. |
| Supplied images | `images/01.jpg`, `02.jpg`, `03.jpg`, `ad-steel-structure.jpg` | `01.jpg` is used for the hero; `02.jpg` and `03.jpg` are illustrative service visuals, not attributed as verified ALLEX projects. The AD Steel card uses a CC0 steel-frame photo from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Steel_frame_structure.jpg), not a verified ALLEX project. Project cards use reference YouTube embeds exclusively. |
| Hero slideshow | `src/components/HeroSlideshow.jsx` | Two rotating official homepage banner images, downloaded from the URLs below; review image rights/approval before publishing. |
| Logo | `images/Company_Logo.png` | Supplied logo; confirm this is the final approved asset. |
| Contact details | `src/data/content.js`, `contact` | Verified address, click-to-call, click-to-email, WhatsApp and a Google Maps search link; confirm before changing. |
| Social profiles | `src/data/content.js`, `socialLinks` | Facebook, YouTube and Instagram profile URLs checked against the official website homepage on 2026-10-13. |
| Email delivery settings | Netlify environment settings | Add a verified sender, recipient, Google App Password and exact allowed site origins. Never use `VITE_` variables for these. |

Before publication, review `src/App.jsx` editorial headings and service descriptions for brand approval. Project videos match the original homepage links. Interior service visuals are supplied images and are not presented as ALLEX project photography; the AD Steel thumbnail is illustrative and not a completed ALLEX project. Hero banner images are copied from the official ALLEX website and require approval for reuse.

The project section has no image cards. Embedded videos include a link to the same YouTube URL for opening outside the page. Search `src` for `ADD`, `REPLACE`, `PENDING`, `pending`, and `PREVIEW` to locate outstanding content.

## Reference content used

Reviewed on 2026-10-14. The About Us section is a concise paraphrase of https://www.allexdesign.com/about-us/ and the homepage Who We Are and How We Work sections. Services are summarized from the homepage and public Facebook page https://www.facebook.com/TheAllexDesign. The homepage reports 500+ completed projects and describes an architect/design team, Allex Furniture in-house manufacturing, after-sales service, and item-dependent 1-to-5-year warranties. AD Steel details reflect company information previously supplied by the user; they are not attributed to the current homepage text. Copy is paraphrased, not an exact transcription. Project attribution and image caveats remain unchanged.


## Project video source and theme
The nine iframe URLs were extracted from https://www.allexdesign.com/ on 2026-10-13 and preserved exactly. External playback availability could not be verified by the web fetch tool. The off-white interior design theme is in src/styles/theme.css.

## Hero slideshow sources
- `images/allex-home-slide-001.jpeg`: https://www.allexdesign.com/wp-content/uploads/2026/09/Slide-001.jpeg
- `images/allex-home-slide-002.jpeg`: https://www.allexdesign.com/wp-content/uploads/2026/09/Slide-002.jpeg

### Chair collection update (2026-10-15)
The three lamp cards were removed. The collection now has six items, including the official homepage feature “Presidential Chair — MODEL-AFR-500”. Its original image is saved as `public/furniture/presidential-chair-afr-500.png`; its source link points to the official homepage because no individual product page is published. Other chair categories currently have no listed products; add further chairs only when verified photos and names are supplied.
Reference seating added from the user-provided project sheet: visitor chair with SS base/rexine, 27-inch Food Chemistry stool, 18-inch Food Microbiology stool, lab assistant chair. External reference images are attributed in each popup, not presented as ALLEX product photos. Both stool options share a style reference; the image does not certify either exact height. Sources: Partex Visitor Chair I001, Paragon Medical stainless-steel stools, SK Grill Art stainless-steel/rexine visitor chair. Replace with ALLEX product photos when available. No quantities, price, stock or ambiguous handwritten values were imported.
Curated update: eight items. Added comparable AF-800 executive and AF-15 compact mesh styles from the user sheet (not exact model photos); external sources are linked in details. Removed generic Office Chair, Presidential AFR-500, nightstand; consolidated 18/27-inch stools into one selectable enquiry item. Original assets remain available for future replacement. AF-815 was not selected.

### Compact furniture showcase and transparent assets
Home shows four selected sample products. Show more reveals the full collection, split into category sections with search/filter; Show less collapses it. Cabinet, Office Desk and Steel Almirah are illustrative design samples, explicitly labelled in cards and details. They do not claim verified stock, model specifications or prices.
Built-in imagegen was used for five background-extraction edits and three new design samples. Edit prompt: remove only the background, preserve the whole product geometry/material/color/pose, genuine transparent alpha, no room/floor/cast shadow/text. New sample prompts: isolated three-quarter product photo of a pale-oak two-door office cabinet; walnut/black-frame office desk with drawer pedestal; light-grey tall two-door steel almirah. Genuine transparency, no props/logos/text/shadow. Original PNG masters and formatted WebP derivatives are stored in public/furniture; source references remain in data and existing photo-source links.

### AD Steel reference structures and board almirah (2026-10-15)
Added four real-photo reference cards: sports turf (Ormiis Sports Time Up Turf), warehouse and multi-storey frame (SteelCraft PEB), residential light steel framing (Marius Rotar / Unic Rotarex on Wikimedia Commons, CC BY-SA 4.0; license and changes credited on card). These are explicitly external reference projects, not AD Steel completed works. Pathao Central House retains its official project status. AD Steel source pages for other projects currently provide no project photo details.
Replaced Steel Almirah with Board Almirah in both sample view and full collection. Built-in imagegen prompt: isolated realistic two-door laminated-board wardrobe in natural medium oak, clean Otobi-inspired contemporary styling, small dark handles, plinth, three-quarter view, genuine transparent alpha, no room/props/shadows/logo/text. This is a custom design sample, not an Otobi-branded product. Master public/furniture/board-almirah-sample.png and transparent WebP derivative are saved locally.
Photo correction: sports reference now uses the real Butler Accelerate Sports indoor turf photo with visible exposed steel roof beams and metal decking. Warehouse reference now uses SteelCraft PEB completed factory photo with steel-clad walls/roof and exposed adjoining frame. Both remain attributed external reference projects; styles and dimensions are unchanged.

### Client logos (2026-10-15)
The user-provided client brochure authorizes the displayed company relationships. The user identified the yellow circular emblem beside Aristopharma as Bangladesh Jatiya Sangsad. A selected set of 28 client brands is displayed after Projects: 12 featured logos initially, with Show all clients for the remainder. Other brochure logos are not silently guessed or fabricated; two small crests near PharmaSolutions remain unidentified.
Logo files are stored in public/clients; individual names, source URLs and available license metadata are preserved in src/data/clients.js and public/clients/sources.json. Official website assets are preferred; several published Wikimedia versions were used where official assets were unavailable. Parliament and Daraz attribution/license links are visible below the section. Full brand colors are retained without generated/redrawn logos. White CarryBee/Transcom/Presidency wordmarks receive a dark card for readability. Broken images fall back to the actual organization name. The previous ALLEX website client image was a Lorem Ipsum placeholder and was excluded.
Current brand versions may differ from the older printed brochure (e.g. Pepsi and Bikroy). No new testimonial, endorsement, project detail or company statistic is inferred from the logo list.

United Hospital, CarryBee and Steadfast Courier were explicitly added by the user. United Hospital retains the brochure-era identity requested by the user; its published logo is sourced from Seeklogo. CarryBee uses its official transparent PNG, and Steadfast uses its official SVG paths with the original light-theme brand fills embedded for standalone rendering.

### Interior project portfolio
The Interior Projects section is populated from src/data/interior-projects.js. Append projects in the order supplied by the user; numbering is automatic. First entry: National Parliament House, North Plaza office modernization/renovation, transcribed from the user's brochure. The two exterior submissions are near duplicates, so only IMG_20261015_105403.jpg is displayed. IMG_20261015_105535.jpg is displayed with a CSS clockwise rotation. Original brochure photographs are retained without invented restoration details or AI-generated replacement interiors; clicking opens the source. Printed-page glare and folds remain visible. Do not attribute the Parliament's original architecture or entire construction to ALLEX. Add future company descriptions only from supplied material.

### FAQ assistant
Prepared bilingual FAQ answers and matching keywords live in src/data/faq.js. No AI API, server calls, database or paid chatbot service is used. Chat history stays in component memory only (up to 20 exchanges) and resets on reload. Maintain answers when company information changes. Prices, stock and delivery dates are referred to the team. Unknown questions receive a WhatsApp referral.


### Clear AD Steel client sheet — 15 October 2026
Added 21 individually sourced logos from the clearer user-supplied client sheet; total 49 unique clients. The user confirmed Wood Tech Solution and Civil Aviation Authority of Bangladesh. Existing Pathao and GPH brand repeats were not duplicated. Official company assets and published Wikipedia logo versions are recorded in public/clients/sources.json. Jheel Maestria and GPH white marks receive dark backing plates. No entire brochure was copied into public assets. Pending clear standalone assets: Fair Electronics, Snowtex, Team Pharmaceuticals, Wizcraft, MBEC and Progress Motors. Their identities are not replaced by unrelated company logos.

## Interior portfolio (October 2026)
Six selected projects from the user-supplied Interior Profile PDF: National Parliament House, Dot Birth, Bateel, BRAC IT, PepsiCo and Pathao. Original embedded images are extracted into public/interior-projects/selected as optimized WebP; no AI-generated image details. Per-project PDF page references are in sources.json there. The collection shows three projects initially, with six available through Explore all. English/Bengali copy is in src/data/interior-projects.js. Portfolio visuals may include design renderings; do not relabel all as completed-site photographs. Services > Interior design links to this section.

## AD Steel portfolio replacement
External reference project cards have been replaced with Pathao Central Warehouse, Padma Railway Base Camp, Transcom Electronics and Tajmuk Packaging Factory from the user-supplied 2026 AD Steel PDF. Eight original extracted WebP assets and page references are in public/adsteel/portfolio. Bilingual project descriptions are in src/data/steel-projects.js. Pathao and Transcom area figures are sourced from PDF pages 14/22 and 22 respectively. No external sample photos are rendered by AdSteel.jsx.

AD Steel also includes GPH International School and Idris Ali Madbor Institute (profile page 18; institute scope on page 22). Their portfolio images are explicitly labelled design visualizations. Interior collection button now reads Show more / আরও দেখুন.

The GPH International School and Idris Ali Madbor Institute cards have been removed from the active steel collection at the user's request. Four projects remain displayed.

Service card imagery: Interior design remains unchanged. Custom furniture uses the ALLEX workshop image from Interior Profile PDF page 90; Construction uses the framework photo from AD Steel Profile page 15; AD Steel uses the warehouse roof/storage interior from page 16. Optimized WebP assets are in public/services; these three images are not reused in project cards.

## Performance pass - 25 October 2026
Same design, fonts and visible effects retained. Original image files remain available; responsive derivatives of the same hero and interior service photos live in public/media. Cover-aware hero source sizes preserve image sharpness. Logo dimensions are in src/data/image-metadata.json; full logo provenance remains in public/clients/sources.json. Reveal runtime is in src/components/reveal-runtime.js and keeps expanded cards registered without rescanning the document on text changes. Glow is prepared only near the viewport, keeps its 7-second/1.5px appearance and preserves paused orbit phase. See PERFORMANCE-REPORT.md and output/performance/results.json for measured results and limitations.

## Mobile usability - 25 October 2026
Responsive fixes live in src/styles/mobile-usability.css. Visual viewport / keyboard handling is in src/components/useMobileViewport.js, with pure geometry in shared/mobile-viewport.js. Desktop styles above the existing mobile/tablet breakpoints are retained. Product model-code spans prevent AF-800 and similar codes from splitting. See MOBILE-USABILITY-CHECK.md for tested viewports and keyboard-simulation limits.

## Main company overview - 25 October 2026 (current behavior)
This update supersedes the earlier collection expansion and gallery-display notes above. The main website introduces three services: Interior design, Custom furniture, and Steel & construction. Their bilingual summaries, ranges, anchors and specialist website destinations are maintained in `src/data/service-directory.js`.

- Interior shows three selected projects with one original cover image per project and an enquiry shortcut. Its separate website is not ready; keep `website: null` until the owner supplies its new URL. Do not link this action back to the main homepage. Project films remain available on this website.
- Furniture shows four samples with details popups and product-specific WhatsApp enquiries. The full collection button opens the official ALLEX Furniture shop. The larger product dataset and original assets remain available, including existing product enquiry links; the main page no longer displays the full search/filter collection or feedback blocks.
- Steel shows the four retained brochure projects with one original image per project. Full information is referred to the AD Steel website, with a main-site consultation shortcut.

The original portfolio datasets and source images are preserved for future updates. Overview layout adjustments are in `src/styles/service-overview.css`; shared glass, glow, reveal, language, theme and mobile behavior remain in place. Production build and 21 automated tests passed. Visual browser verification of this update was unavailable because automatic approval review reported a usage limit.

### Two-image project cards restored
Interior and Steel project cards again display their two original portfolio images using the established gallery layouts and full bilingual project descriptions. This supersedes the one-cover-image and shortened-project-copy notes above; the overview destinations and enquiry actions remain unchanged.

Interior Show more / Show less is restored: three projects initially, all six on expansion, with two original images per project.

### SEO remediation — 25 October 2026
All six Interior projects and all client logos are rendered in the initial English/Bengali HTML; existing buttons toggle their visibility rather than creating their content. Keep the scoped `[hidden]` CSS rules when changing card styles. Image dimensions for service, furniture and steel assets are recorded from the original files in `src/data/image-metadata.json`; update that metadata when replacing files. Legacy URL migrations live in `shared/legacy-redirects.js` and generate `dist/_redirects` during build. Do not restore a blanket homepage rewrite, which would turn missing pages into soft 404s. Error pages are generated from `shared/not-found.js`. See `SEO-REMEDIATION-REPORT.md` for mappings, verification and domain migration limits.

### Confirmed deployment destination
The owner confirmed this website replaces the old interface on the existing allexdesign.com domain and hosting. Hosting type is not yet known. The build now also generates Apache `.htaccess` files from the same legacy mapping, while keeping Netlify routing as an alternative. Canonical origin defaults to https://www.allexdesign.com independently of hosting-generated URL values. See `SAME-DOMAIN-REPLACEMENT.md` before the hosting switch. No remote deployment has occurred; email backend compatibility and credentials remain pending.

### Plain-language copy update — 25 October 2026
Visible company, approach, service, Interior/Steel project, furniture sample, contact and FAQ introduction copy is written in shorter, direct English and Bengali. Project descriptions retain their supplied scope, location and verified size where applicable; sample/reference photo explanations and warranty qualifications remain explicit. No project names, source images, service destinations or company statistics were changed. Maintain the matching entries in src/i18n/bn.js when editing English strings. Service summaries and project descriptions contain both languages in their data files.

### Responsive text alignment — 26 October 2026
The last stylesheet, src/styles/responsive-typography.css, aligns narrative paragraphs with justified text and a natural final line. Headings, field labels, FAQ messages and contact details use their own reading alignment; CTA text is centered. Bengali retains its existing font with extra line height. Responsive rem-based sizes, wrapping and mobile form text avoid fixed-height clipping. Small-screen furniture action buttons stack. Material colors, fonts and animations remain in the original stylesheets. Visual verification on real devices remains pending.

### Dark theme check — 26 October 2026
FAQ input now uses the dark palette with readable placeholder/focus colors. Contact validation borders are protected from glass/select style overrides in both themes, with a lighter error border for dark mode. The mobile consultation work-type select uses 16px text. See DARK-THEME-CHECK.md and output/quality/dark-theme-check.json for browser checks and limits.

### Bengali font — 26 October 2026
The intended Noto Sans Bengali face is now locally hosted in public/fonts with its SIL OFL license and source record. Final typography rules are in src/styles/bengali-typography.css. Bengali generated pages preload it; Latin uses existing DM Sans. Preserve the Bengali Unicode subset and font weights when replacing font files. See BENGALI-FONT-CHECK.md for fourteen light/dark viewport checks and rendered-font verification.

### Local email and image hover — 26 October 2026
Local Gmail SMTP credentials are configured only in the ignored .env file. The local Vite contact adapter reuses the existing streamed mail handler and permits loopback clients only. One real test through the local contact endpoint returned HTTP 200 with SMTP recipient acceptance. Production hosting configuration remains pending. Do not copy .env into dist/public or create VITE-prefixed mail secrets. Project/product image hover rules are in src/styles/image-hover.css: pointer-based image zoom, no layout movement or automatic modal, no hover zoom on touch or reduced-motion settings.

Services navigation uses an inline SVG chevron with rounded strokes. It rotates with the native details open state and retains keyboard/Escape behavior. Mobile/desktop checks passed in both themes.

### English-only website — 26 October 2026 (current requirement)
This supersedes all earlier bilingual/font instructions: the owner requested English only. The language switch, translation dictionary, Bengali project/service/FAQ copy and local Bengali font files are removed. The provider now pins English and clears old language preferences. Old /bn/ URLs redirect to the English root; Bengali alternate metadata and sitemap entries are gone. Original logos and photography are retained. Card alignment and the compact header are in src/styles/english-layout.css. Existing hover, glass, glow and theme behavior remain.

English-only verification: production build and 26 automated tests passed. Browser checks in light/dark themes at 320, 390, 768 and 1366px passed for English text, language-switch absence, old language preference reset, /bn/ redirect, project Show more, FAQ and consultation dialog. No horizontal overflow or page JavaScript errors were captured. Detailed results: output/quality/english-only-check.json.
