# ALLEX website

Temporary live website: https://allexdesignltd-preview.netlify.app

GitHub continuous deployment is connected to `codex/netlify-deployment`. Commit changes in this local project and run `git push`; Netlify builds and publishes that branch automatically. Build settings are in `netlify.toml`. Mail credentials are stored in Netlify environment settings and the ignored local `.env`, never in the repository. Keep the temporary site separate from the official domain until the planned hosting replacement. Use `npm run build:official` for that later move.

One React + Vite application, with a Netlify Function using Nodemailer and Gmail SMTP. No separate static JavaScript application.

## Local development

Use Node.js 22.12+ (or a supported newer release).

```
npm install
npm run dev
npm run test
npm run build
```

Local npm run dev now also provides a loopback-only contact endpoint using scripts/local-contact.mjs and the existing Netlify mail handler. Server credentials are loaded from the ignored .env file and are never defined as VITE_* variables. ALLOWED_ORIGINS must include the exact local origin. Netlify CLI remains an alternative for platform integration. Static production hosting still needs a compatible backend deployment; the Vite adapter is development-only.

## Content

Furniture search accepts English and Bengali product names and combines with collection-group filters. Empty results offer a reset control; live result counts are announced to assistive technology. Product photos and View details open a native keyboard-accessible dialog with a larger original image, source link and enquiry action. Product enquiry closes the detail dialog before opening contact, so dialogs do not stack. Search and popup interactions require no Gmail credentials or database.

## English-only website and SEO

Night mode is controlled by the moon/sun button beside the language switch. It follows `prefers-color-scheme` until a visitor chooses light/dark, saves `allex-theme` when storage is available, and synchronizes choices across tabs. `public/theme-init.js` sets the theme before styles load, while `src/components/ThemeToggle.jsx` manages the accessible control and cleans up listeners. The coordinated dark palette is in `src/styles/night.css`; photography is kept in its original colours. To return to automatic device mode, remove only the `allex-theme` preference from browser storage. Language, enquiry inputs and attachments are preserved when toggling.

The website is English only. The navbar language switch, Bengali copy and Bengali font assets were removed at the owner's request. Old `/bn/` links redirect to `/`; unknown URLs still return 404. The project, FAQ, contact and product interfaces all use English. Existing source images and original client logos are retained.

`npm run build` creates the prerendered English homepage, SEO/social metadata, Organization data, robots.txt, sitemap.xml, 404 page and hosting redirect rules. Show more project content remains in the initial HTML.

Set public build variable `VITE_SITE_URL` to the final site origin (no path). It defaults to https://www.allexdesign.com, the confirmed domain of the replacement website. Hosting-generated URL variables do not change the canonical domain. An explicit VITE_SITE_URL override is available only for a deliberate domain change. This public variable contains no credentials. Preview the production build with `npm run preview` to inspect prerendered HTML. After deployment, verify both language URLs and use Facebook Sharing Debugger to refresh cached previews. Search ranking and WhatsApp/Facebook cached previews require a live crawl; local validation does not establish indexing or cache refresh.

See `CONTENT-REPLACEMENT-GUIDE.md`. About, Goal, Vision and service labels are based on the reference website. Projects contain only its nine original YouTube embeds in source order. The supplied hero image still requires attribution approval. No company metrics, extra projects or categories have been invented.

## Replacing the existing website on its current domain

The new interface fully replaces the old website at https://www.allexdesign.com on the existing hosting. It is not an additional interface alongside WordPress. The hosting server type is not yet confirmed. See SAME-DOMAIN-REPLACEMENT.md for the prepared build files, hosting-specific routing, backup/switch procedure and pending backend setup. Do not upload source files or server secrets to the public web root.

## Optional Netlify deployment and email setup

