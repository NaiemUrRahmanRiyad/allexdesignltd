# Mobile usability and production performance audit

Date: 28 October 2026. Production build served locally in Chrome; Lighthouse 13.6.0.

## Verified flows

- 320×568, 390×844, 844×390 landscape and 1366×900, in light and dark themes: navigation/dropdown, FAQ topics and message field, contact validation, product popup and horizontal overflow. Eight combinations passed without runtime errors.
- Simulated visual-viewport keyboard opening on the two narrow phone sizes: FAQ send area and contact dialog stayed within the available viewport. This is browser simulation, not physical iOS/Android keyboard testing.
- Consultation form with work type, location, budget, preferred date/time and a real PNG attachment: encoded request and success UI passed against an intercepted test response. No email was sent. SMTP delivery was not retested.
- Interior/Steel photo navigation and keyboard controls were previously verified on the same component revision; this audit does not restore removed zoom controls.
- All 29 automated tests passed. Light/dark background seams and mobile overflow were checked after rendering changes.

## Fixes

1. Made the logo link's accessible name match its visible company name.
2. Added the correct group role to labelled video project details.
3. Replaced page-height botanical SVG masks with reusable transparent WebP tiles rendered from the same code-native artwork. Existing sizes, colours, opacity, grid, card styles and animations remain. Only the displayed theme/device tile is requested (about 27–40 KB).

## Lighthouse observations

Final simulated-mobile run: Performance **74**, Accessibility **100**, Best Practices **100**, LCP **4.4 s**, TBT **440 ms**, CLS **0**. Earlier runs ranged from 63–87 with host/load and implementation variations; the lowest intermediate result is retained in the raw diagnostics rather than omitted. The final mobile score still needs improvement and is not a guarantee of smoothness on every phone.

Final desktop: Performance **99**, Accessibility **100**, Best Practices **100**, LCP **0.8 s**, TBT **0 ms**, CLS **0**. Details are recorded in `output/quality/final-audit-desktop-tiles.json`. Raw reports and browser checks are local QA artifacts, excluded from deployment.

The temporary Netlify preview is intentionally noindex, so a public-search SEO score/ranking is not asserted.

## Scroll measurement

A deliberately fast six-second full-page down/up sweep, unthrottled headless Chrome on this computer:

| Viewport | Before median frame | Final median frame | Final p95 frame | JavaScript long tasks |
| --- | ---: | ---: | ---: | ---: |
| 390px | 100 ms | 33.3 ms | 100 ms | 0 |
| 1366px | 100.2 ms | 50 ms | 100.6 ms | 0 |

Removing botanical layers temporarily in a diagnostic browser improved frame timing substantially, identifying the tall vector masks as a rendering bottleneck. The shipped implementation retains the decoration and reduces that cost. The aggressive sweep still misses 60fps; these measurements are not physical-phone FPS or field Core Web Vitals.

## Remaining opportunities

- Large Home JPEGs remain the main mobile loading opportunity. Native-resolution modern image encodings could reduce transfer while preserving the original photos; do not replace them with fabricated architectural detail or lower-resolution copies just to improve a score.
- Glass blur, repeating card effects and the continuous grid retain rendering cost. Further visible changes to these effects should be agreed with the owner.
- Test a physical iPhone and Android phone, especially keyboard behaviour, and collect real-user measurements after official launch. Local laboratory scores cannot establish actual customer network performance.

