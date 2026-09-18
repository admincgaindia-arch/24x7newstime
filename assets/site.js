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
'<section class="box"><h2>सेक्शन</h2><div class="catlinks">' +
CATS.map(function (c) { return '<a href="#/c/' + c[0] + '">' + c[1] + '</a>'; }).join('') + '</div></section>' +
'<section class="box"><h2>हमारे बारे में</h2><p class="box-note"><strong>24x7 News Time</strong> पर देश के बड़े हिंदी प्रकाशकों की सुर्खियां हर 30 मिनट में अपने आप जुड़ती हैं। पूरी खबर पढ़ने के लिए शीर्षक पर क्लिक करें, वह मूल प्रकाशक की साइट पर खुलेगी।</p></section>' +
'</aside>';
}
function home() {
var used = {};
var top = DATA.top.map(function (id) { return BY[id]; }).filter(Boolean);
var lead = top.filter(function (x) { return x.img; })[0] || top[0] || latest()[0];
used[lead.id] = 1;
var side = top.filter(function (x) { return !used[x.id]; }).slice(0, 5);
side.forEach(function (x) { used[x.id] = 1; });
var h = '<div class="page"><div>';
h += '<section class="hero" aria-label="बड़ी खबरें"><article class="lead"><a ' + ext(lead) + '>' +
'<div class="th">' + (lead.img ? '<img src="' + esc(lead.img) + '" alt="" fetchpriority="high" referrerpolicy="no-referrer">' : '') + '<span class="badge">बड़ी खबर</span></div>' +
'<h1>' + esc(lead.t) + '</h1></a>' + (lead.d ? '<p>' + esc(lead.d) + '</p>' : '') + meta(lead, true) + share(lead) + '</article>' +
'<div class="tops"><h2>टॉप खबरें</h2>' + side.map(row).join('') + '</div></section>';
CATS.forEach(function (c) {
var list = byCat(c[0]).filter(function (x) { return !used[x.id]; });
if (list.length < 3) return;
var f = list.filter(function (x) { return x.img; })[0] || list[0];
var rest = list.filter(function (x) { return x !== f; }).slice(0, 4);
used[f.id] = 1; rest.forEach(function (x) { used[x.id] = 1; });
h += '<section class="sec" aria-label="' + c[1] + '">' + secHead(c[1], '#/c/' + c[0]) +
'<div class="block"><article><a class="feat" ' + ext(f) + '>' + thumb(f) + '<h3>' + esc(f.t) + '</h3>' +
(f.d ? '<p>' + esc(f.d) + '</p>' : '') + '</a>' + meta(f) + '</article><div class="tops">' + rest.map(row).join('') + '</div></div></section>';
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
chips = '<div class="chips" role="group" aria-label="राज्य चुनें"><button type="button" data-st="" aria-pressed="' + (!stateFilter) + '">सभी राज्य</button>' +
names.map(function (n) { return '<button type="button" data-st="' + esc(n) + '" aria-pressed="' + (stateFilter === n) + '">' + esc(n) + '</button>'; }).join('') + '</div>';
}
if (stateFilter) list = list.filter(function (x) { return x.st === stateFilter; });
}
return listView(CAT[c], list, { chips: chips });
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
function load(first) {
return fetch('data/news.json?t=' + Math.floor(Date.now() / 120000), { cache: 'no-store' })
.then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
.then(function (d) {
if (!d || !d.items || !d.items.length) throw new Error('empty');
if (first) { ingest(d); ticker(); route(); setUpdated(); return; }
if (DATA && d.updated !== DATA.updated) {
var pill = document.getElementById('fresh');
pill.hidden = false;
pill.onclick = function () { pill.hidden = true; ingest(d); ticker(); route(); setUpdated(); window.scrollTo({ top: 0 }); };
}
})
.catch(function () {
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
var s = e.target.closest('[data-st]');
if (s) { stateFilter = s.getAttribute('data-st'); shown = PAGE; route(); }
});
window.addEventListener('hashchange', function () {
shown = PAGE;
if (!/^#\/c\/rajya/.test(location.hash)) stateFilter = '';
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
if (app) {
load(true);
setInterval(function () { load(false); setUpdated(); }, 5 * 60000);
}
})();
