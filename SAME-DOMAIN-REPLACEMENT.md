# Replace the existing ALLEX website

Confirmed by the owner: this React website will fully replace the old website on the existing domain and hosting. The old interface will no longer be the public homepage. The hosting server/control panel type is not yet known; no remote files, DNS records or hosting settings have been changed.

## Production identity

- Canonical origin: `https://www.allexdesign.com`.
- English-only homepage: `/`. Former `/bn/` and `/bn/index.html` URLs redirect to `/`.
- Social previews, Organization data, robots.txt and sitemap use the same domain.
- Keep `VITE_SITE_URL=https://www.allexdesign.com` for the replacement build. Platform-generated `URL` variables no longer silently change the SEO origin.
- No domain transfer or new domain is required. Keep existing mail and DNS settings when using the same server. Existing HTTPS/www configuration should be checked on the host before launch.

## Prepared output

Run `npm run build`. Upload the **contents** of `dist` to this domain's document root, not a nested `dist` folder. This includes `index.html`, `assets/`, image folders, `404.html`, robots.txt, sitemap.xml and the appropriate routing files. Node/React source, `.env`, project PDFs and server credentials do not belong in the public web root. The compiled frontend is static and does not require WordPress to display.

### Apache hosting

The build generates `dist/.htaccess` with DirectoryIndex, the eleven legacy-page 301 redirects and a local 404 ErrorDocument. The old Bengali pages are no longer generated. Include the root .htaccess dotfile in the upload. They require Apache rewrite support and permission for these directives in `.htaccess`; confirm with the hosting provider. Nginx does not use `.htaccess`. If the host uses LiteSpeed, have the provider confirm its Apache-rule compatibility/settings.

Do not merge the old WordPress front-controller rules into this file. Otherwise unknown paths may still reach the old PHP site instead of the new 404 page. The `[NE]` flag preserves the destination section fragment; these are exact redirects, not a blanket redirect to the homepage. References: [Apache rewrite flags](https://httpd.apache.org/docs/2.4/rewrite/flags.html), [ErrorDocument](https://httpd.apache.org/docs/2.4/mod/core.html#errordocument).

### Netlify or another server

The Netlify configuration remains available as an alternative; it does not require moving hosting. Netlify uses `dist/_redirects` and the generated error pages, not Apache files. If the current host uses Nginx or another server, configure equivalent exact 301 mappings and genuine 404 handling in that server after its type is confirmed. Do not assume uploading `_redirects` to an ordinary shared host activates those rules.

## Switch procedure once hosting access is available

1. Back up the existing public website files and WordPress database outside the live web root; keep a restorable copy of its server configuration.
2. Identify this domain's actual document root and server type. Preserve domain-validation files, mail-related settings and needed original `/wp-content/uploads/` files so existing indexed image URLs do not break. Do not delete the entire hosting account or unrelated hosted sites.
3. Preview the new build privately on the host if supported. Prepare the routing for that server and confirm the default homepage serves `index.html`.
4. Switch the live document root/content to the new build. Remove the old public WordPress entry points and conflicting rewrite rules from the serving path after backup; retaining them publicly can leave old interfaces accessible. Keep the necessary legacy media as static files. Upload routing dotfiles deliberately.
5. Clear the old page cache, hosting/CDN cache and any existing service-worker cache if applicable.
6. Check the English homepage (200), retired Bengali homepage redirects (301), a random URL (404), old-page redirect (301), destination section, product links and WhatsApp. Check HTTPS and www normalization on the actual server. The new interface should appear at the existing domain with no old homepage remaining.
7. Resubmit the existing-domain sitemap in Search Console; use historical indexed-page exports/logs to supplement the eleven identified legacy mappings. This is a same-domain redesign, so a domain change-of-address request is not needed.

## Contact backend remains a separate pending setup

Gmail SMTP credentials are now configured locally in the ignored .env file; storage remains deferred. One local contact-endpoint test email was accepted by Gmail. Production hosting still requires its own secure configuration. The current mail handler is a Netlify Function at `/.netlify/functions/contact`. Uploading static files to Apache/Nginx does not execute that handler. Once the hosting capabilities are confirmed, deploy a compatible server endpoint or configure a supported function service before claiming form-email delivery. Keep credentials server-side. Product and consultation WhatsApp enquiry links can continue independently of the email backend. No PHP backend or email service migration has been silently introduced.

## Verification limits

The production build and automated tests validate generated output, canonical identity, redirect mappings and local navigation handling. Apache configuration is generated from the same mapping and checked in tests; an Apache process/live host has not been exercised in this session. Activation and server response verification await the hosting information and access.
