# Search launch checklist

The Netlify preview intentionally uses `noindex`. It will not rank in Google while that protection is active. Keep it as a preview until the replacement is published on https://www.allexdesign.com/.

## Included in the website

- Interior design, furniture and steel construction in the title and concise description, with Dhaka location.
- Server-rendered service and project content, including collapsed Show more content.
- LocalBusiness, WebSite and three linked Service entities using the displayed company contact details.
- Canonical URL, sharing metadata, sitemap, image dimensions and existing legacy redirects.
- Official release mode enables indexing; temporary Netlify mode remains noindex.

## When the official domain is ready

1. Build with `npm run build:official`. Confirm the canonical, sitemap and structured data use https://www.allexdesign.com/.
2. Deploy to the official hosting with the generated redirects and real 404 handling. Check the homepage returns HTTP 200 and no HTTP `X-Robots-Tag: noindex` header remains.
3. Verify ownership of the official domain in Google Search Console using the owner's account/DNS access. Submit https://www.allexdesign.com/sitemap.xml and request homepage indexing in URL Inspection.
4. Check the deployed homepage with Google's Rich Results Test. Structured data helps describe the company; it does not guarantee rich results or position.
5. Review the existing Google Business Profile with the owner. Keep the real business name, address, phone, website and service categories consistent. Add genuine project photos and ask actual customers for honest reviews.
6. Use Search Console queries and impressions to review performance for relevant terms such as interior design in Dhaka, custom furniture in Dhaka and steel construction in Bangladesh. Make further content changes based on actual queries and services offered.

No Search Console verification, Business Profile edits or ranking claims have been made by this code update. Account access and official publication are still required. Do not buy links or publish invented reviews, project counts or locations.

References: https://developers.google.com/search/docs/essentials and https://developers.google.com/search/docs/appearance/structured-data/local-business
