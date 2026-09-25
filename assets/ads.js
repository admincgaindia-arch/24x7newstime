/* 24x7 News Time — Sponsor Ads (photo banners) v4
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
  ".nt-wrap{margin-top:14px;margin-bottom:6px}",
  ".nt-bn{--c:#005176;--c2:var(--c);--a:#f5b301;position:relative;display:grid;grid-template-columns:34% 30% 36%;align-items:stretch;",
  "width:100%;min-height:140px;margin:0;background:#fff;border:1px solid #dfe3ea;border-radius:8px;overflow:hidden;",
  "font-family:var(--body,system-ui,sans-serif);color:#1a1a1a;line-height:1.2;box-shadow:0 1px 3px rgba(0,0,0,.06)}",
  ".nt-bn *{box-sizing:border-box;margin:0}",
  ".nt-bn__l{background:linear-gradient(135deg,var(--c),var(--c2));color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right;gap:4px;padding:14px 24px 14px 16px;min-width:0}",
  ".nt-bn__brand{display:block;font-family:var(--head,var(--body,system-ui));font-weight:700;font-size:44px;line-height:1;letter-spacing:.5px;color:#fff;text-decoration:none;max-width:100%;overflow-wrap:anywhere}",
  ".nt-bn__sub{display:block;font-size:13px;line-height:1.2;opacity:.85}",
  ".nt-bn__call{display:inline-block;margin-top:6px;font-weight:700;font-size:17px;line-height:1.2;color:#fff;text-decoration:none;white-space:nowrap}",
  ".nt-bn__m{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:6px;padding:12px 14px;",
  "border-left:4px double var(--c);border-right:4px double var(--c);min-width:0}",
  ".nt-bn__t1{font-size:18px;font-weight:700;line-height:1.25;color:#1a1a1a}",
  ".nt-bn__t2{font-size:15px;line-height:1.3;color:#4a4a4a}",
  ".nt-bn__cta{display:inline-block;margin-top:4px;background:linear-gradient(#ff8a3d,#e8590c);color:#fff !important;font-weight:700;font-size:15px;line-height:1.2;",
  "padding:7px 16px;border-radius:5px;text-decoration:none;box-shadow:0 2px 0 #b8460a;white-space:nowrap}",
  ".nt-bn__cta:hover{filter:brightness(1.07)}",
  ".nt-bn__cta:focus-visible,.nt-bn a:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}",
  ".nt-bn__r{display:flex;gap:6px;padding:6px;align-items:stretch;min-width:0;background:#fff}",
  ".nt-bn__r img{flex:1 1 0;min-width:0;width:50%;height:128px;max-width:none;object-fit:cover;border-radius:5px;background:#eef0f4;display:block}",
  ".nt-bn__tag{position:absolute;top:4px;left:6px;font-size:10px;line-height:1.4;color:#fff;background:rgba(0,0,0,.4);padding:0 6px;border-radius:3px;z-index:2}",
  ".nt-bn__dots{position:absolute;bottom:6px;right:10px;display:flex;gap:5px;z-index:2}",
  ".nt-bn__dots i{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.4);opacity:.5}",
  ".nt-bn__dots i.on{opacity:1}",
  ".nt-mock{flex:1;border-radius:6px;background:#f6f4ff;border:1px solid #e4defc;padding:8px 10px;display:flex;flex-direction:column;justify-content:center;gap:5px;font-size:13px;line-height:1.3;color:#2b2150}",
  ".nt-mock__h{display:flex;align-items:center;gap:6px;font-weight:700}",
  ".nt-mock__row{display:flex;justify-content:space-between;background:#fff;border-radius:4px;padding:3px 8px;border-left:3px solid var(--a)}",
  ".nt-mock__row b{color:#e8469b;font-weight:700}",
  ".nt-fade{animation:ntfade .45s ease}@keyframes ntfade{from{opacity:.25}to{opacity:1}}",
  "@media (prefers-reduced-motion:reduce){.nt-fade{animation:none}}",
  "@media (max-width:1000px){.nt-bn__brand{font-size:34px}.nt-bn__t1{font-size:16px}.nt-bn__t2{font-size:14px}}",
  "@media (max-width:760px){",
  " .nt-bn{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}",
  " .nt-bn__l{grid-column:1;grid-row:1;align-items:flex-start;text-align:left;padding:22px 12px 12px}",
  " .nt-bn__brand{font-size:28px}",
  " .nt-bn__call{font-size:15px;margin-top:4px}",
  " .nt-bn__r{grid-column:2;grid-row:1}",
  " .nt-bn__r img+img{display:none}.nt-bn__r img{width:100%;height:auto;min-height:120px}",
  " .nt-bn__m{grid-column:1 / span 2;grid-row:2;border:0;border-top:4px double var(--c);padding:10px 12px 16px}",
  " .nt-bn__t1{font-size:16px}.nt-bn__t2{font-size:14px}",
  " .nt-mock{font-size:11.5px;padding:6px}",
  "}",
  ".nt-sponsors{margin-top:18px;margin-bottom:18px}",
  ".nt-sponsors h4{font-family:var(--head,inherit);font-size:20px;line-height:1.2;margin:0 0 8px}",
  ".nt-sponsors .nt-bn{margin:0 0 10px}",
  ".nt-sticky{display:none}",
  "@media (max-width:640px){",
  " .nt-sticky{display:flex;align-items:center;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:9990;background:var(--c);color:#fff;line-height:1.2;",
  " padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));box-shadow:0 -2px 8px rgba(0,0,0,.2);font-family:var(--body,inherit)}",
  " .nt-sticky img{width:52px;height:40px;max-width:none;object-fit:cover;border-radius:4px;flex:none}",
  " .nt-sticky__b{flex:1;min-width:0;font-weight:800;font-size:14px;line-height:1.2}",
  " .nt-sticky__b span{display:block;font-weight:400;font-size:11px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  " .nt-sticky a.nt-bn__cta{margin:0;font-size:12px;padding:6px 10px}",
  " .nt-sticky__x{position:absolute;top:-24px;right:6px;background:#222;color:#fff;border:0;border-radius:6px 6px 0 0;font-size:12px;line-height:1.4;padding:3px 9px;cursor:pointer}",
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
    var topWrap = el("div", "wrap nt-wrap"); topWrap.appendChild(rotator());
    if (app && app.parentNode) app.parentNode.insertBefore(topWrap, app); else document.body.insertBefore(topWrap, document.body.firstChild);
    var sp = el("section", "wrap nt-sponsors"); sp.setAttribute("aria-label", "विज्ञापन");
    sp.appendChild(el("h4", "", "हमारे सहयोगी"));
    ADS.forEach(function (ad, k) { var b = el("div", "nt-bn"); banner(b, ad, k, false, true); sp.appendChild(b); });
    var foot = document.querySelector("footer");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(sp, foot); else document.body.appendChild(sp);
    sticky();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
