/* 24x7 News Time - front-end */
(function () {
  "use strict";

  var TEXT = {
    en: {
      tagline: "Har pal, har khabar",
      live: "Live, IST",
      latest: "Latest",
      search: "Search headlines",
      updated: "Updated",
      more: "More",
      news: "news",
      stories: "stories",
      topHeadlines: "Top headlines",
      results: "results for",
      noResults: "No headlines match this search. Try a shorter word or pick a section above.",
      emptyTitle: "News is on its way",
      emptyBody: "The first automatic update has not run yet. Headlines appear here within a few minutes of the update finishing.",
      errorTitle: "Headlines could not load",
      errorBody: "Check your internet connection, then reload the page.",
      reload: "Reload page",
      footerAbout: "Headlines from trusted Indian and international publishers, gathered automatically and refreshed through the day. Every story opens on the original publisher's website.",
      dark: "Dark", light: "Light",
      skip: "Skip to news"
    },
    hi: {
      tagline: "हर पल, हर खबर",
      live: "लाइव, IST",
      latest: "ताज़ा",
      search: "खबरें खोजें",
      updated: "अपडेट",
      more: "और",
      news: "खबरें",
      stories: "खबरें",
      topHeadlines: "बड़ी खबरें",
      results: "नतीजे:",
      noResults: "इस खोज से कोई खबर नहीं मिली। छोटा शब्द आज़माएं या ऊपर से कोई सेक्शन चुनें।",
      emptyTitle: "खबरें आ रही हैं",
      emptyBody: "पहला ऑटोमैटिक अपडेट अभी नहीं चला है। अपडेट पूरा होते ही कुछ मिनट में खबरें यहां दिखेंगी।",
      errorTitle: "खबरें लोड नहीं हो सकीं",
      errorBody: "इंटरनेट कनेक्शन जांचें और पेज दोबारा लोड करें।",
      reload: "पेज दोबारा लोड करें",
      footerAbout: "भरोसेमंद भारतीय और अंतरराष्ट्रीय प्रकाशकों की सुर्खियां, दिनभर अपने आप अपडेट। हर खबर मूल प्रकाशक की वेबसाइट पर खुलती है।",
      dark: "डार्क", light: "लाइट",
      skip: "खबरों पर जाएं"
    }
  };

  var state = {
    lang: store("lang") || "en",
    data: null,
    error: false,
    query: ""
  };

  var $ = function (id) { return document.getElementById(id); };

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function t(key) { return TEXT[state.lang][key]; }

  function locale() { return state.lang === "hi" ? "hi-IN" : "en-IN"; }

  /* ---------- Time helpers ---------- */
  function timeAgo(iso) {
    var then = new Date(iso).getTime();
    if (isNaN(then)) return "";
    var diff = Math.round((then - Date.now()) / 1000);
    var rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
    var abs = Math.abs(diff);
    if (abs < 60) return rtf.format(Math.round(diff), "second");
    if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
    return rtf.format(Math.round(diff / 86400), "day");
  }

  function tickClock() {
    var now = new Date();
    $("clock").textContent = now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
    $("today").textContent = now.toLocaleDateString(locale(), {
      timeZone: "Asia/Kolkata", weekday: window.innerWidth < 640 ? "short" : "long", day: "numeric", month: window.innerWidth < 640 ? "short" : "long", year: "numeric"
    });
  }

  /* ---------- Data ---------- */
  function categories() {
    if (!state.data || !state.data.languages) return [];
    var l = state.data.languages[state.lang] || state.data.languages.en;
    return (l && l.categories) || [];
  }

  function hasNews() {
    return categories().some(function (c) { return c.items && c.items.length; });
  }

  function load() {
    // Cache-bust every 10 minutes so visitors get fresh files
    var v = Math.floor(Date.now() / 600000);
    return fetch("data/news.json?v=" + v, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (json) { state.data = json; state.error = false; })
      .catch(function () { state.error = true; });
  }

  /* ---------- Rendering pieces ---------- */
  function favicon(domain) {
    if (!domain) return "";
    return '<img src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) +
      '&sz=32" alt="" width="16" height="16" loading="lazy" onerror="this.remove()">';
  }

  function meta(item) {
    return '<div class="meta">' + favicon(item.d) + "<span>" + esc(item.s) + '</span><span class="sep" aria-hidden="true"></span>' +
      '<time datetime="' + esc(item.p) + '">' + esc(timeAgo(item.p)) + "</time></div>";
  }

  function link(item, cls) {
    var c = cls == null ? "story-title" : cls;
    return '<a' + (c ? ' class="' + c + '"' : "") + ' href="' + esc(item.l) +
      '" target="_blank" rel="noopener nofollow">' + esc(item.t) + "</a>";
  }

  function storyList(items, cls) {
    return '<ul class="story-grid ' + (cls || "") + '">' + items.map(function (i) {
      return "<li>" + link(i) + meta(i) + "</li>";
    }).join("") + "</ul>";
  }

  function renderNav(active) {
    var cats = categories();
    if (!cats.length) cats = [{ id: "top", label: state.lang === "hi" ? "मुख्य खबरें" : "Top stories" }];
    $("navList").innerHTML = cats.map(function (c) {
      return '<li><a href="#/' + c.id + '"' + (c.id === active ? ' aria-current="page"' : "") + ">" + esc(c.label) + "</a></li>";
    }).join("");
    $("footerSections").innerHTML = cats.slice(1, 7).map(function (c) {
      return '<li><a href="#/' + c.id + '">' + esc(c.label) + "</a></li>";
    }).join("");
  }

  function renderTicker() {
    var top = categories()[0];
    var items = top && top.items ? top.items.slice(0, 12) : [];
    if (!items.length) { $("ticker").hidden = true; return; }
    var html = items.map(function (i) { return link(i, ""); }).join("");
    $("tickerMove").innerHTML = html + html.replace(/<a /g, '<a tabindex="-1" aria-hidden="true" ');
    $("tickerLabel").textContent = t("latest");
    $("ticker").hidden = false;
  }

  function notice(title, body, withButton) {
    return '<div class="notice"><h2>' + esc(title) + "</h2><p>" + esc(body) + "</p>" +
      (withButton ? '<button class="btn" type="button" onclick="location.reload()">' + esc(t("reload")) + "</button>" : "") +
      "</div>";
  }

  function viewHome() {
    var cats = categories();
    var top = cats[0];
    var items = top.items || [];
    var lead = items[0];
    var side = items.slice(1, 6);

    var html = '<h1 class="sr-only">24x7 News Time</h1><div class="top-grid">';
    if (lead) {
      html += '<article class="lead"><div class="lead-body"><h2>' + link(lead, "") + "</h2></div>" +
        '<div class="lead-bar">' + favicon(lead.d) + "<span>" + esc(lead.s) + "</span><time datetime=\"" + esc(lead.p) + "\">" +
        esc(timeAgo(lead.p)) + "</time></div></article>";
    }
    html += '<aside class="side"><h2>' + esc(t("topHeadlines")) + "</h2><ol>" + side.map(function (i) {
      return "<li>" + link(i) + meta(i) + "</li>";
    }).join("") + "</ol></aside></div>";

    // Home also shows the rest of the top stories after the lead block
    var restTop = items.slice(6, 12);
    if (restTop.length) html += '<section class="section">' + storyList(restTop) + "</section>";

    cats.slice(1).forEach(function (c) {
      if (!c.items || !c.items.length) return;
      html += '<section class="section" aria-labelledby="h-' + c.id + '">' +
        '<div class="section-head"><h2 id="h-' + c.id + '"><a href="#/' + c.id + '">' + esc(c.label) + "</a></h2>" +
        '<a class="more" href="#/' + c.id + '">' + esc(t("more")) + " " + esc(c.label) + "</a></div>" +
        storyList(c.items.slice(0, 6)) + "</section>";
    });
    return html;
  }

  function viewCategory(cat) {
    return '<div class="page-head"><h1>' + esc(cat.label) + "</h1><p>" + cat.items.length + " " + esc(t("stories")) + "</p></div>" +
      storyList(cat.items, "wide");
  }

  function viewSearch(q) {
    var needle = q.toLowerCase();
    var seen = {};
    var hits = [];
    categories().forEach(function (c) {
      (c.items || []).forEach(function (i) {
        if (seen[i.l]) return;
        if (i.t.toLowerCase().indexOf(needle) !== -1 || String(i.s).toLowerCase().indexOf(needle) !== -1) {
          seen[i.l] = true; hits.push(i);
        }
      });
    });
    hits.sort(function (a, b) { return a.p < b.p ? 1 : -1; });
    var head = '<div class="page-head"><h1>' + esc(q) + "</h1><p>" + hits.length + " " + esc(t("results")) + " " + esc(q) + "</p></div>";
    return head + (hits.length ? storyList(hits, "wide") : notice(t("noResults"), "", false).replace("<p></p>", ""));
  }

  function render() {
    var route = (location.hash.replace(/^#\/?/, "") || "top").split("?")[0];
    var view = $("view");
    var cats = categories();

    document.documentElement.lang = state.lang;
    $("tagline").textContent = t("tagline");
    $("clockLabel").textContent = t("live");
    $("q").placeholder = t("search");
    $("footerAbout").textContent = t("footerAbout");
    document.querySelector(".skip").textContent = t("skip");
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang));
    });
    updateThemeLabel();

    if (state.data && state.data.updated) {
      $("updated").textContent = t("updated") + " " + timeAgo(state.data.updated);
    }

    renderNav(state.query ? "" : route);
    renderTicker();

    if (state.error && !state.data) { view.innerHTML = notice(t("errorTitle"), t("errorBody"), true); return; }
    if (!hasNews()) { view.innerHTML = notice(t("emptyTitle"), t("emptyBody"), true); return; }

    if (state.query) { view.innerHTML = viewSearch(state.query); return; }

    var cat = cats.filter(function (c) { return c.id === route; })[0];
    if (!cat || route === "top") {
      view.innerHTML = viewHome();
      document.title = "24x7 News Time | " + (state.lang === "hi" ? "ताज़ा हिंदी खबरें" : "Latest India, World, Business & Sports News");
    } else {
      view.innerHTML = viewCategory(cat);
      document.title = cat.label + " " + t("news") + " | 24x7 News Time";
    }
  }

  function renderSkeleton() {
    var rows = new Array(8).join("<span></span>");
    $("view").innerHTML = '<div class="skeleton" aria-hidden="true">' + rows + "</div>";
  }

  /* ---------- Theme ---------- */
  function isDark() {
    var d = document.documentElement.dataset.theme;
    if (d) return d === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function updateThemeLabel() {
    var btn = $("themeBtn");
    btn.textContent = isDark() ? t("light") : t("dark");
    btn.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode");
  }

  /* ---------- Events ---------- */
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.lang = btn.dataset.lang;
      store("lang", state.lang);
      render();
    });
  });

  $("themeBtn").addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store("theme", next);
    updateThemeLabel();
  });

  var searchTimer;
  $("q").addEventListener("input", function (e) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = e.target.value.trim();
      render();
    }, 200);
  });
  $("searchForm").addEventListener("submit", function (e) { e.preventDefault(); });

  window.addEventListener("hashchange", function () {
    state.query = "";
    $("q").value = "";
    render();
    window.scrollTo(0, 0);
  });

  /* ---------- Start ---------- */
  $("year").textContent = new Date().getFullYear();
  tickClock();
  setInterval(tickClock, 1000);
  renderSkeleton();
  load().then(render);

  // Refresh data quietly every 15 minutes; re-render only if there is a newer update
  setInterval(function () {
    var before = state.data && state.data.updated;
    load().then(function () {
      if (state.data && state.data.updated !== before) render();
    });
  }, 15 * 60 * 1000);

  // Keep "x minutes ago" labels honest without redrawing the page
  setInterval(function () {
    document.querySelectorAll("time[datetime]").forEach(function (el) {
      el.textContent = timeAgo(el.getAttribute("datetime"));
    });
    if (state.data && state.data.updated) {
      $("updated").textContent = t("updated") + " " + timeAgo(state.data.updated);
    }
  }, 60 * 1000);
})();
