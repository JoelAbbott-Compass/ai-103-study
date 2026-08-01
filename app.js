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
  // designed empty state: names the value + the next action (never "No data")
  function emptyState(iconKey, title, sub, btnLabel, fn) {
    var e = h("div", "empty");
    var ic = h("div");
    ic.innerHTML = (window.ICONS && ICONS[iconKey]) || "";
    e.appendChild(ic);
    e.appendChild(h("div", "empty-title", title));
    e.appendChild(h("p", "empty-sub", sub));
    if (btnLabel) {
      var b = h("button", "btn btn-primary", btnLabel);
      b.onclick = fn;
      e.appendChild(b);
    }
    return e;
  }
  function mount(node) { var v = document.getElementById("view"); clear(v); v.appendChild(node); v.scrollTop = 0; }
  var DOMAIN_NAME = {}; STUDY_DATA.domains.forEach(function (d) { DOMAIN_NAME[d.id] = d.name; });
  function domainLabel(id) { return DOMAIN_NAME[id] || id; }

  // ---- jargon explainers ----------------------------------------------------
  // Every exam/app term a learner might not know gets a tap-to-open designed
  // panel (never hover-only, never a bare helper paragraph). Facts below match
  // store.js and CLAUDE.md exactly: gate 85% x2, ~90s/question mocks, mature =
  // interval > 21 days, ladder 1/3/7/14/30, trust ramp 5-to-15 attempts.
  var EXPLAIN = {
    readiness: { term: "Readiness", text: "An honest 0-100 estimate of how prepared you are today. It blends your accuracy across the exam's weighted domains, how much of the course you've covered, how many flashcards are locked into long-term memory, and your pace. It starts near zero and has to be earned - no free points, so a low number early on is expected, not broken." },
    gate: { term: "Booking gate", text: "The rule for booking the real exam: score 85% or higher on two different full-length timed mocks first. People typically score a bit lower on exam day than in practice, so clearing this bar means passing the real thing with a cushion." },
    mock: { term: "Timed mock", text: "A practice exam on a real clock - about 90 seconds per question - graded at the end just like exam day, with no answer feedback until you finish. Mocks scoring 85% or higher count toward your booking gate." },
    mature: { term: "Mature cards", text: "A flashcard is mature when you've recalled it correctly enough times that its next review is more than 3 weeks away. Mature means that fact is in long-term memory, not short-term cramming." },
    stages: { term: "New, learning, mature", text: "Every card starts new. Once you rate it, it's learning: reviews come back at growing gaps (1, 3, 7, 14, then 30 days) - each successful recall pushes the next one further out. When a card's next review is more than 3 weeks away, it's mature: stored in long-term memory." },
    accuracy: { term: "Accuracy and “provisional”", text: "Percent correct on the questions you've answered in each domain - not how much of the domain you've covered. A domain counts nothing toward readiness until you've made 5 attempts and only counts fully at 15, so a lucky handful of answers can't inflate the number. Until then the score is marked provisional." }
  };
  // one toggle behavior for both trigger styles; host = the surface the panel
  // opens inside (one panel open per host at a time)
  function wireExplain(btn, key, host) {
    btn.setAttribute("aria-expanded", "false");
    btn.onclick = function (e) {
      e.stopPropagation();
      var existing = host.querySelector(".explain[data-key='" + key + "']");
      host.querySelectorAll(".explain").forEach(function (p) { p.remove(); });
      host.querySelectorAll("[aria-expanded='true']").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      if (existing) return;                       // it was open - now closed
      var p = h("div", "explain");
      p.setAttribute("data-key", key);
      p.appendChild(h("span", "explain-term", EXPLAIN[key].term));
      p.appendChild(document.createTextNode(EXPLAIN[key].text));
      // open directly under the row that holds the trigger button
      var anchor = btn;
      while (anchor && anchor.parentNode !== host) anchor = anchor.parentNode;
      if (anchor) host.insertBefore(p, anchor.nextSibling);
      else host.appendChild(p);
      btn.setAttribute("aria-expanded", "true");
    };
  }
  function infoBtn(key, host) {
    var b = h("button", "info-btn");
    b.innerHTML = (window.ICONS && ICONS.circleHelp) || "";
    b.setAttribute("aria-label", "What does “" + EXPLAIN[key].term + "” mean?");
    wireExplain(b, key, host);
    return b;
  }
  function howBtn(key, label, host) {
    var b = h("button", "how-btn");
    b.innerHTML = (window.ICONS && ICONS.circleHelp) || "";
    b.appendChild(document.createTextNode(label));
    wireExplain(b, key, host);
    return b;
  }

  // ---- router -------------------------------------------------------------
  // 5 tabs (bottom bar on phones). The timed mock lives inside Practice.
  var TABS = [
    { id: "home", label: "Home", icon: "house", render: renderHome },
    { id: "practice", label: "Practice", icon: "target", render: renderPractice },
    { id: "cards", label: "Cards", icon: "layers", render: renderFlashcards },
    { id: "guides", label: "Guides", icon: "bookOpen", render: renderGuides },
    { id: "progress", label: "Progress", icon: "chartLine", render: renderProgress }
  ];
  function go(id) { location.hash = "#" + id; }
  function current() { return (location.hash || "#home").slice(1).split("/")[0]; }
  function route() {
    var id = current();
    if (id === "mock") { location.hash = "#practice"; return; }   // legacy links
    destroySheet();                                               // never orphan an open sheet
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
      var b = h("button", "nav-btn");
      b.innerHTML = (window.ICONS && ICONS[t.icon]) || "";
      var lab = h("span", "nav-label", t.label);
      b.appendChild(lab);
      b.setAttribute("data-tab", t.id);
      b.setAttribute("aria-label", t.label);
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
    hero.appendChild(kpi("Days to exam", String(Store.daysToExam()), "Exam week Sep 28", "calendar", "slate"));
    hero.appendChild(ringKpi(r * 100));
    hero.appendChild(kpi("Cards due", String(cc.due_today), cc.overdue + " overdue", "layers", "orange"));
    hero.appendChild(kpi("Streak", Store.streak() + " d", "study days in a row", "flame", "lime"));
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
    grid.appendChild(shortcut("Practice questions", "Answer, get graded, see why", "practice", "target", "orange"));
    grid.appendChild(shortcut("Flashcards", cc.due_today + " due today", "cards", "layers", "slate"));
    grid.appendChild(shortcut("Study guides", CONTENT.guides.length + " section(s)", "guides", "bookOpen", "slate"));
    grid.appendChild(shortcut("Timed mock", "Timed, scored, feeds the gate", "practice", "timer", "slate"));
    wrap.appendChild(grid);

    var vs = videoShelf();
    if (vs) wrap.appendChild(vs);

    var band = courseBand();
    if (band) wrap.appendChild(band);
    wrap.appendChild(whatYoullLearn());

    mount(wrap);
  }
  // small brand-tinted icon chip (tone: orange | lime | slate)
  function chipIcon(iconKey, tone) {
    var c = h("span", "chip tone-" + (tone || "slate"));
    c.innerHTML = (window.ICONS && ICONS[iconKey]) || "";
    return c;
  }
  function shortcut(title, sub, tab, iconKey, tone) {
    var c = h("button", "shortcut");
    if (iconKey) c.appendChild(chipIcon(iconKey, tone));
    var txt = h("div");
    txt.appendChild(h("div", "sc-title", title));
    txt.appendChild(h("div", "sc-sub muted", sub));
    c.appendChild(txt);
    c.onclick = function () { go(tab); };
    return c;
  }
  function kpi(title, val, sub, iconKey, tone, explainKey) {
    var c = h("div", "card kpi");
    var head = h("div", "kpi-head");
    var tw = h("div", "kpi-title-wrap");
    tw.appendChild(h("div", "kpi-title", title));
    if (explainKey) tw.appendChild(infoBtn(explainKey, c));
    head.appendChild(tw);
    if (iconKey) head.appendChild(chipIcon(iconKey, tone));
    c.appendChild(head);
    c.appendChild(h("div", "kpi-val", val));
    if (sub) c.appendChild(h("div", "kpi-sub muted", sub));
    return c;
  }
  // ---- SVG readiness ring (design decision 21) ----------------------------
  // Hand-built stroke-dasharray ring: track n200, progress orange, round caps,
  // 12 o'clock start. Animates in ONCE per page load (later renders paint
  // instantly); the transition lives in CSS gated behind reduced-motion, and
  // the start value is flushed with a forced reflow because rAF does not fire
  // under headless --dump-dom (same trick as the answer sheet).
  var animatedRings = {};
  function svgRing(pct, size, ariaLabel, animKey) {
    var NS = "http://www.w3.org/2000/svg";
    var stroke = Math.max(8, Math.round(size / 11));
    var r = (size - stroke) / 2;
    var circ = 2 * Math.PI * r;
    var clamped = Math.max(0, Math.min(100, pct));
    var target = circ * (1 - clamped / 100);
    var big = size >= 120;
    // padded viewBox: the goal tick extends past the track and big rings carry
    // an "85%" label outside it - both need breathing room beyond the circle
    var pad = big ? 18 : 4;
    var total = size + 2 * pad;

    var box = h("div", "ringbox");
    box.style.width = total + "px";
    box.style.height = total + "px";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", ariaLabel);

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "ring-svg");
    svg.setAttribute("width", total);
    svg.setAttribute("height", total);
    svg.setAttribute("viewBox", (-pad) + " " + (-pad) + " " + total + " " + total);
    svg.setAttribute("aria-hidden", "true");

    function circle(cls) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", size / 2);
      c.setAttribute("cy", size / 2);
      c.setAttribute("r", r);
      c.setAttribute("fill", "none");
      c.setAttribute("stroke-width", stroke);
      c.setAttribute("class", cls);
      return c;
    }
    var track = circle("ring-track");
    var prog = circle("ring-prog");
    // round caps read as a smudge below ~3% (the two cap dots overlap), and a
    // round cap still paints a dot at 0% - butt caps under 3% fix both
    prog.setAttribute("stroke-linecap", clamped >= 3 ? "round" : "butt");
    prog.setAttribute("stroke-dasharray", String(circ));
    prog.setAttribute("transform", "rotate(-90 " + (size / 2) + " " + (size / 2) + ")");
    svg.appendChild(track);
    // the 85% goal marker: onyx tick through the track, extending outward so it
    // reads as a milestone flag, not a stray hairline (drawn at 12 o'clock,
    // rotated to 85% of a turn = 306deg)
    var ext = big ? 4 : 2;
    var tick = document.createElementNS(NS, "line");
    tick.setAttribute("class", "ring-tick");
    tick.setAttribute("x1", size / 2);
    tick.setAttribute("x2", size / 2);
    tick.setAttribute("y1", size / 2 - r - stroke / 2 - ext);
    tick.setAttribute("y2", size / 2 - r + stroke / 2);
    tick.setAttribute("transform", "rotate(" + (0.85 * 360) + " " + (size / 2) + " " + (size / 2) + ")");
    svg.appendChild(tick);
    if (big) {
      // "85%" label just outside the tick (306deg from 12 o'clock = upper left)
      var rad = 0.85 * 2 * Math.PI;
      var lr = r + stroke / 2 + ext + 8;
      var lx = size / 2 + lr * Math.sin(rad);
      var ly = size / 2 - lr * Math.cos(rad);
      var lab = document.createElementNS(NS, "text");
      lab.setAttribute("class", "ring-tick-label");
      lab.setAttribute("x", lx);
      lab.setAttribute("y", ly + 4);
      lab.setAttribute("text-anchor", "middle");
      lab.textContent = "85%";
      svg.appendChild(lab);
    }
    svg.appendChild(prog);
    if (clamped >= 85) prog.classList.add("hit");   // target reached: lime
    box.appendChild(svg);

    if (animKey && !animatedRings[animKey]) {
      animatedRings[animKey] = true;
      prog.style.strokeDashoffset = circ;       // start empty
      void prog.getBoundingClientRect();        // flush so the transition runs
      prog.style.strokeDashoffset = target;
    } else {
      prog.style.strokeDashoffset = target;
    }
    return box;
  }
  function readinessRing(pct, size, animKey, sub) {
    pct = Math.round(pct);
    var box = svgRing(pct, size,
      "Readiness " + pct + " percent. Target 85 percent.", animKey);
    box.classList.add(size >= 120 ? "ring-lg" : "ring-sm");
    var num = h("div", "ring-num");
    num.setAttribute("aria-hidden", "true");
    num.appendChild(h("div", "ring-val", pct + "%"));
    if (sub) num.appendChild(h("div", "ring-sub muted", sub));
    box.appendChild(num);
    return box;
  }
  function ringKpi(pct) {
    var c = h("div", "card kpi kpi-ring");
    var head = h("div", "kpi-head");
    var tw = h("div", "kpi-title-wrap");
    tw.appendChild(h("div", "kpi-title", "Readiness"));
    tw.appendChild(infoBtn("readiness", c));
    head.appendChild(tw);
    head.appendChild(chipIcon("target", "orange"));
    c.appendChild(head);
    var row = h("div", "kpi-ring-row");
    row.appendChild(readinessRing(pct, 72, "home"));
    c.appendChild(row);
    c.appendChild(h("div", "kpi-sub muted", "target 85%"));
    return c;
  }
  function gateCard(gate) {
    var c = h("div", "card kpi");
    var head = h("div", "kpi-head");
    var tw = h("div", "kpi-title-wrap");
    tw.appendChild(h("div", "kpi-title", "Booking gate"));
    tw.appendChild(infoBtn("gate", c));
    head.appendChild(tw);
    head.appendChild(chipIcon("award", gate.cleared ? "lime" : "slate"));
    c.appendChild(head);
    var v = h("div", "kpi-val", gate.passing + "/" + gate.needed);
    v.classList.add(gate.cleared ? "good" : "warn");
    c.appendChild(v);
    c.appendChild(h("div", "kpi-sub muted", "mocks ≥ " + gate.threshold + "%"));
    return c;
  }
  // ---- course identity (chunk 3.6): name + link the source course ----------
  function courseBand() {
    var c = STUDY_DATA.meta.course;
    if (!c) return null;
    var band = h("div", "course-band");
    var chip = h("span", "chip");
    chip.innerHTML = (window.ICONS && ICONS.graduationCap) || "";
    band.appendChild(chip);
    var txt = h("div");
    txt.appendChild(h("div", "cb-kicker", "Your course"));
    txt.appendChild(h("div", "cb-title", c.title));
    txt.appendChild(h("div", "cb-sub",
      c.platform + " course by " + c.author + " · " + c.total_lectures + " lectures · " + c.length));
    if (c.url) {
      var a = document.createElement("a");
      a.className = "cb-link";
      a.href = c.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.appendChild(document.createTextNode("Open the course on " + c.platform));
      var ic = h("span");
      ic.innerHTML = (window.ICONS && ICONS.externalLink) || "";
      a.appendChild(ic.firstChild);
      txt.appendChild(a);
    }
    band.appendChild(txt);
    return band;
  }
  // "What you'll learn": the five exam domains with their real weights -
  // doubles as orientation for anyone who didn't build the system
  function whatYoullLearn() {
    var sec = section("What you'll learn", "graduationCap");
    var card = h("div", "card");
    card.appendChild(h("p", "muted small",
      "The exam tests five domains, weighted like this. Your practice and readiness follow the same weights."));
    STUDY_DATA.domains.slice().sort(function (a, b) { return b.weight - a.weight; })
      .forEach(function (d) {
        var w = Math.round(d.weight * 100);
        var row = h("div", "learn-row");
        row.setAttribute("role", "img");
        row.setAttribute("aria-label", d.name + ": " + w + " percent of the exam, " +
          d.objectives_total + " objectives");
        var line = h("div", "learn-line");
        line.appendChild(h("span", "learn-name", d.name));
        line.appendChild(h("span", "learn-val", w + "% of the exam · " + d.objectives_total + " objectives"));
        row.appendChild(line);
        var bar = h("div", "bar");
        var fill = h("div", "bar-fill");
        fill.style.width = w + "%";
        bar.appendChild(fill);
        row.appendChild(bar);
        card.appendChild(row);
      });
    sec.appendChild(card);
    return sec;
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
    tags.textContent = domainLabel(q.domain) + " · objective " + q.objective + " · " + q.difficulty +
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

    submit.onclick = function () {
      if (submitted) return;
      if (!selected.length) { flash(submit, "Pick an answer first"); return; }
      submitted = true;
      var isCorrect = grade(q, selected);
      onGrade(isCorrect, conf);

      if (mode === "mock") { onNext(); return; }

      // practice feedback: instant option states + slide-up answer sheet
      paintOptions(q, selected, optsBox);
      submit.style.display = "none";
      showAnswerSheet(isCorrect, q, onNext);
    };
    return wrap;
  }

  // ---- answer bottom sheet --------------------------------------------------
  var activeSheet = null;
  function destroySheet() {
    if (!activeSheet) return;
    document.removeEventListener("keydown", activeSheet.onKey);
    if (activeSheet.node.parentNode) activeSheet.node.parentNode.removeChild(activeSheet.node);
    activeSheet = null;
  }
  function showAnswerSheet(isCorrect, q, onNext) {
    destroySheet();
    var sheet = h("div", "answer-sheet " + (isCorrect ? "ok" : "no"));
    var inner = h("div", "as-inner");
    var head = h("div", "as-head");
    head.innerHTML = (window.ICONS && ICONS[isCorrect ? "circleCheck" : "circleAlert"]) || "";
    head.appendChild(document.createTextNode(isCorrect ? "Correct" : "Not quite"));
    inner.appendChild(head);
    if (!isCorrect && q.options) {
      var ans = q.options.filter(function (o) { return o.correct; })
        .map(function (o) { return o.key + ". " + o.text; }).join("  ·  ");
      inner.appendChild(labeled("Answer", ans));
    }
    if (q.why) inner.appendChild(labeled("Why", q.why));
    if (q.trap) inner.appendChild(labeled("Trap", q.trap));
    var acts = h("div", "as-actions");
    var btn = h("button", "btn btn-primary", isCorrect ? "Next" : "Got it");
    acts.appendChild(btn);
    inner.appendChild(acts);
    sheet.appendChild(inner);
    document.body.appendChild(sheet);
    void sheet.offsetHeight;          // flush styles so the slide-up transition runs
    sheet.classList.add("open");

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      destroySheet();
      onNext();
    }
    function onKey(e) { if (e.key === "Enter") { e.preventDefault(); close(); } }
    btn.onclick = close;
    document.addEventListener("keydown", onKey);
    activeSheet = { node: sheet, onKey: onKey };
    btn.focus({ preventScroll: true });
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
    var weakest = Store.weakestDomain();

    // practice modes as designed cards, not bare buttons
    var grid = h("div", "shortcuts");
    grid.appendChild(modeCard("target", "orange", "Mixed practice",
      "All " + CONTENT.questions.length + " questions, shuffled", function () {
        runQuestions(shuffleStable(CONTENT.questions), "practice", function (r) { showSessionDone(r, "Practice complete"); });
      }));
    grid.appendChild(modeCard("chartLine", "slate", "Weakest domain",
      DOMAIN_NAME[weakest] + " — where you miss most", function () {
        var list = CONTENT.questions.filter(function (q) { return q.domain === weakest; });
        runQuestions(list, "practice", function (r) { showSessionDone(r, "Practice complete"); });
      }));
    var mb = modeCard("rotateCcw", "slate", "Retry my misses",
      missCount ? missCount + " to clear" : "None right now — nice", function () {
        var m = Store.misses();
        if (!m.length) return;
        runQuestions(m, "practice", function (r) { showSessionDone(r, "Misses cleared"); });
      });
    if (!missCount) mb.disabled = true;
    grid.appendChild(mb);
    wrap.appendChild(grid);

    // by domain
    var dom = h("div", "filters");
    STUDY_DATA.domains.forEach(function (d) {
      var n = CONTENT.questions.filter(function (q) { return q.domain === d.id; }).length;
      if (!n) return;
      var b = h("button", "pill", d.name + " · " + n);
      b.setAttribute("aria-label", "Drill " + d.name + ", " + n + " questions");
      b.onclick = function () {
        var list = CONTENT.questions.filter(function (q) { return q.domain === d.id; });
        runQuestions(list, "practice", function (r) { showSessionDone(r, "Practice complete"); });
      };
      dom.appendChild(b);
    });
    wrap.appendChild(h("div", "muted small", "Or drill one domain:"));
    wrap.appendChild(dom);
    wrap.appendChild(mockSection());
    mount(wrap);
  }
  function modeCard(iconKey, tone, title, sub, fn) {
    var c = h("button", "shortcut");
    c.appendChild(chipIcon(iconKey, tone));
    var txt = h("div");
    txt.appendChild(h("div", "sc-title", title));
    txt.appendChild(h("div", "sc-sub muted", sub));
    c.appendChild(txt);
    c.onclick = fn;
    return c;
  }
  function shuffleStable(arr) { // deterministic light shuffle by id char
    return arr.slice().sort(function (a, b) { return (a.id.charCodeAt(4) % 5) - (b.id.charCodeAt(4) % 5); });
  }

  // ---- FLASHCARDS ---------------------------------------------------------
  function renderFlashcards() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Flashcards"));
    var due = Store.dueCards();

    // deck breakdown: new (never rated) / learning / mature (interval > 21d)
    var counts = { fresh: 0, learning: 0, mature: 0 };
    CONTENT.cards.forEach(function (c) {
      var s = Store.cardState(c.id);
      if (!s || s.box === 0) counts.fresh++;
      else if (s.interval > 21) counts.mature++;
      else counts.learning++;
    });

    var deck = h("div", "card deck-hero");
    var top = h("div", "deck-top");
    top.appendChild(chipIcon("layers", due.length ? "orange" : "lime"));
    var nums = h("div");
    nums.appendChild(h("div", "deck-due", String(due.length)));
    nums.appendChild(h("div", "deck-due-lab", "due today · " + CONTENT.cards.length + " cards in the deck"));
    top.appendChild(nums);
    deck.appendChild(top);

    var chips = h("div", "stat-chips");
    chips.appendChild(h("span", "stat-chip tone-slate", counts.fresh + " new"));
    chips.appendChild(h("span", "stat-chip tone-orange", counts.learning + " learning"));
    chips.appendChild(h("span", "stat-chip tone-lime", counts.mature + " mature"));
    chips.appendChild(infoBtn("stages", deck));
    deck.appendChild(chips);

    // 7-day due forecast (spaced repetition made visible)
    var fc = Store.dueForecast(7);
    var maxDue = Math.max.apply(null, fc.map(function (d) { return d.due; }).concat([1]));
    var chart = h("div", "forecast");
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-label", "Reviews due over the next 7 days: " +
      fc.map(function (d) { return d.label + " " + d.due; }).join(", "));
    fc.forEach(function (d, i) {
      var col = h("div", "fcol" + (i === 0 ? " today" : ""));
      col.appendChild(h("div", "fcol-n", String(d.due)));
      var bar = h("div", "fbar");
      bar.style.height = Math.max(4, Math.round((d.due / maxDue) * 56)) + "px";
      col.appendChild(bar);
      col.appendChild(h("div", null, d.label));
      chart.appendChild(col);
    });
    deck.appendChild(chart);
    deck.appendChild(h("p", "forecast-cap", "Spaced repetition schedules each card just before you'd forget it — this is your review load for the week."));

    var row = h("div", "filters");
    var b1 = h("button", "btn btn-primary", "Review due (" + due.length + ")");
    b1.onclick = function () { if (due.length) runFlashcardDeck(due, function () { go("cards"); }); };
    if (!due.length) b1.disabled = true;
    row.appendChild(b1);
    var b2 = h("button", "btn", "Review all (" + CONTENT.cards.length + ")");
    b2.onclick = function () { runFlashcardDeck(CONTENT.cards.slice(), function () { go("cards"); }); };
    row.appendChild(b2);
    deck.appendChild(row);
    wrap.appendChild(deck);

    if (!due.length) wrap.appendChild(emptyState("circleCheck", "All caught up",
      "Nothing due right now — spaced repetition has scheduled your next review. Use Review all if you want to study ahead.", null));
    mount(wrap);
  }
  function runFlashcardDeck(deck, onFinish) {
    if (!deck.length) { onFinish(); return; }
    var i = 0;
    function show() {
      if (i >= deck.length) { onFinish(); return; }
      var c = deck[i];
      var wrap = h("div", "runner");
      wrap.appendChild(h("div", "runner-prog muted", "Card " + (i + 1) + " of " + deck.length + " · " + domainLabel(c.domain)));

      // full-stage 3D flip card (tap/click anywhere on the card)
      var stage = h("div", "fc-stage");
      stage.setAttribute("role", "button");
      stage.setAttribute("tabindex", "0");
      stage.setAttribute("aria-label", "Flashcard. Activate to flip.");
      var inner = h("div", "fc-inner");
      var front = h("div", "fc-face");
      front.appendChild(h("div", "fc-front", c.front));
      var back = h("div", "fc-face back");
      back.appendChild(h("div", "fc-back-text", c.back));
      back.setAttribute("aria-hidden", "true");
      inner.appendChild(front);
      inner.appendChild(back);
      stage.appendChild(inner);
      wrap.appendChild(stage);
      wrap.appendChild(h("div", "fc-hint", "Tap the card to flip. Desktop: space flips, 1 2 3 rates."));
      var acts = h("div", "fc-actions");
      wrap.appendChild(acts);

      var revealed = false;
      function flip() {
        inner.classList.toggle("flipped");
        var flipped = inner.classList.contains("flipped");
        front.setAttribute("aria-hidden", flipped ? "true" : "false");
        back.setAttribute("aria-hidden", flipped ? "false" : "true");
        if (!revealed && flipped) { revealed = true; showRatings(); }
      }
      function showRatings() {
        ["again", "hard", "good"].forEach(function (rating) {
          var b = h("button", "btn rate rate-" + rating, rating[0].toUpperCase() + rating.slice(1));
          b.onclick = function (e) { e.stopPropagation(); rate(rating); };
          acts.appendChild(b);
        });
      }
      function rate(rating) {
        cleanup();
        Store.reviewCard(c.id, rating);
        i++;
        show();
      }
      function onDocKey(e) {
        if (!revealed) return;
        if (e.key === "1") rate("again");
        else if (e.key === "2") rate("hard");
        else if (e.key === "3") rate("good");
      }
      function cleanup() { document.removeEventListener("keydown", onDocKey); }
      stage.onclick = flip;
      stage.onkeydown = function (e) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      };
      document.addEventListener("keydown", onDocKey);
      window.addEventListener("hashchange", cleanup, { once: true });
      mount(wrap);
    }
    show();
  }

  // ---- GUIDES -------------------------------------------------------------
  // Designed reading surface (W1 chunk 4). Guides arrive as structured
  // sections from build_content.js; each kind gets its own component:
  // Pareto key-points panel, trap callouts, MEMORIZE rows linked to real
  // cards, a persisted DO checklist, sticky in-page nav, and a section quiz.
  function guideQuestions(g) {
    if (!g.codes || !g.codes.length) return [];
    return CONTENT.questions.filter(function (q) { return g.codes.indexOf(q.objective) !== -1; });
  }
  function doKey(secKey, idx) { return secKey + ":" + idx; }
  function guideDoStats(g) {
    var total = 0;
    (g.sections || []).forEach(function (s) { if (s.kind === "do" && s.items) total += s.items.length; });
    if (!total) return null;
    var checks = Store.guideChecks(g.id), done = 0;
    Object.keys(checks).forEach(function (k) { if (checks[k]) done++; });
    return { done: Math.min(done, total), total: total };
  }
  var SEC_ICON = {
    pareto: ["target", "orange"], concepts: ["bookOpen", "slate"],
    diagram: ["compass", "slate"], memorize: ["layers", "orange"],
    do: ["listChecks", "lime"], gotchas: ["triangleAlert", "orange"],
    verify: ["circleAlert", "slate"], other: ["bookOpen", "slate"]
  };

  function renderGuides() {
    var wrap = h("div", "view");
    var gid = location.hash.slice(1).split("/")[1];
    if (!gid) {
      wrap.appendChild(h("h1", null, "Study guides"));
      var list = h("div", "guide-list");
      CONTENT.guides.forEach(function (g) {
        var c = h("button", "guide-item");
        c.appendChild(chipIcon("bookOpen", "slate"));
        var txt = h("div", "gi-txt");
        txt.appendChild(h("div", "gi-title", g.title));
        txt.appendChild(h("div", "gi-sub muted", g.minutes + " min read"));
        if (g.description) txt.appendChild(h("p", "gi-desc", g.description));
        var badges = h("div", "gi-badges");
        if (g.video) badges.appendChild(gBadge("play", "Video overview", "orange"));
        var qn = guideQuestions(g).length;
        if (qn) badges.appendChild(gBadge("target", qn + " questions", "slate"));
        var ds = guideDoStats(g);
        if (ds) badges.appendChild(gBadge("listChecks", "Lab " + ds.done + "/" + ds.total,
          ds.done === ds.total ? "lime" : "slate"));
        txt.appendChild(badges);
        c.appendChild(txt);
        var chev = h("span", "gi-chev");
        chev.innerHTML = (window.ICONS && ICONS.chevronRight) || "";
        c.appendChild(chev);
        c.onclick = function () { location.hash = "#guides/" + g.id; };
        list.appendChild(c);
      });
      wrap.appendChild(list);
      mount(wrap);
      return;
    }

    var g = CONTENT.guides.filter(function (x) { return x.id === gid; })[0];
    var back = h("button", "btn", "← All guides"); back.onclick = function () { go("guides"); };
    wrap.appendChild(back);
    if (!g) { mount(wrap); return; }

    wrap.appendChild(h("h2", "guide-h2", g.title));
    wrap.appendChild(h("div", "gmeta muted small", g.minutes + " min read"));
    if (g.description) wrap.appendChild(h("p", "gdesc", g.description));

    // quiz on exactly this guide's exam objectives
    var qs = guideQuestions(g);
    var quiz = h("button", "btn btn-primary quizme");
    quiz.innerHTML = (window.ICONS && ICONS.target) || "";
    quiz.appendChild(document.createTextNode(qs.length
      ? "Quiz me on this section · " + qs.length + " questions"
      : "No questions for this section yet"));
    if (qs.length) {
      quiz.onclick = function () {
        runQuestions(shuffleStable(qs), "practice", function (r) { showSessionDone(r, "Section quiz complete"); });
      };
    } else { quiz.disabled = true; }
    wrap.appendChild(quiz);

    if (g.video) wrap.appendChild(videoBlock(g));

    // sticky "On this page" nav
    var secs = g.sections || [];
    if (secs.length > 1) {
      var toc = h("nav", "toc");
      toc.setAttribute("aria-label", "On this page");
      secs.forEach(function (s) {
        var b = h("button", "toc-btn", s.label || s.title || "Section");
        b.onclick = function () {
          var el = document.getElementById("gsec_" + s.key);
          if (el) el.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start"
          });
        };
        toc.appendChild(b);
      });
      wrap.appendChild(toc);
    }

    secs.forEach(function (s) { wrap.appendChild(guideSection(g, s)); });
    // provenance footer: accuracy tracing stays visible, out of the reading flow
    if (g.source) wrap.appendChild(h("p", "gfoot muted small", "Sources: " + g.source));
    mount(wrap);
  }
  function gBadge(iconKey, label, tone) {
    var b = h("span", "gbadge tone-" + tone);
    b.innerHTML = (window.ICONS && ICONS[iconKey]) || "";
    b.appendChild(document.createTextNode(label));
    return b;
  }

  function guideSection(g, s) {
    var box = h("section", "gsec gsec-" + s.kind);
    box.id = "gsec_" + s.key;
    var icon = SEC_ICON[s.kind] || SEC_ICON.other;

    var head = h("button", "gsec-head");
    head.setAttribute("aria-expanded", "true");
    head.appendChild(chipIcon(icon[0], icon[1]));
    head.appendChild(h("span", "gsec-title", s.title || s.label || "Section"));
    var chev = h("span", "gsec-chev");
    chev.innerHTML = (window.ICONS && ICONS.chevronRight) || "";
    head.appendChild(chev);
    head.onclick = function () {
      var closed = box.classList.toggle("closed");
      head.setAttribute("aria-expanded", closed ? "false" : "true");
    };
    box.appendChild(head);

    var body = h("div", "gsec-body");
    box.appendChild(body);

    if (s.kind === "pareto") {
      var ul = h("ul", "pareto-list");
      (s.items || []).forEach(function (it) {
        var li = h("li"); li.innerHTML = it; ul.appendChild(li);
      });
      body.appendChild(ul);
    } else if (s.kind === "gotchas") {
      (s.items || []).forEach(function (it) {
        var row = h("div", "trap-row");
        var ic = h("span", "trap-ic"); ic.innerHTML = (window.ICONS && ICONS.triangleAlert) || "";
        row.appendChild(ic);
        var t = h("div"); t.innerHTML = it; row.appendChild(t);
        body.appendChild(row);
      });
    } else if (s.kind === "memorize") {
      if (s.note) { var n = h("div", "muted small gsec-note"); n.innerHTML = s.note; body.appendChild(n); }
      (s.items || []).forEach(function (it) {
        var row = h("div", "mem-row");
        var ic = h("span", "mem-ic"); ic.innerHTML = (window.ICONS && ICONS.layers) || "";
        row.appendChild(ic);
        var t = h("div"); t.innerHTML = it; row.appendChild(t);
        body.appendChild(row);
      });
      if (s.cardIds && s.cardIds.length) {
        var rb = h("button", "btn review-cards", "Review these " + s.cardIds.length + " flashcards");
        rb.onclick = function () { go("cards"); };
        body.appendChild(rb);
      }
    } else if (s.kind === "do") {
      if (s.note) { var n2 = h("div", "muted small gsec-note"); n2.innerHTML = s.note; body.appendChild(n2); }
      var count = h("div", "do-count muted small");
      function refreshCount() {
        var ds = guideDoStats(g);
        count.textContent = ds ? ds.done + " of " + ds.total + " done — hands-on beats rereading" : "";
      }
      (s.items || []).forEach(function (it, idx) {
        var key = doKey(s.key, idx);
        var on0 = !!Store.guideChecks(g.id)[key];
        var row = h("button", "do-row" + (on0 ? " done" : ""));
        row.setAttribute("aria-pressed", on0 ? "true" : "false");
        var boxIc = h("span", "do-box");
        boxIc.innerHTML = (window.ICONS && ICONS.check) || "";
        row.appendChild(boxIc);
        var t = h("div"); t.innerHTML = it; row.appendChild(t);
        row.onclick = function () {
          var on = Store.toggleGuideCheck(g.id, key);
          row.classList.toggle("done", on);
          row.setAttribute("aria-pressed", on ? "true" : "false");
          refreshCount();
        };
        body.appendChild(row);
      });
      body.appendChild(count);
      refreshCount();
    } else if (s.kind === "diagram") {
      var dw = h("div", "dg-scroll");
      dw.innerHTML = s.svg || s.html || "";   // trusted, authored in this repo
      body.appendChild(dw);
    } else {
      var pr = h("div", "guide-prose");
      pr.innerHTML = s.html || "";            // trusted, authored in this repo
      body.appendChild(pr);
    }
    return box;
  }

  function videoBlock(g) {
    var vwrap = h("div", "video-wrap");
    var vlab = h("div", "video-label");
    vlab.innerHTML = (window.ICONS && ICONS.play) || "";
    vlab.appendChild(document.createTextNode("Watch overview"));
    vwrap.appendChild(vlab);
    var stage = h("div", "video-stage");
    var vid = document.createElement("video");
    vid.className = "guide-video";
    vid.src = g.video;
    vid.controls = true;
    vid.preload = "metadata";
    vid.setAttribute("playsinline", "");       // iOS: play inline, not fullscreen-forced
    stage.appendChild(vid);
    var load = h("div", "vid-load");
    load.appendChild(compassSpinner());
    load.style.display = "none";
    stage.appendChild(load);
    vid.addEventListener("waiting", function () { load.style.display = "flex"; });
    ["playing", "canplay", "pause", "error", "seeked"].forEach(function (ev) {
      vid.addEventListener(ev, function () { load.style.display = "none"; });
    });
    vwrap.appendChild(stage);
    return vwrap;
  }
  // the app's single decorative brand flourish: a settling compass needle
  function compassSpinner() {
    var s = h("div", "cspin");
    s.setAttribute("role", "status");
    s.setAttribute("aria-label", "Loading");
    s.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle class="cspin-ring" cx="12" cy="12" r="10"/>' +
      '<g class="cspin-needle"><path class="cspin-n" d="M12 4.4 L14 12 L10 12 Z"/>' +
      '<path class="cspin-s" d="M12 19.6 L10 12 L14 12 Z"/></g>' +
      '<circle class="cspin-hub" cx="12" cy="12" r="1.4"/></svg>';
    return s;
  }
  // Home: every guide that has a narrated overview, one tap away
  function videoShelf() {
    var vids = CONTENT.guides.filter(function (g) { return g.video; });
    if (!vids.length) return null;
    var sec = h("div", "vshelf");
    sec.appendChild(h("h2", null, "Watch overviews"));
    var row = h("div", "vshelf-row");
    vids.forEach(function (g) {
      var c = h("button", "vcard");
      c.appendChild(chipIcon("play", "orange"));
      var t = h("div");
      t.appendChild(h("div", "sc-title", g.title));
      t.appendChild(h("div", "sc-sub muted", "Narrated video · " + g.minutes + " min guide"));
      c.appendChild(t);
      c.onclick = function () { location.hash = "#guides/" + g.id; };
      row.appendChild(c);
    });
    sec.appendChild(row);
    return sec;
  }

  // ---- TIMED MOCK (a mode inside Practice) ---------------------------------
  function mockSection() {
    var wrap = section("Timed mock", "timer", "mock");
    wrap.appendChild(h("p", "muted small",
      "The question bank grows every study session — a full-length mock fills in over Weeks 7-8."));

    var total = CONTENT.questions.length;
    var cfg = h("div", "mock-cfg card");
    cfg.appendChild(h("div", "kpi-title", "Length"));
    var counts = [10, total].filter(function (v, idx, a) { return a.indexOf(v) === idx && v <= total; });
    var chosenN = counts[0];
    var row = h("div", "filters");
    counts.forEach(function (n) {
      var b = h("button", "pill" + (n === chosenN ? " on" : ""), n + " questions");
      b.onclick = function () { chosenN = n; row.querySelectorAll(".pill").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); };
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
    return wrap;
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
      var pct = Math.round((by[d].c / by[d].a) * 100);
      var row = h("div", "dbar");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", domainLabel(d) + ": " + by[d].c + " of " + by[d].a + " correct");
      row.appendChild(h("div", "dbar-lab", domainLabel(d) + " · " + by[d].c + "/" + by[d].a));
      row.appendChild(barInline(pct, false));
      box.appendChild(row);
    });
    return box;
  }

  // ---- PROGRESS -----------------------------------------------------------
  function renderProgress() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Progress"));

    // hero: the SVG readiness ring is THE metric; everything else subordinate
    var r = Store.readiness();
    var cc = Store.cardCounts();
    var gate = Store.gateStatus();
    var hero = h("div", "card prog-hero");
    hero.appendChild(readinessRing(r * 100, 180, "progress", "of 85% target"));
    var stats = h("div", "ph-stats");
    stats.appendChild(phStat("Days to exam", String(Store.daysToExam())));
    stats.appendChild(phStat("Booking gate", gate.passing + " of " + gate.needed + " mocks ≥ " + gate.threshold + "%", "gate", hero));
    stats.appendChild(phStat("Mature cards", cc.mature + " of " + cc.total, "mature", hero));
    stats.appendChild(howBtn("readiness", "How readiness works", hero));
    hero.appendChild(stats);
    wrap.appendChild(hero);

    // accuracy by domain (weakest first) — direct-labeled bars, no legend
    var dsec = section("Accuracy by domain (weakest first)", "target", "accuracy");
    var dd = Store.perDomain().slice().sort(function (a, b) {
      if (a.attempts === 0 && b.attempts === 0) return b.weight - a.weight;
      return a.accuracy - b.accuracy;
    });
    dd.forEach(function (d) {
      var pct = d.attempts ? Math.round(d.accuracy * 100) : 0;
      var val = d.attempts
        ? pct + "% · " + d.attempts + " attempt" + (d.attempts === 1 ? "" : "s") +
          (d.attempts < 15 ? " · provisional" : "")
        : "no attempts yet";
      var row = h("div", "dom-row");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", d.name + ", " +
        Math.round(d.weight * 100) + " percent of the exam: " +
        (d.attempts ? pct + " percent correct over " + d.attempts + " attempts" : "no attempts yet"));
      var line = h("div", "dom-line");
      line.appendChild(h("span", "dom-name", d.name));
      line.appendChild(h("span", "dom-val muted", val));
      row.appendChild(line);
      var bar = h("div", "bar");
      var fill = h("div", "bar-fill");
      fill.style.width = pct + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      dsec.appendChild(row);
    });
    dsec.appendChild(weakestNote(dd));
    wrap.appendChild(dsec);

    // coverage
    var csec = section("Objective coverage", "listChecks");
    STUDY_DATA.domains.forEach(function (d) {
      var row = h("div", "dbar");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", d.name + ": " + d.objectives_touched + " of " +
        d.objectives_total + " objectives touched" + (d.gaps ? ", " + d.gaps + " known gaps" : ""));
      row.appendChild(h("div", "dbar-lab", d.name + " · touched " + d.objectives_touched + "/" + d.objectives_total + (d.gaps ? "  ·  " + d.gaps + " gaps" : "")));
      row.appendChild(barInline(Math.round((d.objectives_touched / d.objectives_total) * 100), false));
      csec.appendChild(row);
    });
    wrap.appendChild(csec);

    // calibration
    var cal = Store.calibration();
    var calsec = section("Confidence vs accuracy", "lightbulb");
    if (!cal.length) calsec.appendChild(emptyState("target", "No calibration data yet",
      "Answer practice questions and tag your confidence — this reveals blind spots (high confidence + wrong) before the exam room does.", "Go practice", function () { go("practice"); }));
    else {
      ["high", "med", "low"].forEach(function (tag) {
        var pts = cal.filter(function (p) { return p.tag === tag; });
        if (!pts.length) return;
        var acc = Math.round(pts.reduce(function (s, p) { return s + p.correct; }, 0) / pts.length * 100);
        var wrongHi = pts.filter(function (p) { return !p.correct; }).length;
        var row = h("div", "dbar");
        row.setAttribute("role", "img");
        row.setAttribute("aria-label", tag + " confidence: " + acc + " percent correct over " + pts.length + " answers");
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
    var ssec = section("Study streak (last 30 days)", "flame");
    var days = Store.studyDaysWindow(30);
    var studiedCount = days.filter(function (d) { return d.studied; }).length;
    var grid = h("div", "streak-grid");
    grid.setAttribute("role", "img");
    grid.setAttribute("aria-label", "Studied on " + studiedCount + " of the last 30 days");
    days.forEach(function (d) {
      var cell = h("div", "streak-cell" + (d.studied ? " on" : ""));
      cell.title = d.date;
      grid.appendChild(cell);
    });
    ssec.appendChild(grid);
    ssec.appendChild(h("p", "muted small", "Current streak: " + Store.streak() + " day(s)."));
    wrap.appendChild(ssec);

    // mock trend
    var msec = section("Practice-exam trend", "chartLine");
    var mk = Store.mocks();
    if (!mk.length) msec.appendChild(emptyState("timer", "No mock scores yet",
      "Take a timed mock from the Practice tab — two scores at 85%+ clear your booking gate.", "Go to Practice", function () { go("practice"); }));
    else mk.forEach(function (m) {
      var row = h("div", "dbar");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", "Mock on " + m.date + ": " + m.pct + " percent");
      row.appendChild(h("div", "dbar-lab", m.date));
      row.appendChild(barInline(m.pct, false));
      msec.appendChild(row);
    });
    wrap.appendChild(msec);

    // data controls
    var xsec = section("Your data", "download");
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
  function section(title, iconKey, explainKey) {
    var s = h("div", "section");
    var head = h("h2", "section-h");
    if (iconKey) {
      var ic = h("span", "sh-icon");
      ic.innerHTML = (window.ICONS && ICONS[iconKey]) || "";
      head.appendChild(ic);
    }
    head.appendChild(document.createTextNode(title));
    if (explainKey) head.appendChild(infoBtn(explainKey, s));
    s.appendChild(head);
    return s;
  }
  function phStat(label, val, explainKey, host) {
    var row = h("div", "ph-stat");
    var lw = h("span", "kpi-title-wrap");
    lw.appendChild(h("span", "ph-label", label));
    if (explainKey && host) lw.appendChild(infoBtn(explainKey, host));
    row.appendChild(lw);
    row.appendChild(h("span", "ph-val", val));
    return row;
  }
  // decision 22: the weakest HEAVY domain gets flagged in a plain sentence
  function weakestNote(dd) {
    var heavy = dd.filter(function (d) { return d.weight >= 0.2 && d.attempts > 0; });
    if (!heavy.length) {
      return h("p", "flag-note", "No heavy-domain attempts yet. " + DOMAIN_NAME.D2 +
        " is a third of the exam — start your practice there.");
    }
    heavy.sort(function (a, b) { return a.accuracy - b.accuracy; });
    var w = heavy[0];
    return h("p", "flag-note", "Weakest heavy domain: " + w.name + " (" +
      Math.round(w.weight * 100) + "% of the exam) at " + Math.round(w.accuracy * 100) +
      "% correct. Steer practice time there first.");
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
  function fillExamChip() {
    var chip = document.getElementById("examChip");
    if (!chip) return;
    chip.hidden = false;
    chip.innerHTML = (window.ICONS && ICONS.calendar) || "";
    var days = Store.daysToExam();
    var strong = h("strong", null, String(days));
    chip.appendChild(strong);
    var word = h("span", "chip-word", days === 1 ? "day to exam" : "days to exam");
    chip.appendChild(word);
    chip.setAttribute("aria-label", days + " days to exam");
  }
  buildNav();
  fillExamChip();
  route();
})();
