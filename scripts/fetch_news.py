#!/usr/bin/env python3
"""
24x7 News Time - automatic news updater.

Runs inside GitHub Actions on a schedule. Pulls headlines from Google News
RSS (English + Hindi, India edition), cleans and de-duplicates them, and
writes:
  data/news.json   - read by the website
  sitemap.xml      - for search engines
  index.html       - refreshes the static "latest headlines" block for SEO

Only headline, source name, time and the link to the original article are
stored. Full articles are never copied - readers are sent to the publisher.

Standard library only: no pip install needed.
"""

import datetime as dt
import email.utils
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "news.json"
SITEMAP_FILE = ROOT / "sitemap.xml"
INDEX_FILE = ROOT / "index.html"
SITE_URL = "https://24x7newstime.in"

MAX_ITEMS_PER_CATEGORY = 40
MAX_AGE_HOURS = 72
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))

GN = "https://news.google.com/rss"
EN = "hl=en-IN&gl=IN&ceid=IN:en"
HI = "hl=hi&gl=IN&ceid=IN:hi"


def topic(name, lang):
    return f"{GN}/headlines/section/topic/{name}?{lang}"


# id, English label, Hindi label, topic key (None = top stories)
CATEGORIES = [
    ("top", "Top stories", "मुख्य खबरें", None),
    ("india", "India", "देश", "NATION"),
    ("world", "World", "दुनिया", "WORLD"),
    ("business", "Business", "कारोबार", "BUSINESS"),
    ("technology", "Technology", "टेक", "TECHNOLOGY"),
    ("sports", "Sports", "खेल", "SPORTS"),
    ("entertainment", "Entertainment", "मनोरंजन", "ENTERTAINMENT"),
    ("health", "Health", "सेहत", "HEALTH"),
    ("science", "Science", "विज्ञान", "SCIENCE"),
]

LANGS = {"en": EN, "hi": HI}


def feed_url(topic_key, lang_query):
    if topic_key is None:
        return f"{GN}?{lang_query}"
    return topic(topic_key, lang_query)


def download(url, timeout=25):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; 24x7NewsTimeBot/1.0; +https://24x7newstime.in)",
            "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def clean_title(title, source):
    title = html.unescape(title or "").strip()
    title = re.sub(r"\s+", " ", title)
    if source:
        suffix = f" - {source}"
        if title.endswith(suffix):
            title = title[: -len(suffix)].rstrip()
    return title


def parse_date(text):
    if not text:
        return None
    try:
        d = email.utils.parsedate_to_datetime(text)
        if d.tzinfo is None:
            d = d.replace(tzinfo=dt.timezone.utc)
        return d.astimezone(dt.timezone.utc)
    except (TypeError, ValueError):
        return None


def parse_feed(xml_bytes):
    root = ET.fromstring(xml_bytes)
    items = []
    now = dt.datetime.now(dt.timezone.utc)
    for it in root.iter("item"):
        src_el = it.find("source")
        source = (src_el.text or "").strip() if src_el is not None else ""
        source_url = src_el.get("url", "") if src_el is not None else ""
        title = clean_title(it.findtext("title"), source)
        link = (it.findtext("link") or "").strip()
        published = parse_date(it.findtext("pubDate"))
        if not title or not link.startswith("http"):
            continue
        if published and (now - published).total_seconds() > MAX_AGE_HOURS * 3600:
            continue
        domain = urlparse(source_url).netloc.replace("www.", "") if source_url else ""
        items.append(
            {
                "t": title,
                "l": link,
                "s": source or domain or "News",
                "d": domain,
                "p": (published or now).strftime("%Y-%m-%dT%H:%M:%SZ"),
            }
        )
    return items


def norm(title):
    return re.sub(r"[\W_]+", "", title.lower())[:80]


def dedupe_sort(items):
    seen, out = set(), []
    for item in sorted(items, key=lambda x: x["p"], reverse=True):
        key = norm(item["t"])
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out[:MAX_ITEMS_PER_CATEGORY]


def load_previous():
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def previous_items(prev, lang, cat_id):
    for cat in prev.get("languages", {}).get(lang, {}).get("categories", []):
        if cat.get("id") == cat_id:
            return cat.get("items", [])
    return []


def build():
    prev = load_previous()
    now = dt.datetime.now(dt.timezone.utc)
    result = {"updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "languages": {}}
    ok = failed = 0

    for lang, query in LANGS.items():
        cats = []
        for cat_id, label_en, label_hi, key in CATEGORIES:
            url = feed_url(key, query)
            try:
                items = dedupe_sort(parse_feed(download(url)))
                if not items:
                    raise ValueError("feed returned no usable items")
                ok += 1
            except Exception as exc:  # keep last good data for this section
                failed += 1
                items = previous_items(prev, lang, cat_id)
                print(f"[warn] {lang}/{cat_id}: {exc} - kept {len(items)} old items", file=sys.stderr)
            cats.append(
                {
                    "id": cat_id,
                    "label": label_en if lang == "en" else label_hi,
                    "items": items,
                }
            )
        result["languages"][lang] = {"categories": cats}

    print(f"Feeds ok: {ok}, failed: {failed}")
    if ok == 0:
        print("[error] every feed failed - leaving existing files untouched", file=sys.stderr)
        sys.exit(1)
    return result


def write_sitemap(updated):
    urls = ["/", "/about.html", "/contact.html", "/privacy.html", "/disclaimer.html"]
    rows = "\n".join(
        f"  <url><loc>{SITE_URL}{u}</loc><lastmod>{updated}</lastmod>"
        f"<changefreq>{'hourly' if u == '/' else 'monthly'}</changefreq></url>"
        for u in urls
    )
    SITEMAP_FILE.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{rows}\n</urlset>\n",
        encoding="utf-8",
    )


def refresh_static_block(data):
    """Put the latest 12 English headlines into index.html so search engines
    and no-JS visitors see real content."""
    if not INDEX_FILE.exists():
        return
    page = INDEX_FILE.read_text(encoding="utf-8")
    start, end = "<!-- STATIC-NEWS:START -->", "<!-- STATIC-NEWS:END -->"
    if start not in page or end not in page:
        return
    top = next(
        (c["items"] for c in data["languages"]["en"]["categories"] if c["id"] == "top"),
        [],
    )[:12]
    li = "\n".join(
        f'        <li><a href="{html.escape(i["l"])}" rel="noopener nofollow" target="_blank">'
        f'{html.escape(i["t"])}</a> <span>{html.escape(i["s"])}</span></li>'
        for i in top
    )
    stamp = dt.datetime.strptime(data["updated"], "%Y-%m-%dT%H:%M:%SZ").replace(
        tzinfo=dt.timezone.utc
    ).astimezone(IST).strftime("%d %b %Y, %I:%M %p IST")
    block = (
        f"{start}\n      <p>Latest headlines, updated {stamp}</p>\n"
        f'      <ul>\n{li}\n      </ul>\n      {end}'
    )
    page = re.sub(re.escape(start) + r".*?" + re.escape(end), lambda _: block, page, flags=re.S)
    INDEX_FILE.write_text(page, encoding="utf-8")


def main():
    data = build()
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    write_sitemap(data["updated"][:10])
    refresh_static_block(data)
    print(f"Wrote {DATA_FILE.relative_to(ROOT)} at {data['updated']}")


if __name__ == "__main__":
    main()
