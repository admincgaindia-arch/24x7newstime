// 24x7 News Time — news.json builder (runs on GitHub Actions every 30 min)
// Ported 1:1 from the n8n "24x7 News Time - Auto Update" Code node.
import { writeFileSync, mkdirSync } from 'node:fs';

const Q = String.fromCharCode(34);
const WS = new RegExp('[' + String.fromCharCode(9, 10, 13, 160) + ' ]+', 'g');
const UA = 'Mozilla/5.0 (compatible; 24x7NewsTimeBot/1.0; +https://24x7newstime.in)';
const FEEDS = [
  ['indiatv_top','https://www.indiatv.in/rssnews/topstory.xml','India TV','top'],
  ['aajtak_home','https://www.aajtak.in/rssfeeds/?id=home','Aaj Tak','top'],
  ['abp_home','https://www.abplive.com/home/feed','ABP Live','top'],
  ['ndtv_khabar','https://feeds.feedburner.com/ndtvkhabar-latest','NDTV India','top'],
  ['tv9_home','https://www.tv9hindi.com/feed','TV9 Bharatvarsh','top'],
  ['zee_india','https://zeenews.india.com/hindi/india.xml','Zee News','top'],
  ['amarujala','https://www.amarujala.com/rss/breaking-news.xml','Amar Ujala','top'],
  ['bbc_hindi','https://feeds.bbci.co.uk/hindi/rss.xml','BBC Hindi','top'],
  ['abp_india','https://www.abplive.com/news/india/feed','ABP Live','desh'],
  ['indiatv_india','https://www.indiatv.in/rssnews/topstory-india.xml','India TV','desh'],
  ['tv9_india','https://www.tv9hindi.com/india/feed','TV9 Bharatvarsh','desh'],
  ['abp_states','https://www.abplive.com/states/feed','ABP Live','rajya'],
  ['abp_haryana','https://www.abplive.com/states/haryana/feed','ABP Live','rajya'],
  ['abp_delhi','https://www.abplive.com/states/delhi-ncr/feed','ABP Live','rajya'],
  ['abp_up','https://www.abplive.com/states/up-uk/feed','ABP Live','rajya'],
  ['tv9_states','https://www.tv9hindi.com/state/feed','TV9 Bharatvarsh','rajya'],
  ['tv9_haryana','https://www.tv9hindi.com/state/haryana/feed','TV9 Bharatvarsh','rajya'],
  ['abp_world','https://www.abplive.com/news/world/feed','ABP Live','videsh'],
  ['indiatv_world','https://www.indiatv.in/rssnews/topstory-world.xml','India TV','videsh'],
  ['tv9_world','https://www.tv9hindi.com/world/feed','TV9 Bharatvarsh','videsh'],
  ['zee_world','https://zeenews.india.com/hindi/world.xml','Zee News','videsh'],
  ['abp_sports','https://www.abplive.com/sports/feed','ABP Live','khel'],
  ['abp_cricket','https://www.abplive.com/sports/cricket/feed','ABP Live','khel'],
  ['indiatv_sports','https://www.indiatv.in/rssnews/topstory-sports.xml','India TV','khel'],
  ['tv9_sports','https://www.tv9hindi.com/sports/feed','TV9 Bharatvarsh','khel'],
  ['abp_ent','https://www.abplive.com/entertainment/feed','ABP Live','manoranjan'],
  ['indiatv_ent','https://www.indiatv.in/rssnews/topstory-entertainment.xml','India TV','manoranjan'],
  ['tv9_ent','https://www.tv9hindi.com/entertainment/feed','TV9 Bharatvarsh','manoranjan'],
  ['abp_business','https://www.abplive.com/business/feed','ABP Live','business'],
  ['indiatv_paisa','https://www.indiatv.in/rssnews/topstory-paisa.xml','India TV','business'],
  ['tv9_business','https://www.tv9hindi.com/business/feed','TV9 Bharatvarsh','business'],
  ['abp_tech','https://www.abplive.com/technology/feed','ABP Live','tech'],
  ['tv9_tech','https://www.tv9hindi.com/technology/feed','TV9 Bharatvarsh','tech'],
  ['abp_religion','https://www.abplive.com/lifestyle/religion/feed','ABP Live','dharm'],
  ['tv9_religion','https://www.tv9hindi.com/religion/feed','TV9 Bharatvarsh','dharm'],
  ['abp_lifestyle','https://www.abplive.com/lifestyle/feed','ABP Live','lifestyle'],
  ['abp_auto','https://www.abplive.com/auto/feed','ABP Live','auto'],
  ['abp_education','https://www.abplive.com/education/feed','ABP Live','naukri'],
  ['abp_jobs','https://www.abplive.com/education/jobs/feed','ABP Live','naukri']
];
const PATHCAT = [['/sports/','khel'],['/cricket/','khel'],['/khel/','khel'],['/entertainment/','manoranjan'],['/bollywood/','manoranjan'],['/television/','manoranjan'],['/tv/','manoranjan'],['/business/','business'],['/paisa/','business'],['/utility/','business'],['/world/','videsh'],['/international/','videsh'],['/technology/','tech'],['/tech/','tech'],['/gadgets/','tech'],['/religion/','dharm'],['/dharm/','dharm'],['/astrology/','dharm'],['/auto/','auto'],['/lifestyle/','lifestyle'],['/health/','lifestyle'],['/education/jobs/','naukri'],['/jobs/','naukri'],['/education/','naukri'],['/career/','naukri'],['/states/','rajya'],['/state/','rajya'],['/india/','desh'],['/politics/','desh'],['/crime','desh']];
const STATES = [['haryana','हरियाणा'],['delhi','दिल्ली'],['up-uk','उत्तर प्रदेश'],['uttar-pradesh','उत्तर प्रदेश'],['uttarakhand','उत्तराखंड'],['punjab','पंजाब'],['rajasthan','राजस्थान'],['bihar','बिहार'],['madhya-pradesh','मध्य प्रदेश'],['mp','मध्य प्रदेश'],['maharashtra','महाराष्ट्र'],['gujarat','गुजरात'],['west-bengal','पश्चिम बंगाल'],['jharkhand','झारखंड'],['himachal','हिमाचल'],['jammu','जम्मू-कश्मीर'],['chhattisgarh','छत्तीसगढ़'],['odisha','ओडिशा']];

