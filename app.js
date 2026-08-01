/* ============================================================================
   AI-103 STUDY APP — VIEWS + ROUTER  (window.App)
   ----------------------------------------------------------------------------
   Renders the six tabs into #view. Reads content from window.CONTENT and all
   progress/metrics from window.Store. Plain DOM, no framework, file://-safe.
   ========================================================================== */

(function () {
  "use strict";

  // ---- tiny DOM helpers ---------------------------------------------------
  function h(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function mount(node) { var v = document.getElementById("view"); clear(v); v.appendChild(node); v.scrollTop = 0; }
  var DOMAIN_NAME = {}; STUDY_DATA.domains.forEach(function (d) { DOMAIN_NAME[d.id] = d.name; });

  // ---- router -------------------------------------------------------------
  var TABS = [
    { id: "home", label: "Home", render: renderHome },
    { id: "practice", label: "Practice", render: renderPractice },
    { id: "cards", label: "Flashcards", render: renderFlashcards },
    { id: "guides", label: "Guides", render: renderGuides },
    { id: "mock", label: "Mock exam", render: renderMock },
    { id: "progress", label: "Progress", render: renderProgress }
  ];
  function go(id) { location.hash = "#" + id; }
  function current() { return (location.hash || "#home").slice(1).split("/")[0]; }
  function route() {
    var id = current();
    var tab = TABS.filter(function (t) { return t.id === id; })[0] || TABS[0];
    document.querySelectorAll(".nav-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-tab") === tab.id);
    });
    tab.render();
  }
  window.addEventListener("hashchange", route);

  function buildNav() {
    var nav = document.getElementById("nav");
    TABS.forEach(function (t) {
      var b = h("button", "nav-btn", t.label);
      b.setAttribute("data-tab", t.id);
      b.onclick = function () { go(t.id); };
      nav.appendChild(b);
    });
  }

  // ---- HOME ---------------------------------------------------------------
  function renderHome() {
    var wrap = h("div", "view-home");
    var r = Store.readiness();
    var gate = Store.gateStatus();
    var cc = Store.cardCounts();

    var hero = h("div", "hero");
    hero.appendChild(kpi("Days to exam", String(Store.daysToExam()), "Exam week Sep 28"));
    hero.appendChild(ring("Readiness", Math.round(r * 100), 85));
    hero.appendChild(kpi("Cards due", String(cc.due_today), cc.overdue + " overdue"));
    hero.appendChild(kpi("Streak", Store.streak() + " d", "study days in a row"));
    hero.appendChild(gateCard(gate));
    wrap.appendChild(hero);

    // Study now
    var sn = h("div", "studynow");
    var plan = Store.buildSession(8);
    var head = h("div", "sn-head");
    head.appendChild(h("h2", null, "Study now"));
    head.appendChild(h("p", "muted",
      plan.cards.length + " flashcard" + (plan.cards.length === 1 ? "" : "s") + " due  +  " +
      plan.questions.length + " questions  ·  focus: " + DOMAIN_NAME[plan.weakest]));
    sn.appendChild(head);
    var big = h("button", "btn btn-primary btn-lg", "Start tonight's session  →");
    big.onclick = startStudyNow;
    sn.appendChild(big);
    wrap.appendChild(sn);

    // shortcuts
    var grid = h("div", "shortcuts");
    grid.appendChild(shortcut("Practice questions", "Answer, get graded, see why", "practice"));
    grid.appendChild(shortcut("Flashcards", cc.due_today + " due today", "cards"));
    grid.appendChild(shortcut("Study guides", CONTENT.guides.length + " section(s)", "guides"));
    grid.appendChild(shortcut("Mock exam", "Timed, scored, feeds the gate", "mock"));
    wrap.appendChild(grid);

    mount(wrap);
  }
  function shortcut(title, sub, tab) {
    var c = h("button", "shortcut");
    c.appendChild(h("div", "sc-title", title));
    c.appendChild(h("div", "sc-sub muted", sub));
    c.onclick = function () { go(tab); };
    return c;
  }
  function kpi(title, val, sub) {
    var c = h("div", "card kpi");
    c.appendChild(h("div", "kpi-title", title));
    c.appendChild(h("div", "kpi-val", val));
    if (sub) c.appendChild(h("div", "kpi-sub muted", sub));
    return c;
  }
  function ring(title, pct, target) {
    var c = h("div", "card kpi ring-card");
    c.appendChild(h("div", "kpi-title", title));
    var v = h("div", "kpi-val", pct + "%");
    v.classList.add(pct >= target ? "good" : (pct >= target * 0.7 ? "warn" : "bad"));
    c.appendChild(v);
    var bar = h("div", "bar"); var fill = h("div", "bar-fill");
    fill.style.width = Math.min(100, pct) + "%";
    fill.classList.add(pct >= target ? "good" : (pct >= target * 0.7 ? "warn" : "bad"));
    bar.appendChild(fill); c.appendChild(bar);
    c.appendChild(h("div", "kpi-sub muted", "target " + target + "%"));
    return c;
  }
  function gateCard(gate) {
    var c = h("div", "card kpi");
    c.appendChild(h("div", "kpi-title", "Booking gate"));
    var v = h("div", "kpi-val", gate.passing + "/" + gate.needed);
    v.classList.add(gate.cleared ? "good" : "warn");
    c.appendChild(v);
    c.appendChild(h("div", "kpi-sub muted", "mocks ≥ " + gate.threshold + "%"));
    return c;
  }

  // ---- shared question runner --------------------------------------------
  // mode: "practice" (immediate feedback) | "mock" (grade at end)
  function runQuestions(list, mode, onFinish) {
    if (!list.length) { onFinish({ correct: 0, total: 0 }); return; }
    var i = 0, correctCount = 0, results = [];

    function next() {
      if (i >= list.length) { onFinish({ correct: correctCount, total: list.length, results: results }); return; }
      var q = list[i];
      var card = renderQuestion(q, mode, function (isCorrect, confidence) {
        if (isCorrect) correctCount++;
        results.push({ q: q, correct: isCorrect });
        if (mode === "practice" || mode === "mock") {
          Store.recordAnswer(q.id, isCorrect, confidence, q.domain);
        }
      }, function () { i++; next(); });
      var v = h("div", "runner");
      var prog = h("div", "runner-prog muted", (mode === "mock" ? "Question " : "Question ") + (i + 1) + " of " + list.length);
      v.appendChild(prog);
      v.appendChild(card);
      mount(v);
    }
    next();
  }

  function renderQuestion(q, mode, onGrade, onNext) {
    var wrap = h("div", "card qcard");
    var tags = h("div", "qtags muted");
    tags.textContent = q.domain + " · obj " + q.objective + " · " + q.difficulty +
      (q.type === "multi" ? " · choose all" : q.type === "order" ? " · put in order" : "");
    wrap.appendChild(tags);
    wrap.appendChild(h("div", "qstem", q.stem));

    var selected = [];         // keys (single/multi/yesno) or item ids (order)
    var submitted = false;
    var optsBox = h("div", "opts");

    if (q.type === "order") {
      var seqLabel = h("div", "seq muted", "Click the steps in order:");
      wrap.appendChild(seqLabel);
      q.items.forEach(function (it) {
        var o = h("button", "opt");
        o.textContent = it.text;
        o.onclick = function () {
          if (submitted || selected.indexOf(it.id) !== -1) return;
          selected.push(it.id);
          o.classList.add("picked");
          o.textContent = selected.length + ".  " + it.text;
        };
        optsBox.appendChild(o);
      });
    } else {
      q.options.forEach(function (opt) {
        var o = h("button", "opt");
        o.textContent = opt.key + ".  " + opt.text;
        o.onclick = function () {
          if (submitted) return;
          if (q.type === "multi") {
            var idx = selected.indexOf(opt.key);
            if (idx === -1) { selected.push(opt.key); o.classList.add("picked"); }
            else { selected.splice(idx, 1); o.classList.remove("picked"); }
          } else {
            selected = [opt.key];
            optsBox.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("picked"); });
            o.classList.add("picked");
          }
        };
        optsBox.appendChild(o);
      });
    }
    wrap.appendChild(optsBox);

    // confidence (practice only)
    var conf = "med";
    if (mode === "practice") {
      var cb = h("div", "conf");
      cb.appendChild(h("span", "conf-label muted", "Confidence:"));
      ["low", "med", "high"].forEach(function (level) {
        var b = h("button", "conf-btn" + (level === "med" ? " on" : ""), level);
        b.onclick = function () {
          conf = level;
          cb.querySelectorAll(".conf-btn").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
        };
        cb.appendChild(b);
      });
      wrap.appendChild(cb);
    }

    var actions = h("div", "actions");
    var submit = h("button", "btn btn-primary", mode === "mock" ? "Submit & next" : "Submit");
    actions.appendChild(submit);
    wrap.appendChild(actions);
    var fb = h("div", "feedback");
    wrap.appendChild(fb);

    submit.onclick = function () {
      if (submitted) return;
      if (!selected.length) { flash(submit, "Pick an answer first"); return; }
      submitted = true;
      var isCorrect = grade(q, selected);
      onGrade(isCorrect, conf);

      if (mode === "mock") { onNext(); return; }

      // practice feedback
      paintOptions(q, selected, optsBox);
      fb.classList.add(isCorrect ? "ok" : "no");
      fb.appendChild(h("div", "fb-head", isCorrect ? "Correct" : "Not quite"));
      if (q.why) fb.appendChild(labeled("Why", q.why));
      if (q.trap) fb.appendChild(labeled("Trap", q.trap));
      submit.style.display = "none";
      var nb = h("button", "btn btn-primary", "Next →");
      nb.onclick = onNext;
      actions.appendChild(nb);
    };
    return wrap;
  }

  function grade(q, selected) {
    if (q.type === "order") {
      if (selected.length !== q.correctOrder.length) return false;
      for (var i = 0; i < selected.length; i++) if (selected[i] !== q.correctOrder[i]) return false;
      return true;
    }
    var correctKeys = q.options.filter(function (o) { return o.correct; }).map(function (o) { return o.key; }).sort();
    var chosen = selected.slice().sort();
    if (chosen.length !== correctKeys.length) return false;
    return chosen.every(function (k, i) { return k === correctKeys[i]; });
  }
  function paintOptions(q, selected, box) {
    var btns = box.querySelectorAll(".opt");
    if (q.type === "order") {
      // show the correct order beneath
      var correctText = q.correctOrder.map(function (id, i) {
        var it = q.items.filter(function (x) { return x.id === id; })[0];
        return (i + 1) + ". " + it.text;
      }).join("   →   ");
      box.appendChild(h("div", "order-answer", "Correct order:  " + correctText));
      return;
    }
    q.options.forEach(function (opt, idx) {
      var b = btns[idx];
      if (opt.correct) b.classList.add("correct");
      if (selected.indexOf(opt.key) !== -1 && !opt.correct) b.classList.add("wrong");
    });
  }
  function labeled(label, text) {
    var d = h("div", "fb-line");
    d.appendChild(h("span", "fb-label", label + ": "));
    d.appendChild(document.createTextNode(text));
    return d;
  }
  function flash(btn, msg) {
    var old = btn.textContent; btn.textContent = msg; btn.classList.add("nudge");
    setTimeout(function () { btn.textContent = old; btn.classList.remove("nudge"); }, 1200);
  }

  function startStudyNow() {
    var plan = Store.buildSession(8);
    var cards = plan.cards.slice(0, 10);
    function doQuestions() {
      runQuestions(plan.questions, "practice", function (res) { showSessionDone(res, "Study session complete"); });
    }
    if (cards.length) runFlashcardDeck(cards, doQuestions);
    else doQuestions();
  }
  function showSessionDone(res, title) {
    var wrap = h("div", "card done");
    wrap.appendChild(h("h2", null, title));
    if (res.total) wrap.appendChild(h("div", "done-score", res.correct + " / " + res.total + " correct"));
    var row = h("div", "actions");
    var a = h("button", "btn btn-primary", "Back to Home"); a.onclick = function () { go("home"); };
    var b = h("button", "btn", "See progress"); b.onclick = function () { go("progress"); };
    row.appendChild(a); row.appendChild(b);
    wrap.appendChild(row);
    mount(wrap);
  }

  // ---- PRACTICE -----------------------------------------------------------
  function renderPractice() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Practice questions"));
    var missCount = Store.misses().length;

    var filters = h("div", "filters");
    filters.appendChild(filterBtn("All (" + CONTENT.questions.length + ")", function () {
      runQuestions(shuffleStable(CONTENT.questions), "practice", function (r) { showSessionDone(r, "Practice complete"); });
    }));
    filters.appendChild(filterBtn("Weakest domain: " + DOMAIN_NAME[Store.weakestDomain()], function () {
      var w = Store.weakestDomain();
      var list = CONTENT.questions.filter(function (q) { return q.domain === w; });
      runQuestions(list, "practice", function (r) { showSessionDone(r, "Practice complete"); });
    }));
    var mb = filterBtn("Retry my misses (" + missCount + ")", function () {
      var m = Store.misses();
      if (!m.length) return;
      runQuestions(m, "practice", function (r) { showSessionDone(r, "Misses cleared"); });
    });
    if (!missCount) mb.disabled = true;
    filters.appendChild(mb);
    wrap.appendChild(filters);

    // by domain
    var dom = h("div", "filters");
    STUDY_DATA.domains.forEach(function (d) {
      var n = CONTENT.questions.filter(function (q) { return q.domain === d.id; }).length;
      if (!n) return;
      dom.appendChild(filterBtn(d.id + " (" + n + ")", function () {
        var list = CONTENT.questions.filter(function (q) { return q.domain === d.id; });
        runQuestions(list, "practice", function (r) { showSessionDone(r, "Practice complete"); });
      }));
    });
    wrap.appendChild(h("div", "muted small", "Or drill one domain:"));
    wrap.appendChild(dom);
    mount(wrap);
  }
  function filterBtn(label, fn) { var b = h("button", "btn", label); b.onclick = fn; return b; }
  function shuffleStable(arr) { // deterministic light shuffle by id char
    return arr.slice().sort(function (a, b) { return (a.id.charCodeAt(4) % 5) - (b.id.charCodeAt(4) % 5); });
  }

  // ---- FLASHCARDS ---------------------------------------------------------
  function renderFlashcards() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Flashcards"));
    var cc = Store.cardCounts();
    wrap.appendChild(h("p", "muted", cc.total + " total · " + cc.due_today + " due · " + cc.mature + " mature (interval > 21d)"));

    var row = h("div", "filters");
    var due = Store.dueCards();
    var b1 = h("button", "btn btn-primary", "Review due (" + due.length + ")");
    b1.onclick = function () { if (due.length) runFlashcardDeck(due, function () { go("cards"); }); };
    if (!due.length) b1.disabled = true;
    row.appendChild(b1);
    var b2 = h("button", "btn", "Review all (" + CONTENT.cards.length + ")");
    b2.onclick = function () { runFlashcardDeck(CONTENT.cards.slice(), function () { go("cards"); }); };
    row.appendChild(b2);
    wrap.appendChild(row);

    if (!due.length) wrap.appendChild(h("p", "muted small", "Nothing due right now — spaced repetition scheduled the rest for later. 'Review all' to study ahead."));
    mount(wrap);
  }
  function runFlashcardDeck(deck, onFinish) {
    if (!deck.length) { onFinish(); return; }
    var i = 0;
    function show() {
      if (i >= deck.length) { onFinish(); return; }
      var c = deck[i];
      var wrap = h("div", "runner");
      wrap.appendChild(h("div", "runner-prog muted", "Card " + (i + 1) + " of " + deck.length + " · " + c.domain));
      var card = h("div", "card flashcard");
      card.appendChild(h("div", "fc-front", c.front));
      var back = h("div", "fc-back");
      back.appendChild(h("div", "fc-back-text", c.back));
      back.style.display = "none";
      card.appendChild(back);

      var actions = h("div", "actions");
      var flip = h("button", "btn btn-primary", "Show answer");
      flip.onclick = function () {
        back.style.display = "block";
        actions.removeChild(flip);
        ["again", "hard", "good"].forEach(function (rating) {
          var b = h("button", "btn rate rate-" + rating, rating[0].toUpperCase() + rating.slice(1));
          b.onclick = function () { Store.reviewCard(c.id, rating); i++; show(); };
          actions.appendChild(b);
        });
      };
      actions.appendChild(flip);
      card.appendChild(actions);
      wrap.appendChild(card);
      mount(wrap);
    }
    show();
  }

  // ---- GUIDES -------------------------------------------------------------
  function renderGuides() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Study guides"));
    var gid = location.hash.slice(1).split("/")[1];
    if (!gid) {
      var list = h("div", "guide-list");
      CONTENT.guides.forEach(function (g) {
        var c = h("button", "guide-item");
        c.appendChild(h("div", "gi-title", g.title));
        c.appendChild(h("div", "gi-sub muted", "Objectives: " + g.objectives));
        c.appendChild(h("div", "gi-sub muted", g.source));
        c.onclick = function () { location.hash = "#guides/" + g.id; };
        list.appendChild(c);
      });
      wrap.appendChild(list);
    } else {
      var g = CONTENT.guides.filter(function (x) { return x.id === gid; })[0];
      var back = h("button", "btn", "← All guides"); back.onclick = function () { go("guides"); };
      wrap.appendChild(back);
      if (g) {
        wrap.appendChild(h("h2", "guide-h2", g.title));
        wrap.appendChild(h("div", "muted small", "Objectives: " + g.objectives + " · " + g.source));
        var body = h("div", "guide-body");
        body.innerHTML = g.html;   // trusted, authored by Claude
        wrap.appendChild(body);
      }
    }
    mount(wrap);
  }

  // ---- MOCK EXAM ----------------------------------------------------------
  function renderMock() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Mock exam"));
    wrap.appendChild(h("p", "muted", "Timed and scored. Two mocks at ≥ " +
      STUDY_DATA.meta.booking_gate.threshold + "% clears your booking gate. The bank grows each session — a full-length mock fills in over Weeks 7-8."));

    var total = CONTENT.questions.length;
    var cfg = h("div", "mock-cfg card");
    cfg.appendChild(h("div", "kpi-title", "Length"));
    var counts = [10, total].filter(function (v, idx, a) { return a.indexOf(v) === idx && v <= total; });
    var chosenN = counts[0];
    var row = h("div", "filters");
    counts.forEach(function (n) {
      var b = h("button", "btn" + (n === chosenN ? " btn-primary" : ""), n + " questions");
      b.onclick = function () { chosenN = n; row.querySelectorAll(".btn").forEach(function (x) { x.classList.remove("btn-primary"); }); b.classList.add("btn-primary"); };
      row.appendChild(b);
    });
    cfg.appendChild(row);
    var start = h("button", "btn btn-primary btn-lg", "Start mock");
    start.onclick = function () { startMock(chosenN); };
    cfg.appendChild(start);
    wrap.appendChild(cfg);

    var past = Store.mocks();
    if (past.length) {
      var hst = h("div", "card");
      hst.appendChild(h("div", "kpi-title", "Past mocks"));
      past.slice().reverse().forEach(function (m) {
        var line = h("div", "mock-row");
        var pct = h("span", "mock-pct" + (m.pct >= STUDY_DATA.meta.booking_gate.threshold ? " good" : " warn"), m.pct + "%");
        line.appendChild(pct);
        line.appendChild(h("span", "muted", "  " + m.date + " · " + m.score + "/" + m.total));
        hst.appendChild(line);
      });
      wrap.appendChild(hst);
    }
    mount(wrap);
  }
  function startMock(n) {
    var list = shuffleStable(CONTENT.questions).slice(0, n);
    var secs = n * 90;                 // ~1.5 min/question
    var timerBox = h("div", "timer");
    var stopped = false;
    var handle = null;

    function finish(res) {
      stopped = true; if (handle) clearInterval(handle);
      Store.recordMock(res.correct, res.total);
      var gate = Store.gateStatus();
      var wrap = h("div", "card done");
      wrap.appendChild(h("h2", null, "Mock complete"));
      var pct = Math.round((res.correct / res.total) * 100);
      var s = h("div", "done-score" + (pct >= STUDY_DATA.meta.booking_gate.threshold ? " good" : " warn"), pct + "%  (" + res.correct + "/" + res.total + ")");
      wrap.appendChild(s);
      wrap.appendChild(h("p", "muted", "Booking gate: " + gate.passing + " of " + gate.needed + " mocks ≥ " + gate.threshold + "%."));
      var by = domainBreakdown(res.results);
      wrap.appendChild(by);
      var a = h("button", "btn btn-primary", "Back to Home"); a.onclick = function () { go("home"); };
      wrap.appendChild(a);
      mount(wrap);
    }
    function tick() {
      if (stopped) return;
      secs--;
      var m = Math.floor(secs / 60), s = secs % 60;
      timerBox.textContent = "Time left  " + m + ":" + String(s).padStart(2, "0");
      if (secs <= 60) timerBox.classList.add("warn");
      if (secs <= 0) { /* auto-submit remaining as wrong via finish path */ forceFinish(); }
    }
    var runnerResults = { correct: 0, total: 0, results: [] };
    function forceFinish() {
      // time's up: end immediately with whatever's recorded
      finish({ correct: runnerResults.correct, total: list.length, results: runnerResults.results });
    }
    var m0 = Math.floor(secs / 60), s0 = secs % 60; // paint the timer immediately (no 1s blank)
    timerBox.textContent = "Time left  " + m0 + ":" + String(s0).padStart(2, "0");
    handle = setInterval(tick, 1000);

    // custom runner to track partial for timeout + show timer
    (function run() {
      var i = 0;
      function next() {
        if (stopped) return;
        if (i >= list.length) { finish({ correct: runnerResults.correct, total: list.length, results: runnerResults.results }); return; }
        var q = list[i];
        var card = renderQuestion(q, "mock", function (isCorrect) {
          if (isCorrect) runnerResults.correct++;
          runnerResults.results.push({ q: q, correct: isCorrect });
        }, function () { i++; next(); });
        var v = h("div", "runner");
        v.appendChild(timerBox);
        v.appendChild(h("div", "runner-prog muted", "Question " + (i + 1) + " of " + list.length));
        v.appendChild(card);
        mount(v);
      }
      next();
    })();
  }
  function domainBreakdown(results) {
    var box = h("div", "breakdown");
    box.appendChild(h("div", "kpi-title", "By domain"));
    var by = {};
    (results || []).forEach(function (r) {
      var d = r.q.domain; by[d] = by[d] || { a: 0, c: 0 };
      by[d].a++; if (r.correct) by[d].c++;
    });
    Object.keys(by).sort().forEach(function (d) {
      var line = h("div", "bd-row");
      line.appendChild(h("span", "bd-dom", d));
      var pct = Math.round((by[d].c / by[d].a) * 100);
      line.appendChild(barInline(pct));
      line.appendChild(h("span", "muted", "  " + by[d].c + "/" + by[d].a));
      box.appendChild(line);
    });
    return box;
  }

  // ---- PROGRESS -----------------------------------------------------------
  function renderProgress() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Progress"));

    var r = Store.readiness();
    var hero = h("div", "hero");
    hero.appendChild(ring("Readiness", Math.round(r * 100), 85));
    hero.appendChild(kpi("Days to exam", String(Store.daysToExam()), null));
    hero.appendChild(gateCard(Store.gateStatus()));
    var cc = Store.cardCounts();
    hero.appendChild(kpi("Mature cards", String(cc.mature), "best retention signal"));
    wrap.appendChild(hero);

    // accuracy by domain (weakest first)
    var dsec = section("Accuracy by domain (weakest first)");
    dsec.appendChild(h("p", "muted small", "Percent correct on questions you've ANSWERED — not how much of the domain you've covered (see Objective coverage below). A domain only counts fully toward readiness after ≥10 attempts, so early scores are provisional."));
    var dd = Store.perDomain().slice().sort(function (a, b) {
      if (a.attempts === 0 && b.attempts === 0) return b.weight - a.weight;
      return a.accuracy - b.accuracy;
    });
    dd.forEach(function (d) {
      var row = h("div", "dbar");
      var lab = h("div", "dbar-lab");
      lab.appendChild(h("span", "dbar-name", d.id + " · " + d.name));
      var meta = "  " + Math.round(d.weight * 100) + "% of exam · " +
        (d.attempts ? (d.correct + "/" + d.attempts + " correct") : "0 attempts") +
        (d.attempts > 0 && d.attempts < 10 ? " · provisional" : "");
      lab.appendChild(h("span", "muted small", meta));
      row.appendChild(lab);
      var pct = d.attempts ? Math.round(d.accuracy * 100) : 0;
      row.appendChild(barInline(pct, d.attempts === 0));
      dsec.appendChild(row);
    });
    wrap.appendChild(dsec);

    // coverage
    var csec = section("Objective coverage");
    STUDY_DATA.domains.forEach(function (d) {
      var row = h("div", "dbar");
      row.appendChild(h("div", "dbar-lab", d.id + " · touched " + d.objectives_touched + "/" + d.objectives_total + (d.gaps ? "  ·  " + d.gaps + " gaps" : "")));
      row.appendChild(barInline(Math.round((d.objectives_touched / d.objectives_total) * 100), false));
      csec.appendChild(row);
    });
    wrap.appendChild(csec);

    // calibration
    var cal = Store.calibration();
    var calsec = section("Confidence vs accuracy");
    if (!cal.length) calsec.appendChild(h("p", "muted", "Answer some practice questions (with a confidence tag) to see your calibration."));
    else {
      ["high", "med", "low"].forEach(function (tag) {
        var pts = cal.filter(function (p) { return p.tag === tag; });
        if (!pts.length) return;
        var acc = Math.round(pts.reduce(function (s, p) { return s + p.correct; }, 0) / pts.length * 100);
        var wrongHi = pts.filter(function (p) { return !p.correct; }).length;
        var row = h("div", "dbar");
        var lbl = tag + " confidence (" + pts.length + ")";
        if (tag === "high" && wrongHi) lbl += "  ·  " + wrongHi + " blind-spot" + (wrongHi > 1 ? "s" : "");
        row.appendChild(h("div", "dbar-lab" + (tag === "high" && wrongHi ? " danger" : ""), lbl));
        row.appendChild(barInline(acc, false));
        calsec.appendChild(row);
      });
      calsec.appendChild(h("p", "muted small", "Watch high-confidence + wrong — those are the blind spots that surprise you in the exam room."));
    }
    wrap.appendChild(calsec);

    // streak grid
    var ssec = section("Study streak (last 30 days)");
    var grid = h("div", "streak-grid");
    Store.studyDaysWindow(30).forEach(function (d) {
      var cell = h("div", "streak-cell" + (d.studied ? " on" : ""));
      cell.title = d.date;
      grid.appendChild(cell);
    });
    ssec.appendChild(grid);
    ssec.appendChild(h("p", "muted small", "Current streak: " + Store.streak() + " day(s)."));
    wrap.appendChild(ssec);

    // mock trend
    var msec = section("Practice-exam trend");
    var mk = Store.mocks();
    if (!mk.length) msec.appendChild(h("p", "muted", "No mocks yet. Take one from the Mock exam tab (Weeks 7-8)."));
    else mk.forEach(function (m) {
      var row = h("div", "dbar");
      row.appendChild(h("div", "dbar-lab", m.date));
      row.appendChild(barInline(m.pct, false));
      msec.appendChild(row);
    });
    wrap.appendChild(msec);

    // data controls
    var xsec = section("Your data");
    var brow = h("div", "filters");
    var exp = h("button", "btn", "Export progress");
    exp.onclick = function () { showExport(xsec); };
    brow.appendChild(exp);
    var rst = h("button", "btn btn-danger", "Reset all progress");
    rst.onclick = function () {
      if (confirm("Erase all your answers, card progress, and mock scores? This can't be undone.")) { Store.reset(); route(); }
    };
    brow.appendChild(rst);
    xsec.appendChild(brow);
    xsec.appendChild(h("p", "muted small", "Progress is saved in this browser. Export gives Claude your data to sync into the project files."));
    wrap.appendChild(xsec);

    mount(wrap);
  }
  function showExport(sec) {
    var old = sec.querySelector(".export-area"); if (old) old.remove();
    var box = h("div", "export-area");
    var ta = document.createElement("textarea");
    ta.className = "export-ta"; ta.value = Store.exportJSON(); ta.readOnly = true;
    box.appendChild(ta);
    var copy = h("button", "btn", "Copy to clipboard");
    copy.onclick = function () { ta.select(); try { document.execCommand("copy"); copy.textContent = "Copied"; } catch (e) {} };
    box.appendChild(copy);
    sec.appendChild(box);
    ta.focus(); ta.select();
  }
  function section(title) {
    var s = h("div", "section");
    s.appendChild(h("h2", "section-h", title));
    return s;
  }
  function barInline(pct, empty) {
    var bar = h("div", "bar bar-inline");
    var fill = h("div", "bar-fill");
    fill.style.width = Math.max(0, Math.min(100, pct)) + "%";
    if (!empty) fill.classList.add(pct >= 85 ? "good" : (pct >= 60 ? "warn" : "bad"));
    bar.appendChild(fill);
    var t = h("span", "bar-pct muted", empty ? "—" : pct + "%");
    var wrap = h("div", "bar-wrap");
    wrap.appendChild(bar); wrap.appendChild(t);
    return wrap;
  }

  // ---- boot ---------------------------------------------------------------
  buildNav();
  route();
})();