1. Connect this repository to Netlify. `netlify.toml` specifies `npm run build`, `dist`, and `netlify/functions`. The build generates exact legacy 301 redirects and bilingual 404 pages; unknown paths do not fall back to the homepage.
2. In Netlify environment settings, set `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_TO_EMAIL`, and `ALLOWED_ORIGINS` for Functions. Allowed origins are exact comma-separated origins without paths or trailing slashes. Include approved deployment preview origins explicitly if needed.
3. Enable Google account 2-Step Verification and create a Google App Password where the account permits it. Some managed accounts and account security policies do not permit App Passwords. Use the app password, never the normal account password. Official instructions: https://support.google.com/accounts/answer/185833 .
4. Redeploy after changing configuration. Submit a real enquiry from the deployed origin to `/.netlify/functions/contact`. Verify receipt in the configured company inbox, check the Reply-To and test validation/failure states.

**Email integration is implemented but not operationally verified.** No SMTP credentials or deployment were supplied. A build and local test do not prove production delivery. The function reports success only after Gmail SMTP accepts the recipient; inbox receipt must still be verified separately.

The function rejects wrong methods, origins, MIME types, oversized bodies, invalid fields, header injection and filled honeypots. It sends plain text, does not log message content and does not expose SMTP errors. Netlify platform rate limiting is configured at five requests per minute per IP/domain; verify enforcement on the deployed Netlify plan/runtime. Do not substitute an in-memory counter across serverless instances. Origin checks alone do not stop bots; monitor abuse and add a server-verified CAPTCHA if needed.

If the service returns 503, check all server variables and allowed origins. For 403, check the exact browser origin. For 502, verify App Password eligibility and sender settings in Netlify without exposing credentials. A network timeout leaves delivery uncertain; check the inbox before retrying.

## Accessibility and effects

The hero alternates its two images every six seconds while visible. Hovering the image does not pause it. Pause/Play and manual image controls work independently; keyboard-visible focus pauses rotation, and reduced-motion preferences disable automatic rotation. Each timer tick checks current page visibility and hero bounds directly, avoiding stale visibility flags after pause/resume.

The final visual/responsive layer is `src/styles/polish.css`. It defines consistent section spacing, readable card typography, equal-height service layouts, coordinated borders and shadows, and a compact navigation menu at widths up to 1100px. On small screens hero actions sit below the original banner rather than over its image lettering. Mobile form fields use 16px text to avoid browser focus zoom. Menu dismissal supports outside click and Escape; scroll reveal runs once and keyboard-focused content stays visible. Layouts were checked at 320, 390, 768, 1024 and 1440px in English/Bengali and light/dark modes, including navigation and contact validation. This is browser layout QA, not a complete assistive-technology audit.

The contact dialog accepts up to three optional JPG/JPEG, PNG, WebP or PDF attachments: 2 MiB per file, 3 MiB combined. Browser selection is checked before FileReader base64 encoding. The server rechecks count, extension, declared MIME, actual decoded byte sizes, canonical base64 and file signatures, sanitizes filenames, and passes buffers directly to Nodemailer. Files are not stored publicly or written to disk. Nodemailer filesystem and URL access are disabled. Total JSON request size is capped at 4.25 MiB, below Netlify's documented buffered payload limit: https://docs.netlify.com/build/functions/configuration/ . Signature validation is not malware scanning; normal inbox attachment protections still apply. Test an actual received email with JPG and PDF after configuring SMTP and deploying. A local mocked transport test proves the attachment bytes are wired correctly, not production delivery.

Native CSS smooth scrolling accounts for the header. Typewriter, particles, counters and scrolling respect reduced motion. Particles are limited to the hero; the decorative cursor ring is limited to the image gallery on desktop fine pointers and retains the native cursor. Scroll progress uses animation frames and a ResizeObserver. Counters run once per visibility and only with finite verified data. Event listeners, timers and observers clean up on unmount. Project videos use lazy-loaded responsive YouTube iframes, each with an accessible title and a link to the original embed URL.

## Verification status

Automated checks cover build and backend validation/error paths. Production email, deployed rate-limit enforcement, visual browser QA and real screen-reader/device testing still require their corresponding environment or manual check. No deployment has been made.

