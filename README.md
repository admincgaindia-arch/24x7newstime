# 24x7 News Time

Live site: https://24x7newstime.in

Automatic news headline website (English + Hindi) hosted free on GitHub Pages.

## How it works
- `.github/workflows/update-news.yml` runs every 3 hours, and whenever you push to `main`.
- `scripts/fetch_news.py` pulls Google News RSS headlines (India edition) and writes `data/news.json`, `sitemap.xml` and the SEO block in `index.html`.
- The site then deploys to GitHub Pages automatically.
- Only headline, source, time and link are stored. Readers open the full story on the publisher's site.

## One-time setup
1. Settings > Pages > Source: **GitHub Actions**. Custom domain: `24x7newstime.in`, then Enforce HTTPS.
2. Settings > Actions > General > Workflow permissions: **Read and write permissions**.
3. Actions tab > "Update news and publish site" > **Run workflow**.

## Change things
- Update frequency: edit the `cron` line in the workflow. `0 */1 * * *` = every hour, `30 0 * * *` = once daily at 6 AM IST.
- Sections: edit `CATEGORIES` in `scripts/fetch_news.py`.
- Contact email: search `contact@24x7newstime.in` in the HTML pages.