function stripCdata(s) { return String(s || '').split('<![CDATA[').join('').split(']]>').join(''); }
function decode(s) { s = String(s || ''); s = s.replace(/&#(x?)([0-9a-fA-F]+);/g, function (m, x, n) { const c = parseInt(n, x ? 16 : 10); return isNaN(c) ? '' : String.fromCharCode(c); }); return s.split('&nbsp;').join(' ').split('&quot;').join(Q).split('&apos;').join(String.fromCharCode(39)).split('&lt;').join('<').split('&gt;').join('>').split('&amp;').join('&'); }
function clean(s) { return decode(stripCdata(s)).replace(/<[^>]*>/g, ' ').replace(WS, ' ').trim(); }
function tag(chunk, name) { const a = chunk.indexOf('<' + name); if (a < 0) return ''; const ch = chunk.charAt(a + name.length + 1); if (ch !== '>' && ch !== ' ' && ch !== '/' && ch !== String.fromCharCode(10) && ch !== String.fromCharCode(9)) return ''; const g = chunk.indexOf('>', a); if (g < 0) return ''; if (chunk.charAt(g - 1) === '/') return ''; const e = chunk.indexOf('</' + name + '>', g); if (e < 0) return ''; return chunk.slice(g + 1, e); }
function attr(chunk, tagName, at) { const a = chunk.indexOf('<' + tagName); if (a < 0) return ''; const g = chunk.indexOf('>', a); const t = chunk.slice(a, g < 0 ? a + 600 : g); const k = t.indexOf(at + '='); if (k < 0) return ''; const q = t.charAt(k + at.length + 1); const e = t.indexOf(q, k + at.length + 2); return e < 0 ? '' : t.slice(k + at.length + 2, e); }
function goodUrl(u) { u = decode(stripCdata(u)).trim(); return (u.indexOf('https://') === 0 || u.indexOf('http://') === 0) ? u : ''; }
function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) { h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; } return h.toString(36); }
function catFromUrl(u) { const p = u.toLowerCase(); for (const pc of PATHCAT) { if (p.indexOf(pc[0]) >= 0) return pc[1]; } return ''; }
function stateFromUrl(u) { const p = u.toLowerCase(); for (const s of STATES) { if (p.indexOf('/' + s[0] + '/') >= 0 || p.indexOf('/' + s[0] + '-news') >= 0) return s[1]; } return ''; }
function parseFeed(xml, f, now) {
  const out = []; const parts = String(xml).split('<item');
  for (let i = 1; i < parts.length && out.length < 40; i++) {
    let c = parts[i]; const end = c.indexOf('</item>'); if (end >= 0) c = c.slice(0, end);
    const t = clean(tag(c, 'title')); let u = goodUrl(tag(c, 'link')); if (!u) u = goodUrl(tag(c, 'guid'));
    if (!t || !u || t.length < 12) continue;
    const rawDesc = decode(stripCdata(tag(c, 'description')));
    let img = goodUrl(attr(c, 'media:content', 'url')) || goodUrl(attr(c, 'media:thumbnail', 'url')) || goodUrl(attr(c, 'enclosure', 'url')) || goodUrl(attr(rawDesc, 'img', 'src'));
    if (img.indexOf('ichef.bbci.co.uk') >= 0) img = img.split('/ws/240/').join('/ws/800/');
    let d = clean(rawDesc); if (d === t || d.length < 20) d = '';
    if (d.length > 240) { d = d.slice(0, 240); const sp = d.lastIndexOf(' '); d = (sp > 150 ? d.slice(0, sp) : d) + '…'; }
    let ds = clean(tag(c, 'pubDate')) || clean(tag(c, 'dc:date')) || clean(tag(c, 'updatedAt'));
    let ts = Date.parse(ds); if (isNaN(ts) || ts > now + 3600000) ts = now - i * 300000;
    let cat = f[3] === 'top' ? (catFromUrl(u) || 'desh') : f[3];
    if (f[3] === 'desh' || f[3] === 'top') { const uc = catFromUrl(u); if (uc === 'rajya' || uc === 'videsh') cat = uc; }
    const it = { id: hash(u), t: t, d: d, img: img, u: u, s: f[2], ts: ts, c: cat, pos: i, feed: f[0] };
    if (cat === 'rajya') { const st = stateFromUrl(u); if (st) it.st = st; }
    out.push(it);
  }
  return out;
}
async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml' }, signal: AbortSignal.timeout(20000), redirect: 'follow' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return await r.text();
}

