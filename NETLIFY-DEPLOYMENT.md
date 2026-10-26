# Temporary Netlify hosting, then official hosting

The same English-only React website can run on a temporary Netlify address now and move to the existing official domain later. No database or Netlify-only frontend data store is introduced. Project/product images, data and the FAQ stay in the project.

## Temporary Netlify setup

Use a Netlify **Free** team/site and the automatically supplied `*.netlify.app` address. Do not attach or transfer `allexdesign.com` yet. Do not enable a paid upgrade, auto recharge or optional paid add-ons. Netlify currently lists Free at $0 with a hard usage limit; exceeding it can pause the site. [Pricing](https://www.netlify.com/pricing/).

The included `netlify.toml` sets:

- Build command: `npm run build:netlify`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Build Node version: 22

Netlify supplies its actual site URL to the build. Temporary builds use that address for canonical/social URLs and send `noindex,follow` through HTML and the `_headers` file. The official website's domain stays unchanged. Do not submit the temporary site to Search Console as the official website.

## Deploy with the CLI (recommended for the email form)

From the original project directory:

On Windows, `NETLIFY-DEPLOY.ps1` automates login, initial site creation, private mail-setting import and the build/deploy. Run it from PowerShell with `powershell -File .\NETLIFY-DEPLOY.ps1`. Select your Free team in the prompts. It imports only the three mail keys from your existing ignored `.env`, keeps their values out of command arguments/output, then removes its private temporary import file. The source upload package intentionally contains no `.env`; configure it privately if using the script from an extracted source copy.

1. Run `npx netlify-cli@27.14.2 login` and approve the CLI in your own Netlify account. Do not send account passwords or access tokens in chat.
2. Run `npx netlify-cli@27.14.2 deploy --build --prod`. Choose to create a new site on your Free team if prompted. This deploys the frontend **and** builds the mail function. A Git repository is not required for this route.
3. In that site's environment-variable settings, set `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `CONTACT_TO_EMAIL` using the values from your private local settings. Do not put these values in the public folder or prefix them with `VITE_`. Free accounts may expose variables to all scopes; they remain server-side because no client code reads these keys. On plans supporting scopes, include Functions. Redeploy after changing server variables.
4. The handler automatically accepts the exact read-only Netlify `URL` when `SITE_ID` is supplied. It does not trust arbitrary `*.netlify.app` origins. Your optional explicit `ALLOWED_ORIGINS` list can still include approved local/official origins.
5. Open the returned site URL. Test its homepage, navigation, image hover, Show more, FAQ, product enquiry, 404 and the actual contact form. Gmail acceptance does not prove inbox placement; check Inbox/Spam as well.

The CLI package requires Node 22.13 or newer; Node 22 is configured for cloud builds. [CLI authentication](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/), [function variables](https://docs.netlify.com/build/functions/environment-variables/).

## Upload package

`npm run prepare:release` creates a dated folder under `deployment` and records the newest one in `deployment/latest-release.json`. The `netlify-source` folder contains only allowlisted source/assets/config/tests; it excludes `.env`, installed dependencies, account state, QA scripts, screenshots and office PDFs. Keep the original project and private `.env` on your computer.

You may upload the sanitized source through Netlify's logged-in project/build upload flow if it offers framework builds, or connect it through a private Git repository. Confirm Netlify runs the build command and deploys the function. [Netlify's supported upload methods](https://docs.netlify.com/deploy/create-deploys/).

Dragging only a prebuilt `dist` folder publishes static files; it does not by itself establish a working mail-function deployment. WhatsApp links work independently, but do not assume email works until a live submission succeeds.

## Updates

For this manually deployed site, make changes in the original project and run the same CLI deploy against the linked site. Do not create a new site for each update. The `.netlify` local link is ignored by Git and excluded from release archives. If using a Git-connected site instead, pushes to the chosen branch can trigger builds.

## Move to the official hosting later

1. Keep a copy of the source and the existing official site/database backup. Confirm the destination server type and document root.
2. Run `npm run build:official`. This restores `https://www.allexdesign.com`, indexable metadata and the official sitemap; temporary Netlify noindex headers are not emitted.
3. Upload the contents of `dist` to the existing domain's web root. Apache redirects and the 404 ErrorDocument are included in `.htaccess`; other servers need equivalent routing. Do not retain conflicting old WordPress front-controller rules.
4. Migrate the mail endpoint/secrets to a backend supported by that host. The temporary Netlify Function cannot be executed by static Apache files. Alternatively, deliberately retain the function service and configure a supported proxy; do not silently assume a cross-origin request will work.
5. Check official URLs, redirects, email and WhatsApp. Only after the official site is verified should you delete/unpublish the temporary Netlify project from its settings. Keep local files/backups. Removing Netlify does not remove your local project or your current domain hosting.

See `SAME-DOMAIN-REPLACEMENT.md` for the same-domain replacement procedure. The exact source and build outputs can be rebuilt without Netlify CLI for an ordinary static host. No remote website has been published merely by preparing these files.
