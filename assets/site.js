(function () {
'use strict';
var CATS = [
['desh', 'देश'], ['rajya', 'राज्य'], ['videsh', 'दुनिया'], ['khel', 'खेल'],
['manoranjan', 'मनोरंजन'], ['business', 'बिज़नेस'], ['tech', 'टेक'], ['dharm', 'धर्म'],
['lifestyle', 'लाइफस्टाइल'], ['auto', 'ऑटो'], ['naukri', 'शिक्षा-नौकरी']
];
var CAT = {}; CATS.forEach(function (c) { CAT[c[0]] = c[1]; });
var TZ = { timeZone: 'Asia/Kolkata' };
var app = document.getElementById('app');
var DATA = null, BY = {}, PAGE = 24, shown = PAGE, stateFilter = '';
function esc(s) {
return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
});
}
function ago(ts) {
var m = Math.round((Date.now() - ts) / 60000);
if (m < 1) return 'अभी-अभी';
if (m < 60) return m + ' मिनट पहले';
var h = Math.round(m / 60);
if (h < 24) return h + ' घंटे पहले';
var d = Math.round(h / 24);
return d === 1 ? 'कल' : d + ' दिन पहले';
}
function hhmm(ts) {
return new Date(ts).toLocaleTimeString('hi-IN', Object.assign({ hour: '2-digit', minute: '2-digit', hour12: true }, TZ));
}
function ext(it) { return 'href="' + esc(it.u) + '" target="_blank" rel="noopener"'; }
function thumb(it, cls) {
var inner = it.img
? '<img src="' + esc(it.img) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
: '';
return '<div class="th ' + (cls || '') + (it.img ? '' : ' noimg') + '" data-src="' + esc(it.s) + '">' + inner + '</div>';
}
function meta(it, withCat) {
return '<div class="meta"><span class="src">' + esc(it.s) + '</span>' +
(it.st ? '<span class="st">' + esc(it.st) + '</span>' : '') +
(withCat && CAT[it.c] ? '<span>' + CAT[it.c] + '</span>' : '') +
'<time datetime="' + new Date(it.ts).toISOString() + '">' + ago(it.ts) + '</time></div>';
}
var WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>';
function share(it) {
var txt = it.t + '\n' + it.u + '\n\nऐसी ही ताज़ा खबरें: https://24x7newstime.in';
return '<a class="share" href="https://wa.me/?text=' + encodeURIComponent(txt) + '" target="_blank" rel="noopener">' + WA + 'WhatsApp पर भेजें</a>';
}
function byCat(c) {
return DATA.items.filter(function (x) { return x.c === c; }).sort(function (a, b) { return b.ts - a.ts; });
}
function latest() { return DATA.items.slice().sort(function (a, b) { return b.ts - a.ts; }); }
function row(it) {
return '<a class="row" ' + ext(it) + '>' + thumb(it) + '<div><h3>' + esc(it.t) + '</h3>' + meta(it) + '</div></a>';
}
function card(it, withCat) {
return '<article class="card"><a ' + ext(it) + '>' + thumb(it) + '</a><div class="bd"><a ' + ext(it) + '><h3>' + esc(it.t) + '</h3></a>' + meta(it, withCat) + '</div></article>';
}
function secHead(title, href) {
return '<div class="sec-h"><h2>' + title + '</h2>' + (href ? '<a class="more" href="' + href + '">सभी देखें ›</a>' : '') + '</div>';
}
function sidebar() {
var l = latest().filter(function (x) { return !ASTRO.test(x.t); }).slice(0, 18);
return '<aside class="side">' +
'<section class="box"><h2><span class="dot" aria-hidden="true"></span>ताज़ा खबरें</h2><ol class="tl">' +
l.map(function (it) {
return '<li><time datetime="' + new Date(it.ts).toISOString() + '">' + hhmm(it.ts) + '</time><a ' + ext(it) + '>' + esc(it.t) + '</a></li>';
}).join('') + '</ol><a class="all" href="#/taza">सभी ताज़ा खबरें ›</a></section>' +
'<section class="box cbox"><h2>खबर या विज्ञापन दें</h2><div class="cbox-b"><p>अपने इलाके की खबर, फोटो या विज्ञापन के लिए संपर्क करें।</p>' +
'<a class="cb-btn call" href="tel:+918689096000">📞 86890 96000</a><a class="cb-btn call" href="tel:+919996647888">📞 99966 47888</a>' +
'<a class="cb-btn wa" href="https://wa.me/918689096000" target="_blank" rel="noopener">WhatsApp पर भेजें</a>' +
'<a class="cb-mail" href="mailto:admin.24x7newstime@gmail.com">admin.24x7newstime@gmail.com</a></div></section>' +
'<section class="box"><h2>सेक्शन</h2><div class="catlinks">' +
CATS.map(function (c) { return '<a href="#/c/' + c[0] + '">' + c[1] + '</a>'; }).join('') + '</div></section>' +
'<section class="box"><h2>हमारे बारे में</h2><p class="box-note"><strong>24x7 News Time</strong> पर देश के बड़े हिंदी प्रकाशकों की सुर्खियां हर 5 मिनट में अपने आप जुड़ती हैं। पूरी खबर पढ़ने के लिए शीर्षक पर क्लिक करें, वह मूल प्रकाशक की साइट पर खुलेगी।</p></section>' +
'</aside>';
}
function card4(it) {
return '<a class="c4" ' + ext(it) + '>' + thumb(it) + '<h3>' + esc(it.t) + '</h3>' + meta(it) + '</a>';
}
function home() {
var used = {};
var top = DATA.top.map(function (id) { return BY[id]; }).filter(Boolean);
var withImg = top.filter(function (x) { return x.img; });
var lead = withImg[0] || top[0] || latest()[0];
used[lead.id] = 1;
var subs = withImg.filter(function (x) { return !used[x.id]; }).slice(0, 3);
subs.forEach(function (x) { used[x.id] = 1; });
var side = top.filter(function (x) { return !used[x.id]; }).slice(0, 6);
side.forEach(function (x) { used[x.id] = 1; });
var h = '<div class="page"><div>';
h += '<section class="hero" aria-label="बड़ी खबरें"><div class="hero-main"><article class="lead"><a class="lead-link" ' + ext(lead) + '>' +
'<div class="th lead-th">' + (lead.img ? '<img src="' + esc(lead.img) + '" alt="" fetchpriority="high" referrerpolicy="no-referrer">' : '') +
'<div class="lead-over"><span class="badge">बड़ी खबर</span><h1>' + esc(lead.t) + '</h1>' + meta(lead, true) + '</div></div></a>' +
(lead.d ? '<p class="lead-d">' + esc(lead.d) + '</p>' : '') + share(lead) + '</article>' +
'<div class="subs">' + subs.map(card4).join('') + '</div></div>' +
'<div class="tops"><h2>टॉप खबरें</h2>' + side.map(row).join('') + '</div></section>';
var pics = latest().filter(function (x) { return x.img && !used[x.id] && !ASTRO.test(x.t) && (x.c === 'manoranjan' || x.c === 'khel' || x.c === 'videsh' || x.c === 'desh'); }).slice(0, 10);
if (pics.length >= 4) {
h += '<section class="sec pics" aria-label="तस्वीरों में">' + secHead('तस्वीरों में', '') + '<div class="strip">' +
pics.map(function (it) { return '<a class="pic" ' + ext(it) + '><div class="th">' + '<img src="' + esc(it.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer"></div><span>' + esc(it.t) + '</span></a>'; }).join('') + '</div></section>';
}
var GRID = { khel: 1, manoranjan: 1, tech: 1, lifestyle: 1, auto: 1 };
CATS.forEach(function (c) {
var list = byCat(c[0]).filter(function (x) { return !used[x.id]; });
if (list.length < 3) return;
var body;
if (GRID[c[0]]) {
var g = list.filter(function (x) { return x.img; }).slice(0, 4);
if (g.length < 4) g = list.slice(0, 4);
g.forEach(function (x) { used[x.id] = 1; });
body = '<div class="grid4">' + g.map(card4).join('') + '</div>';
} else {
var f = list.filter(function (x) { return x.img; })[0] || list[0];
var rest = list.filter(function (x) { return x !== f; }).slice(0, 4);
used[f.id] = 1; rest.forEach(function (x) { used[x.id] = 1; });
body = '<div class="block"><article><a class="feat" ' + ext(f) + '>' + thumb(f) + '<h3>' + esc(f.t) + '</h3>' +
(f.d ? '<p>' + esc(f.d) + '</p>' : '') + '</a>' + meta(f) + '</article><div class="tops">' + rest.map(row).join('') + '</div></div>';
}
h += '<section class="sec sec-' + c[0] + '" aria-label="' + c[1] + '">' + secHead(c[1], '#/c/' + c[0]) + body + '</section>';
});
h += '</div>' + sidebar() + '</div>';
return h;
}
function listView(title, list, opts) {
opts = opts || {};
var h = '<div class="page"><div><div class="page-h"><h1>' + title + '</h1><span class="count">' + list.length + ' खबरें</span></div>';
if (opts.chips) h += opts.chips;
if (!list.length) {
h += '<div class="empty">' + (opts.empty || 'इस सेक्शन में अभी कोई खबर नहीं है। कुछ देर बाद फिर देखें।') + '</div>';
} else {
h += '<div class="grid">' + list.slice(0, shown).map(function (x) { return card(x, opts.withCat); }).join('') + '</div>';
if (list.length > shown) h += '<button class="loadmore" type="button" data-more>और खबरें दिखाएं</button>';
}
return h + '</div>' + sidebar() + '</div>';
}
function category(c) {
var list = byCat(c), chips = '';
if (c === 'rajya') {
var states = {};
list.forEach(function (x) { if (x.st) states[x.st] = (states[x.st] || 0) + 1; });
var names = Object.keys(states).sort(function (a, b) { return states[b] - states[a]; });
if (names.length) {
chips = '<div class="chips" role="group" aria-label="राज्य चुनें"><a href="#/c/rajya" aria-current="' + (!stateFilter) + '">सभी राज्य</a>' +
names.map(function (n) { return '<a href="#/c/rajya/' + encodeURIComponent(n) + '" aria-current="' + (stateFilter === n) + '">' + esc(n) + ' <small>' + states[n] + '</small></a>'; }).join('') + '</div>';
}
if (stateFilter) list = list.filter(function (x) { return x.st === stateFilter; });
}
return listView(stateFilter ? stateFilter + ' की खबरें' : CAT[c], list, { chips: chips, empty: 'इस राज्य की अभी कोई ताज़ा खबर नहीं है। सभी राज्य देखें या थोड़ी देर बाद आएं।' });
}
function search(q) {
var words = q.toLowerCase().split(/\s+/).filter(Boolean);
var list = latest().filter(function (x) {
var hay = (x.t + ' ' + (x.d || '') + ' ' + x.s + ' ' + (x.st || '')).toLowerCase();
return words.every(function (w) { return hay.indexOf(w) >= 0; });
});
return listView('“' + esc(q) + '” की खबरें', list, { withCat: true, empty: 'इस शब्द से कोई खबर नहीं मिली। दूसरा शब्द आज़माएं, जैसे “हरियाणा” या “क्रिकेट”।' });
}
function route() {
if (!DATA) return;
var hsh = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
var parts = hsh.split('/'), key = 'home', html, title = '24x7 News Time — हर खबर, हर वक्त, आपके साथ';
if (parts[0] === 'c' && CAT[parts[1]]) {
stateFilter = parts[1] === 'rajya' && parts[2] ? parts[2] : '';
key = parts[1]; html = category(parts[1]); title = CAT[parts[1]] + ' की ताज़ा खबरें — 24x7 News Time';
} else if (parts[0] === 'taza') {
key = 'taza'; html = listView('ताज़ा खबरें', latest(), { withCat: true }); title = 'ताज़ा खबरें — 24x7 News Time';
} else if (parts[0] === 'khoj' && parts[1]) {
key = ''; html = search(parts.slice(1).join('/')); title = parts[1] + ' — खोज — 24x7 News Time';
var qi = document.querySelector('.search input'); if (qi) qi.value = parts.slice(1).join('/');
} else {
html = home();
}
app.innerHTML = html;
document.title = title;
document.querySelectorAll('.states a').forEach(function (a) {
if (stateFilter && a.textContent === stateFilter) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
});
document.querySelectorAll('.nav a').forEach(function (a) {
if (a.getAttribute('data-k') === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
});
}
function ticker() {
var el = document.getElementById('ticker');
if (!el) return;
var ids = DATA.ticker && DATA.ticker.length ? DATA.ticker : DATA.top.slice(0, 12);
var items = ids.map(function (id) { return BY[id]; }).filter(Boolean);
var one = items.map(function (it) { return '<a ' + ext(it) + '>' + esc(it.t) + '</a>'; }).join('');
el.innerHTML = one + one.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
el.style.setProperty('--dur', Math.max(60, items.length * 9) + 's');
}
function setUpdated() {
var u = document.getElementById('upd');
if (!u || !DATA) return;
var t = Date.parse(DATA.updated);
u.textContent = 'अपडेट: ' + ago(t);
u.classList.toggle('stale', Date.now() - t > 3 * 3600000);
}
var ASTRO = /rashifal|horoscope|panchang|tarot|राशिफल|पंचांग|ज्योतिष|लव राशि/i;
function ingest(d) {
DATA = d; BY = {};
var astro = {};
d.items.forEach(function (x) {
if (ASTRO.test(x.t)) { x.c = 'dharm'; astro[x.id] = 1; }
BY[x.id] = x;
});
d.top = (d.top || []).filter(function (id) { return !astro[id]; });
d.ticker = (d.ticker || []).filter(function (id) { return !astro[id]; });
}
var SRC = ['https://raw.githubusercontent.com/admincgaindia-arch/24x7newstime/data/news.json', 'data/news.json'];
function getData(i) {
i = i || 0;
return fetch(SRC[i] + '?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' })
.then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
.then(function (d) { if (!d || !d.items || !d.items.length) throw new Error('empty'); return d; })
.catch(function (e) { if (i + 1 < SRC.length) return getData(i + 1); throw e; });
}
function apply(d) { ingest(d); ticker(); route(); setUpdated(); }
function load(first) {
return getData(0).then(function (d) {
if (first) { apply(d); return; }
if (!DATA || d.updated === DATA.updated) return;
if (Date.parse(d.updated) < Date.parse(DATA.updated)) return;
var chatOpen = document.body.classList.contains('chat-open');
if (window.scrollY < 400 && !chatOpen) { var y = window.scrollY; apply(d); window.scrollTo(0, y); return; }
var pill = document.getElementById('fresh');
if (!pill) return;
pill.hidden = false;
pill.onclick = function () { pill.hidden = true; apply(d); window.scrollTo({ top: 0 }); };
}).catch(function () {
if (first) app.innerHTML = '<div class="empty">खबरें लोड नहीं हो सकीं। इंटरनेट कनेक्शन जांचें और पेज रीफ्रेश करें।</div>';
});
}
document.addEventListener('error', function (e) {
var img = e.target;
if (img.tagName === 'IMG' && img.parentNode && img.parentNode.classList.contains('th')) {
img.parentNode.classList.add('noimg'); img.remove();
}
}, true);
document.addEventListener('click', function (e) {
var m = e.target.closest('[data-more]');
if (m) { shown += PAGE; var y = window.scrollY; route(); window.scrollTo(0, y); return; }
if (e.target.closest('#totop')) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
});
window.addEventListener('hashchange', function () {
shown = PAGE;
route();
window.scrollTo(0, 0);
});
function clock() {
var c = document.getElementById('clock'), d = document.getElementById('today'), n = new Date();
if (c) c.textContent = n.toLocaleTimeString('hi-IN', Object.assign({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }, TZ)) + ' IST';
if (d) d.textContent = n.toLocaleDateString('hi-IN', Object.assign({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, TZ));
}
clock(); setInterval(clock, 1000);
var tb = document.getElementById('themeBtn');
function themeLabel() {
var dark = document.documentElement.dataset.theme === 'dark' ||
(!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
if (tb) tb.textContent = dark ? 'लाइट मोड' : 'डार्क मोड';
return dark;
}
if (tb) {
themeLabel();
tb.addEventListener('click', function () {
var next = themeLabel() ? 'light' : 'dark';
document.documentElement.dataset.theme = next;
try { localStorage.setItem('theme', next); } catch (e) {}
themeLabel();
});
}
var form = document.querySelector('.search');
if (form) form.addEventListener('submit', function (e) {
e.preventDefault();
var q = form.q.value.trim();
if (!q) return;
var target = '#/khoj/' + encodeURIComponent(q);
if (app) location.hash = target; else location.href = './' + target;
});
var st = document.querySelector('.srch-toggle');
if (st) st.addEventListener('click', function () { form.classList.toggle('open'); if (form.classList.contains('open')) form.q.focus(); });
var BOT = 'https://cga.app.n8n.cloud/webhook/newsbot';
var chatHist = [];
var CHAT_ALIAS = [['बिजनेस', 'business'], ['व्यापार', 'business'], ['शेयर', 'business'], ['बाजार', 'business'], ['क्रिकेट', 'khel'], ['स्पोर्ट', 'khel'], ['विदेश', 'videsh'], ['दुनिया', 'videsh'], ['नौकरी', 'naukri'], ['शिक्षा', 'naukri'], ['रिजल्ट', 'naukri'], ['फिल्म', 'manoranjan'], ['बॉलीवुड', 'manoranjan'], ['मोबाइल', 'tech'], ['टेक', 'tech'], ['गाड़ी', 'auto'], ['कार', 'auto'], ['धर्म', 'dharm'], ['सेहत', 'lifestyle'], ['हेल्थ', 'lifestyle']];
var CHAT_STOP = { 'की': 1, 'के': 1, 'का': 1, 'में': 1, 'से': 1, 'है': 1, 'हैं': 1, 'और': 1, 'पर': 1, 'को': 1, 'क्या': 1, 'आज': 1, 'खबर': 1, 'खबरें': 1, 'ताजा': 1, 'अपडेट': 1, 'बताओ': 1, 'बताइए': 1, 'news': 1, 'latest': 1, 'the': 1 };
function nk(s) { return String(s || '').toLowerCase().replace(/\u093c/g, ''); }
function localReply(q) {
var ready = DATA ? Promise.resolve(DATA) : getData(0).then(function (d) { ingest(d); return d; });
return ready.then(function (d) {
var s = nk(q), list = [], title = '';
var states = {}; d.items.forEach(function (x) { if (x.st) states[x.st] = 1; });
var st = Object.keys(states).filter(function (k) { return s.indexOf(nk(k)) >= 0; })[0];
var cat = null;
CATS.forEach(function (c) { if (s.indexOf(nk(c[1])) >= 0 || s.indexOf(c[0]) >= 0) cat = c[0]; });
if (!cat) CHAT_ALIAS.forEach(function (a) { if (!cat && s.indexOf(nk(a[0])) >= 0) cat = a[1]; });
if (st) { list = d.items.filter(function (x) { return x.st === st; }); title = st + ' की ताज़ा खबरें'; }
else if (cat) { list = d.items.filter(function (x) { return x.c === cat; }); title = CAT[cat] + ' की ताज़ा खबरें'; }
if (!list.length && /बडी|मुख्य|सुर्खि|टॉप|top|headline|breaking|ब्रेकिंग/.test(s)) { list = (d.top || []).map(function (id) { return BY[id]; }).filter(Boolean); title = 'आज की बड़ी खबरें'; }
if (!list.length) {
var words = s.split(/[\s,.?!।|:;'"()-]+/).filter(function (w) { return w.length > 1 && !CHAT_STOP[w]; });
if (words.length) {
list = d.items.map(function (x) { var t = nk(x.t + ' ' + (x.d || '')), sc = 0; words.forEach(function (w) { if (t.indexOf(w) >= 0) sc++; }); return { x: x, sc: sc }; })
.filter(function (o) { return o.sc > 0; }).sort(function (a, b) { return b.sc - a.sc || b.x.ts - a.x.ts; }).map(function (o) { return o.x; });
if (list.length) title = 'आपके सवाल से जुड़ी खबरें';
}
}
if (!list.length) { list = (d.top || []).map(function (id) { return BY[id]; }).filter(Boolean); title = 'आज की बड़ी खबरें'; }
list = list.slice(0, 5);
if (!list.length) throw new Error('none');
return '<b>' + esc(title) + ':</b><ol>' + list.map(function (x) { return '<li><a href="' + esc(x.u) + '">' + esc(x.t) + '</a> <small>— ' + esc(x.s) + '</small></li>'; }).join('') + '</ol>';
});
}
function chatInit() {
var btn = document.createElement('button');
btn.className = 'ai-fab'; btn.type = 'button'; btn.setAttribute('aria-label', 'AI न्यूज़ साथी से पूछें');
btn.innerHTML = '<span class="ai-dot"></span><strong>AI</strong><span>पूछें</span>';
var box = document.createElement('section');
box.className = 'ai-box'; box.hidden = true; box.setAttribute('aria-label', 'न्यूज़ साथी चैट');
box.innerHTML = '<header class="ai-h"><div><strong>न्यूज़ साथी</strong><span>AI से कुछ भी पूछें</span></div><button type="button" class="ai-x" aria-label="चैट बंद करें">×</button></header>' +
'<div class="ai-msgs" aria-live="polite"></div>' +
'<div class="ai-chips"></div>' +
'<form class="ai-f"><label class="vh" for="aiq">अपना सवाल लिखें</label><input id="aiq" type="text" maxlength="400" placeholder="अपना सवाल लिखें…" autocomplete="off"><button type="submit" aria-label="भेजें">➤</button></form>' +
'<p class="ai-note">AI के जवाब में गलती हो सकती है। खबर की पुष्टि मूल स्रोत से करें।</p>';
document.body.appendChild(box); document.body.appendChild(btn);
var msgs = box.querySelector('.ai-msgs'), form = box.querySelector('.ai-f'), inp = box.querySelector('input'), chips = box.querySelector('.ai-chips');
function add(role, html) {
var d = document.createElement('div'); d.className = 'ai-m ' + role; d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
}
add('bot', 'नमस्ते! मैं <b>न्यूज़ साथी</b> हूं, 24x7 News Time का AI सहायक। ताज़ा खबरें, किसी राज्य का हाल, या कोई भी सवाल पूछिए।');
['आज की बड़ी खबरें', 'हरियाणा की ताज़ा खबर', 'खेल की खबरें', 'बिज़नेस अपडेट'].forEach(function (c) {
var b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.onclick = function () { ask(c); }; chips.appendChild(b);
});
var busy = false;
function ask(q) {
q = String(q || '').trim(); if (!q || busy) return;
busy = true; chips.hidden = true;
add('me', esc(q));
var wait = add('bot typing', '<span></span><span></span><span></span>');
var ctl = window.AbortController ? new AbortController() : null;
var to = setTimeout(function () { if (ctl) ctl.abort(); }, 30000);
fetch(BOT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, history: chatHist.slice(-6), page: location.pathname + location.hash }), signal: ctl ? ctl.signal : undefined })
.then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
.then(function (j) {
var reply = (j && j.reply) ? String(j.reply) : '';
if (!reply) throw new Error('empty');
wait.className = 'ai-m bot'; wait.innerHTML = reply;
wait.querySelectorAll('a').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
chatHist.push({ role: 'user', text: q }); chatHist.push({ role: 'bot', text: wait.textContent.slice(0, 300) });
})
.catch(function () {
return localReply(q).then(function (html) {
wait.className = 'ai-m bot'; wait.innerHTML = html;
wait.querySelectorAll('a').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
chatHist.push({ role: 'user', text: q }); chatHist.push({ role: 'bot', text: wait.textContent.slice(0, 300) });
}).catch(function () {
wait.className = 'ai-m bot';
wait.innerHTML = 'माफ़ कीजिए, अभी जवाब नहीं आ पाया। थोड़ी देर बाद फिर पूछें, या <a href="https://wa.me/918689096000" target="_blank" rel="noopener">WhatsApp करें</a>।';
});
})
.then(function () { clearTimeout(to); busy = false; msgs.scrollTop = msgs.scrollHeight; });
}
form.addEventListener('submit', function (e) { e.preventDefault(); var q = inp.value; inp.value = ''; ask(q); });
function open(o) {
box.hidden = !o; document.body.classList.toggle('chat-open', o); btn.setAttribute('aria-expanded', String(o));
if (o) setTimeout(function () { inp.focus(); }, 50);
}
btn.addEventListener('click', function () { open(box.hidden); });
box.querySelector('.ai-x').addEventListener('click', function () { open(false); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) open(false); });
}
chatInit();
var tt = document.getElementById('totop');
if (tt) window.addEventListener('scroll', function () { tt.hidden = window.scrollY < 900; }, { passive: true });
if (app) {
load(true);
setInterval(function () { load(false); }, 2 * 60000);
setInterval(setUpdated, 60000);
}
})();