const now = Date.now(); const results = []; const stats = {};
for (let k = 0; k < FEEDS.length; k += 8) {
  const batch = FEEDS.slice(k, k + 8);
  const got = await Promise.all(batch.map(f => get(f[1]).then(x => ({ f, x }), e => ({ f, x: '', e: String(e.message || e).slice(0, 80) }))));
  for (const g of got) {
    let items = [];
    try { items = g.x ? parseFeed(g.x, g.f, now) : []; } catch (e) { g.e = 'parse ' + String(e.message || e).slice(0, 60); }
    stats[g.f[0]] = g.e ? 'ERR ' + g.e : items.length;
    results.push({ f: g.f, items });
  }
}
const byId = {}; const seenT = {}; const all = [];
function tkey(t) { return t.replace(/[^A-Za-z0-9ऀ-ॿ]/g, '').slice(0, 30); }
for (const r of results) { for (const it of r.items) { const k = tkey(it.t); if (byId[it.id]) { if (!byId[it.id].img && it.img) byId[it.id].img = it.img; continue; } if (seenT[k]) { const o = seenT[k]; if (!o.img && it.img) o.img = it.img; continue; } byId[it.id] = it; seenT[k] = it; all.push(it); } }
const topFeeds = results.filter(r => r.f[3] === 'top'); const top = []; const topSet = {};
for (let p = 0; p < 40 && top.length < 36; p++) { for (const r of topFeeds) { const it = r.items[p]; if (!it) continue; const real = byId[it.id] || seenT[tkey(it.t)]; if (!real || topSet[real.id] || now - real.ts > 36 * 3600000) continue; topSet[real.id] = 1; top.push(real.id); } }
const CATS = ['desh','rajya','videsh','khel','manoranjan','business','tech','dharm','lifestyle','auto','naukri'];
const keep = {}; for (const id of top) keep[id] = 1; const catCount = {};
for (const c of CATS) { const list = all.filter(x => x.c === c).sort((a, b) => b.ts - a.ts); let fresh = list.filter(x => now - x.ts < 72 * 3600000); if (fresh.length < 12) fresh = list.slice(0, 12); fresh = fresh.slice(0, 48); catCount[c] = fresh.length; for (const x of fresh) keep[x.id] = 1; }
const items = all.filter(x => keep[x.id]).sort((a, b) => b.ts - a.ts).map(x => { const o = { id: x.id, t: x.t, u: x.u, s: x.s, ts: x.ts, c: x.c }; if (x.d) o.d = x.d; if (x.img) o.img = x.img; if (x.st) o.st = x.st; return o; });
const ticker = items.filter(x => topSet[x.id]).slice(0, 14).map(x => x.id);
const payload = { v: 2, updated: new Date(now).toISOString(), top, ticker, items };

console.log(JSON.stringify({ count: items.length, top: top.length, withImg: items.filter(x => x.img).length, catCount, stats }, null, 1));
if (items.length < 60) { console.error('Too few stories (' + items.length + ') — not publishing.'); process.exit(1); }
mkdirSync('out', { recursive: true });
writeFileSync('out/news.json', JSON.stringify(payload));
console.log('Wrote out/news.json');
