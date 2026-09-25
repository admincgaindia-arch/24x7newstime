/* 24x7 News Time — Sponsor Ads module
   Upload as /assets/ads.js and add before </body> in index.html:
   <script src="/assets/ads.js" defer></script>
   Ads edit karne ke liye sirf neeche ADS list badlein. */
(function () {
  var ADS = [
    {
      brand: "CGA — Canjain Global Advisors",
      line: "CA · Advocate · CMA · CS — ek hi chhat ke neeche",
      text: "आयकर, GST, कंपनी रजिस्ट्रेशन, ट्रेडमार्क, नोटिस व केस — पूरे भारत में सेवा",
      cta: "कॉल करें",
      link: "tel:+911171906890",
      site: "https://cgaindia.com",
      color: "#0b3b8c", accent: "#f5b301"
    },
    {
      brand: "Dhiman Enviro Pvt. Ltd.",
      line: "पोल्ट्री शेड के उपकरण — सफीदों में बने, पूरे भारत में लगे",
      text: "वेंटिलेशन फैन, कूलिंग पैड, फीडिंग व निप्पल ड्रिंकिंग सिस्टम · ISO 9001:2015",
      cta: "WhatsApp पर कोटेशन",
      link: "https://wa.me/917494962137?text=Hello%20Dhiman%20Enviro%2C%20I%27d%20like%20a%20quote.%20(24x7%20News%20Time)",
      site: "https://dhimanenviro.com/",
      color: "#16143a", accent: "#4fd1c5"
    },
    {
      brand: "PracEasy",
      line: "CA फर्म्स के लिए प्रैक्टिस मैनेजमेंट सॉफ्टवेयर",
      text: "क्लाइंट, टास्क, डेडलाइन और बिलिंग — सब एक जगह",
      cta: "डेमो देखें",
      link: "https://praceasy.in",
      site: "https://praceasy.in",
      color: "#4a2a8c", accent: "#ff8a3d"
    }
  ];
  var ROTATE_MS = 7000;

  var css = "\
.nt-ad{--c:#0b3b8c;--a:#f5b301;position:relative;display:flex;align-items:center;gap:14px;box-sizing:border-box;\
max-width:1200px;margin:12px auto;padding:12px 16px 12px 20px;background:var(--c);color:#fff;border-radius:10px;\
font-family:inherit;overflow:hidden;min-height:78px;text-decoration:none}\
.nt-ad::before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--a)}\
.nt-ad__tag{position:absolute;top:4px;right:8px;font-size:10px;opacity:.75;letter-spacing:.02em}\
.nt-ad__body{flex:1;min-width:0}\
.nt-ad__brand{font-weight:800;font-size:18px;line-height:1.2;margin:0}\
.nt-ad__line{font-size:13px;color:var(--a);font-weight:600;margin:2px 0 0}\
.nt-ad__text{font-size:13px;opacity:.92;margin:3px 0 0}\
.nt-ad__cta{flex:none;background:var(--a);color:#111;font-weight:700;font-size:14px;padding:9px 16px;border-radius:999px;\
text-decoration:none;white-space:nowrap}\
.nt-ad__cta:focus-visible,.nt-ad a:focus-visible{outline:3px solid #fff;outline-offset:2px}\
.nt-ad__dots{position:absolute;bottom:5px;right:10px;display:flex;gap:4px}\
.nt-ad__dots i{width:6px;height:6px;border-radius:50%;background:#fff;opacity:.35}\
.nt-ad__dots i.on{opacity:1}\
.nt-ad--fade{animation:ntfade .45s ease}\
@keyframes ntfade{from{opacity:.2}to{opacity:1}}\
.nt-ad-sticky{display:none}\
@media (max-width:640px){\
 .nt-ad{margin:10px 8px;padding:10px 12px 14px 16px;gap:10px}\
 .nt-ad__brand{font-size:15px}.nt-ad__text{display:none}.nt-ad__cta{font-size:13px;padding:8px 12px}\
 .nt-ad-sticky{display:block;position:fixed;left:0;right:0;bottom:0;z-index:9990;padding-bottom:env(safe-area-inset-bottom,0px)}\
 .nt-ad-sticky .nt-ad{margin:0;border-radius:0;min-height:60px}\
 .nt-ad-sticky__x{position:absolute;top:-26px;right:6px;background:#222;color:#fff;border:0;border-radius:6px 6px 0 0;\
 font-size:13px;padding:4px 10px;cursor:pointer}\
 body.nt-has-sticky{padding-bottom:70px}\
}\
@media (prefers-reduced-motion:reduce){.nt-ad--fade{animation:none}}\
.nt-sponsors{max-width:1200px;margin:16px auto;padding:0 12px;box-sizing:border-box}\
.nt-sponsors h4{font-size:14px;margin:0 0 8px;opacity:.8}\
.nt-sponsors__row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}\
.nt-sponsors .nt-ad{margin:0;min-height:0}\
.nt-sponsors .nt-ad__text{display:none}";

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.textContent = h; return e; }

  function render(box, ad, i, withDots) {
    box.innerHTML = "";
    box.style.setProperty("--c", ad.color);
    box.style.setProperty("--a", ad.accent);
    box.appendChild(el("span", "nt-ad__tag", "विज्ञापन"));
    var body = el("div", "nt-ad__body");
    var brand = el("p", "nt-ad__brand");
    if (ad.site) { var s = el("a", "", ad.brand); s.href = ad.site; s.target = "_blank"; s.rel = "sponsored noopener"; s.style.color = "#fff"; s.style.textDecoration = "none"; brand.appendChild(s); }
    else brand.textContent = ad.brand;
    body.appendChild(brand);
    body.appendChild(el("p", "nt-ad__line", ad.line));
    body.appendChild(el("p", "nt-ad__text", ad.text));
    box.appendChild(body);
    if (ad.link) {
      var c = el("a", "nt-ad__cta", ad.cta);
      c.href = ad.link;
      if (ad.link.indexOf("http") === 0) { c.target = "_blank"; c.rel = "sponsored noopener"; }
      box.appendChild(c);
    }
    if (withDots) {
      var d = el("div", "nt-ad__dots");
      for (var k = 0; k < ADS.length; k++) { var dot = el("i"); if (k === i) dot.className = "on"; d.appendChild(dot); }
      box.appendChild(d);
    }
  }

  function rotator(startAt) {
    var box = el("div", "nt-ad");
    box.setAttribute("role", "complementary");
    box.setAttribute("aria-label", "विज्ञापन");
    var i = startAt % ADS.length, paused = false;
    render(box, ADS[i], i, true);
    box.addEventListener("mouseenter", function () { paused = true; });
    box.addEventListener("mouseleave", function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      i = (i + 1) % ADS.length;
      render(box, ADS[i], i, true);
      box.classList.remove("nt-ad--fade"); void box.offsetWidth; box.classList.add("nt-ad--fade");
    }, ROTATE_MS);
    return box;
  }

  function init() {
    if (document.getElementById("nt-ads-css")) return;
    var st = el("style"); st.id = "nt-ads-css"; st.textContent = css; document.head.appendChild(st);

    // 1) Top banner — news list ke theek upar
    var app = document.getElementById("app") || document.querySelector("main");
    var top = rotator(0);
    if (app && app.parentNode) app.parentNode.insertBefore(top, app);
    else document.body.insertBefore(top, document.body.firstChild);

    // 2) Footer se pehle — saare sponsors ek saath
    var sp = el("section", "nt-sponsors");
    sp.appendChild(el("h4", "", "हमारे सहयोगी"));
    var row = el("div", "nt-sponsors__row");
    ADS.forEach(function (ad, k) { var b = el("div", "nt-ad"); render(b, ad, k, false); row.appendChild(b); });
    sp.appendChild(row);
    var foot = document.querySelector("footer");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(sp, foot); else document.body.appendChild(sp);

    // 3) Mobile sticky bottom bar (band kiya ja sakta hai)
    try { if (sessionStorage.getItem("nt-ad-closed") === "1") return; } catch (e) {}
    var wrap = el("div", "nt-ad-sticky");
    var x = el("button", "nt-ad-sticky__x", "✕ बंद करें");
    x.setAttribute("aria-label", "विज्ञापन बंद करें");
    x.onclick = function () { wrap.remove(); document.body.classList.remove("nt-has-sticky"); try { sessionStorage.setItem("nt-ad-closed", "1"); } catch (e) {} };
    wrap.appendChild(x);
    wrap.appendChild(rotator(1));
    document.body.appendChild(wrap);
    if (window.matchMedia("(max-width:640px)").matches) document.body.classList.add("nt-has-sticky");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
