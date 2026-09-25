/* 24x7 News Time — Sponsor Ads (photo banners) v3
   Images: /assets/ads/*.jpg  |  Naya ad = ADS list mein ek block copy karein. */
(function () {
  var ADS = [
    {
      brand: "CGA", sub: "Canjain Global Advisors",
      call: "011-71906890", tel: "tel:+911171906890",
      l1: "CA · Advocate · CMA · CS", l2: "आयकर · GST · कंपनी रजिस्ट्रेशन · केस",
      cta: "यहाँ क्लिक करें", link: "https://cgaindia.com/",
      imgs: ["/assets/ads/cga-1.jpg", "/assets/ads/cga-2.jpg"],
      alt: "CGA ऑफिस",
      color: "#005176", accent: "#f5b301"
    },
    {
      brand: "DHIMAN ENVIRO", sub: "Poultry Equipment Manufacturer",
      call: "74949 62137", tel: "tel:+917494962137",
      l1: "वेंटिलेशन | कूलिंग पैड | फीडिंग", l2: "मैन्युफैक्चरर · सफीदों, हरियाणा",
      cta: "WhatsApp पर कोटेशन",
      link: "https://wa.me/917494962137?text=Hello%20Dhiman%20Enviro%2C%20I%27d%20like%20a%20quote.%20(24x7%20News%20Time)",
      imgs: ["/assets/ads/de-1.jpg", "/assets/ads/de-2.jpg"],
      alt: "Dhiman Enviro पोल्ट्री उपकरण",
      color: "#16143a", accent: "#4fd1c5"
    },
    {
      brand: "PracEasy", sub: "CA फर्म्स का प्रैक्टिस सॉफ्टवेयर",
      call: "98999 00300", tel: "tel:+919899900300",
      l1: "क्लाइंट | टास्क | डेडलाइन | बिलिंग", l2: "सब एक स्क्रीन पर · 14 दिन फ्री",
      cta: "फ्री डेमो लें", link: "https://praceasy.in/",
      mock: true,
      color: "#6C3BF4", color2: "#E8469B", accent: "#12B5A8"
    }
  ];
  var ROTATE_MS = 7000;

  var css = [
  ".nt-bn{--c:#005176;--c2:var(--c);--a:#f5b301;position:relative;display:grid;grid-template-columns:36% 28% 36%;box-sizing:border-box;",
  "max-width:1200px;margin:12px auto;height:140px;background:#fff;border:1px solid #e3e3e3;border-radius:6px;overflow:hidden;font-family:inherit;color:#1a1a1a}",
  ".nt-bn *{box-sizing:border-box}",
  ".nt-bn__l{background:linear-gradient(135deg,var(--c),var(--c2));color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right;padding:10px 26px 10px 14px;min-width:0}",
  ".nt-bn__brand{font-weight:800;font-size:40px;line-height:1.05;letter-spacing:.01em;color:#fff;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
  ".nt-bn__sub{font-size:12px;opacity:.85;margin-top:2px}",
  ".nt-bn__call{margin-top:8px;font-weight:700;font-size:16px;color:#fff;text-decoration:none}",
  ".nt-bn__m{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:4px;padding:8px 12px;",
  "border-left:3px double var(--c);border-right:3px double var(--c);min-width:0}",
  ".nt-bn__t1{font-size:17px;font-weight:600;line-height:1.3}",
  ".nt-bn__t2{font-size:14px;color:#444;line-height:1.3}",
  ".nt-bn__cta{margin-top:6px;display:inline-block;background:linear-gradient(#ff8a3d,#e8590c);color:#fff;font-weight:700;font-size:14px;",
  "padding:6px 14px;border-radius:5px;text-decoration:none;box-shadow:0 2px 0 #b8460a;white-space:nowrap}",
  ".nt-bn__cta:focus-visible,.nt-bn a:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}",
  ".nt-bn__r{display:flex;gap:6px;padding:6px;align-items:stretch;min-width:0}",
  ".nt-bn__r img{flex:1;min-width:0;width:50%;height:100%;object-fit:cover;border-radius:4px;background:#eee;display:block}",
  ".nt-bn__tag{position:absolute;top:3px;left:6px;font-size:10px;color:#fff;background:rgba(0,0,0,.35);padding:1px 6px;border-radius:3px;z-index:2}",
  ".nt-bn__dots{position:absolute;bottom:5px;right:8px;display:flex;gap:4px;z-index:2}",
  ".nt-bn__dots i{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.35);opacity:.5}",
  ".nt-bn__dots i.on{opacity:1}",
  ".nt-mock{flex:1;border-radius:6px;background:#f6f4ff;border:1px solid #e4defc;padding:8px 10px;display:flex;flex-direction:column;gap:5px;font-size:12px;color:#2b2150}",
  ".nt-mock__h{display:flex;align-items:center;gap:6px;font-weight:700}",
  ".nt-mock__row{display:flex;justify-content:space-between;background:#fff;border-radius:4px;padding:3px 7px;border-left:3px solid var(--a)}",
  ".nt-mock__row b{color:#e8469b;font-weight:700}",
  ".nt-fade{animation:ntfade .45s ease}@keyframes ntfade{from{opacity:.25}to{opacity:1}}",
  "@media (prefers-reduced-motion:reduce){.nt-fade{animation:none}}",
  "@media (max-width:760px){",
  " .nt-bn{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;height:auto;margin:10px 8px}",
  " .nt-bn__l{grid-column:1;grid-row:1;align-items:flex-start;text-align:left;padding:18px 12px 10px}",
  " .nt-bn__brand{font-size:24px;white-space:normal}",
  " .nt-bn__call{font-size:14px;margin-top:6px}",
  " .nt-bn__r{grid-column:2;grid-row:1;height:118px}",
  " .nt-bn__r img+img{display:none}.nt-bn__r img{width:100%}",
  " .nt-bn__m{grid-column:1 / span 2;grid-row:2;border:0;border-top:3px double var(--c);padding:8px 10px 14px}",
  " .nt-bn__t1{font-size:15px}.nt-bn__t2{font-size:13px}",
  " .nt-mock{font-size:11px;padding:6px}",
  "}",
  ".nt-sponsors{max-width:1200px;margin:16px auto;padding:0 12px}",
  ".nt-sponsors h4{font-size:14px;margin:0 0 4px;opacity:.8}",
  ".nt-sponsors .nt-bn{margin:8px 0}",
  "@media (max-width:760px){.nt-sponsors{padding:0}.nt-sponsors h4{padding:0 8px}.nt-sponsors .nt-bn{margin:8px}}",
  ".nt-sticky{display:none}",
  "@media (max-width:640px){",
  " .nt-sticky{display:flex;align-items:center;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:9990;background:var(--c);color:#fff;",
  " padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));box-shadow:0 -2px 8px rgba(0,0,0,.2);font-family:inherit}",
  " .nt-sticky img{width:52px;height:40px;object-fit:cover;border-radius:4px;flex:none}",
  " .nt-sticky__b{flex:1;min-width:0;font-weight:800;font-size:14px;line-height:1.2}",
  " .nt-sticky__b span{display:block;font-weight:400;font-size:11px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  " .nt-sticky a.nt-bn__cta{margin:0;font-size:12px;padding:6px 10px}",
  " .nt-sticky__x{position:absolute;top:-24px;right:6px;background:#222;color:#fff;border:0;border-radius:6px 6px 0 0;font-size:12px;padding:3px 9px;cursor:pointer}",
  " body.nt-has-sticky{padding-bottom:64px}",
  " body.nt-has-sticky .wa-fab{bottom:78px}",
  "}"
  ].join("\n");

  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function link(c, txt, href) { var a = el("a", c, txt); a.href = href; if (href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "sponsored noopener"; } return a; }

  function mock(ad) {
    var m = el("div", "nt-mock");
    var h = el("div", "nt-mock__h");
    var ic = el("span"); ic.style.cssText = "width:16px;height:16px;border-radius:4px;background:linear-gradient(135deg," + ad.color + "," + ad.color2 + ")";
    h.appendChild(ic); h.appendChild(document.createTextNode("PracEasy डैशबोर्ड"));
    m.appendChild(h);
    [["GSTR-3B", "8 दिन"], ["TDS चालान", "आज"], ["ROC फाइलिंग", "12 दिन"]].forEach(function (r) {
      var row = el("div", "nt-mock__row"); row.appendChild(el("span", "", r[0])); row.appendChild(el("b", "", r[1])); m.appendChild(row);
    });
    return m;
  }

  function banner(box, ad, idx, dots, lazy) {
    box.innerHTML = "";
    box.style.setProperty("--c", ad.color);
    box.style.setProperty("--c2", ad.color2 || ad.color);
    box.style.setProperty("--a", ad.accent);
    box.appendChild(el("span", "nt-bn__tag", "विज्ञापन"));
    var l = el("div", "nt-bn__l");
    l.appendChild(link("nt-bn__brand", ad.brand, ad.link));
    l.appendChild(el("div", "nt-bn__sub", ad.sub));
    l.appendChild(link("nt-bn__call", "Call : " + ad.call, ad.tel));
    var m = el("div", "nt-bn__m");
    m.appendChild(el("div", "nt-bn__t1", ad.l1));
    m.appendChild(el("div", "nt-bn__t2", ad.l2));
    m.appendChild(link("nt-bn__cta", ad.cta, ad.link));
    var r = el("div", "nt-bn__r");
    if (ad.mock) r.appendChild(mock(ad));
    else (ad.imgs || []).forEach(function (src) {
      var im = el("img"); im.src = src; im.alt = ad.alt || ad.brand; im.width = 320; im.height = 180; im.decoding = "async";
      if (lazy) im.loading = "lazy";
      im.onerror = function () { im.style.visibility = "hidden"; };
      r.appendChild(im);
    });
    box.appendChild(l); box.appendChild(m); box.appendChild(r);
    if (dots) {
      var d = el("div", "nt-bn__dots");
      for (var k = 0; k < ADS.length; k++) { var i = el("i"); if (k === idx) i.className = "on"; d.appendChild(i); }
      box.appendChild(d);
    }
  }

  function rotator() {
    var box = el("div", "nt-bn"); box.setAttribute("role", "complementary"); box.setAttribute("aria-label", "विज्ञापन");
    var i = 0, paused = false;
    banner(box, ADS[0], 0, true, false);
    box.addEventListener("mouseenter", function () { paused = true; });
    box.addEventListener("mouseleave", function () { paused = false; });
    box.addEventListener("focusin", function () { paused = true; });
    box.addEventListener("focusout", function () { paused = false; });
    setInterval(function () {
      if (paused || document.hidden) return;
      i = (i + 1) % ADS.length;
      banner(box, ADS[i], i, true, false);
      box.classList.remove("nt-fade"); void box.offsetWidth; box.classList.add("nt-fade");
    }, ROTATE_MS);
    return box;
  }

  function sticky() {
    try { if (sessionStorage.getItem("nt-ad-closed") === "1") return; } catch (e) {}
    if (!window.matchMedia("(max-width:640px)").matches) return;
    var w = el("div", "nt-sticky"), i = 0;
    function fill() {
      var ad = ADS[i]; w.innerHTML = ""; w.style.setProperty("--c", ad.color);
      var x = el("button", "nt-sticky__x", "✕ बंद करें"); x.type = "button"; x.setAttribute("aria-label", "विज्ञापन बंद करें");
      x.onclick = function () { w.remove(); document.body.classList.remove("nt-has-sticky"); try { sessionStorage.setItem("nt-ad-closed", "1"); } catch (e) {} };
      w.appendChild(x);
      if (ad.imgs && ad.imgs[0]) { var im = el("img"); im.src = ad.imgs[0]; im.alt = ""; w.appendChild(im); }
      var b = el("div", "nt-sticky__b", ad.brand); b.appendChild(el("span", "", ad.l1)); w.appendChild(b);
      w.appendChild(link("nt-bn__cta", ad.cta, ad.link));
    }
    i = 1 % ADS.length; fill();
    setInterval(function () { if (document.hidden) return; i = (i + 1) % ADS.length; fill(); }, ROTATE_MS + 1000);
    document.body.appendChild(w); document.body.classList.add("nt-has-sticky");
  }

  function init() {
    if (document.getElementById("nt-ads-css")) return;
    var st = el("style"); st.id = "nt-ads-css"; st.textContent = css; document.head.appendChild(st);
    var app = document.getElementById("app") || document.querySelector("main");
    var top = rotator();
    if (app && app.parentNode) app.parentNode.insertBefore(top, app); else document.body.insertBefore(top, document.body.firstChild);
    var sp = el("section", "nt-sponsors"); sp.setAttribute("aria-label", "विज्ञापन");
    sp.appendChild(el("h4", "", "हमारे सहयोगी"));
    ADS.forEach(function (ad, k) { var b = el("div", "nt-bn"); banner(b, ad, k, false, true); sp.appendChild(b); });
    var foot = document.querySelector("footer");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(sp, foot); else document.body.appendChild(sp);
    sticky();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
