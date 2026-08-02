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
    accuracy: { term: "Accuracy and “provisional”", text: "Percent correct on the questions you've answered in each domain - not how much of the domain you've covered. A domain counts nothing toward readiness until you've made 5 attempts and only counts fully at 15, so a lucky handful of answers can't inflate the number. Until then the score is marked provisional." },
    objectives: { term: "Covered vs mastered", text: "The exam is built from 64 specific skills Microsoft publishes, called objectives. Covered means your study materials have taught that skill. Mastered is proven: you've answered at least 3 different questions on it, got each one right on your latest try, and did it across at least 2 different days - so it's knowledge, not one lucky night. A gap is a skill the course skipped; extra material fills it before exam week." },
    trend: { term: "Readiness trend", text: "The app saves your readiness once per study day and compares today with about a week ago. Early on the number itself stays low by design - under 10% before Week 3 is normal - so the direction matters more than the level. A rising line means the work is landing." },
    calibration: { term: "Confidence vs accuracy", text: "After each practice answer you tag how sure you felt. This compares that feeling with reality. High confidence but wrong is the dangerous mix - those facts feel safe, so you never review them, and the exam room is where they surface. Low confidence but right means you know more than you give yourself credit for." },
    streak: { term: "Streak", text: "Consecutive scheduled study days completed. Your plan is Monday through Saturday, so Sundays pass silently and never break it. A night counts when you do real practice, not when you open the app. Miss a night and a streak freeze covers it automatically overnight - you earn one at day 3 and one for each perfect week, holding up to two. No freeze saved? You get 2 days to earn the streak back with one bigger session." },
    spread: { term: "Tonight's queue", text: "Reviews pile up when you miss a night, so the app caps tonight at 15 cards and spreads the rest across the coming nights, most-behind cards first. Nothing is dropped and no schedule is rewritten behind your back - the extras simply surface over the next evenings." },
    leech: { term: "Moved to lab", text: "A card you've gotten wrong 3 times isn't a memorization problem - it's a sign that fact needs hands-on practice. The app routes it out of your review pile and onto Saturday's lab list, where you'll build it instead of memorizing it." },
    quests: { term: "Tonight's quests", text: "Small targets built from your real plan each night: tonight's lecture, a guide review, the flashcards that are due, and a set of practice questions. Tap a quest to jump straight into that work; the ring fills as you finish. Watch the lecture before you open the app and mark it - the ring starts already partly full, because that work counts. The bonus quest is optional: skip it with the X and nothing is lost - no penalty, no catch-up debt." },
    plan: { term: "Your 8-week plan", text: "The road from here to exam week in phases: learn the course, fill the gaps and start practice exams, then drill until two timed mocks clear 85%. The orange cell is the week you're in. One week at a time - progress here never turns into one long bar you're behind on." },
    badges: { term: "Milestones", text: "Badges that mark real progress only - a week fully studied, your first proven skill in a domain, your first mock, an 85% mock, and clearing the booking gate. The goal for each is printed right on the badge, and none are ever given for opening the app or for a total of anything. A locked badge shows exactly what earns it." }
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
  // If the hash is already the target (e.g. finishing a session that started
  // on Home), setting it fires no hashchange - re-route directly so buttons
  // like "Back to Home" always work.
  function go(id) {
    if (location.hash === "#" + id) { route(); return; }
    location.hash = "#" + id;
  }
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
    var fs = freshStartPanel();
    if (fs) wrap.appendChild(fs);
    var r = Store.readiness();
    var gate = Store.gateStatus();
    var tq = Store.tonightQueue();
    var si = Store.streakInfo();

    var hero = h("div", "hero");
    hero.appendChild(kpi("Days to exam", String(Store.daysToExam()), "Exam week Sep 28", "calendar", "slate"));
    hero.appendChild(ringKpi(r * 100));
    hero.appendChild(kpi("Cards tonight", String(tq.cards.length),
      tq.deferred ? "+" + tq.deferred + " spread across this week" : "tonight's review queue",
      "layers", "orange", tq.deferred ? "spread" : null));
    var streakSub = si.preStart ? "your plan starts Monday"
      : "scheduled days" + (si.freezes ? " · " + si.freezes + " freeze" + (si.freezes > 1 ? "s" : "") + " saved" : "");
    hero.appendChild(kpi("Streak", si.days + " d", streakSub, "flame", "lime", "streak"));
    hero.appendChild(gateCard(gate));
    wrap.appendChild(hero);

    // no-shame miss banner: one line + the recovery action, nothing else
    if (si.repair) {
      var rb = h("div", "card repair-banner");
      rb.appendChild(chipIcon("rotateCcw", "orange"));
      var rtxt = h("div");
      rtxt.appendChild(h("div", "rb-title", "You missed " + weekdayName(si.repair.missDate) + " — that's data, not failure."));
      rtxt.appendChild(h("div", "rb-sub muted",
        "One bigger session (all of tonight's cards + 16 questions) earns the streak back. " +
        (si.repair.daysLeft === 0 ? "Tonight is the last night to do it." : "You have tonight and tomorrow.")));
      rb.appendChild(rtxt);
      var rbtn = h("button", "btn btn-primary", "Earn it back  →");
      rbtn.onclick = startRepairSession;
      rb.appendChild(rbtn);
      wrap.appendChild(rb);
    }

    // Tonight panel (chunk 7): derived quests + declinable bonus + ring.
    // Layering rule: onyx outer panel, slate inner rows, orange action.
    var sn = h("div", "studynow dark-panel");
    var qt = Store.questsTonight();
    var main = h("div", "sn-main");
    var headRow = h("div", "sn-headrow");
    headRow.appendChild(h("h2", null, "Tonight"));
    headRow.appendChild(infoBtn("quests", sn));
    main.appendChild(headRow);
    if (qt.note) main.appendChild(h("p", "sn-note", qt.note));
    qt.quests.forEach(function (q) { main.appendChild(questRow(q)); });
    if (qt.bonus) main.appendChild(bonusRow(qt.bonus));
    main.appendChild(h("p", "sn-note", "Session focus: " + DOMAIN_NAME[Store.weakestDomain()]));
    sn.appendChild(main);
    var side = h("div", "sn-side");
    side.appendChild(questRing(qt));
    sn.appendChild(side);
    var ws = weekStrip();
    if (ws) sn.appendChild(ws);
    var big = h("button", "btn btn-primary btn-lg sn-start", "Start tonight's session  →");
    big.onclick = startStudyNow;
    sn.appendChild(big);
    wrap.appendChild(sn);

    // shortcuts
    var grid = h("div", "shortcuts");
    grid.appendChild(shortcut("Practice questions", "Answer, get graded, see why", "practice", "target", "orange"));
    grid.appendChild(shortcut("Flashcards", tq.cards.length + " tonight", "cards", "layers", "slate"));
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
  function svgRing(pct, size, ariaLabel, animKey, opts) {
    opts = opts || {};
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
    // compass-dial detail: cardinal ticks at 12/3/6/9 o'clock (the app's
    // rings are a quiet play on the compass mark)
    var cardinals = document.createDocumentFragment();
    [0, 90, 180, 270].forEach(function (deg) {
      var t = document.createElementNS(NS, "line");
      t.setAttribute("class", "ring-card");
      t.setAttribute("x1", size / 2);
      t.setAttribute("x2", size / 2);
      t.setAttribute("y1", size / 2 - r - stroke / 2);
      t.setAttribute("y2", size / 2 - r - stroke / 2 + (big ? 8 : 6));
      t.setAttribute("transform", "rotate(" + deg + " " + (size / 2) + " " + (size / 2) + ")");
      cardinals.appendChild(t);
    });
    var prog = circle("ring-prog");
    // round caps read as a smudge below ~3% (the two cap dots overlap), and a
    // round cap still paints a dot at 0% - butt caps under 3% fix both
    prog.setAttribute("stroke-linecap", clamped >= 3 ? "round" : "butt");
    prog.setAttribute("stroke-dasharray", String(circ));
    prog.setAttribute("transform", "rotate(-90 " + (size / 2) + " " + (size / 2) + ")");
    svg.appendChild(track);
    svg.appendChild(cardinals);
    // the 85% goal marker: onyx tick through the track, extending outward so it
    // reads as a milestone flag, not a stray hairline (drawn at 12 o'clock,
    // rotated to 85% of a turn = 306deg)
    var ext = big ? 4 : 2;
    if (!opts.noTick) {
      var tick = document.createElementNS(NS, "line");
      tick.setAttribute("class", "ring-tick");
      tick.setAttribute("x1", size / 2);
      tick.setAttribute("x2", size / 2);
      tick.setAttribute("y1", size / 2 - r - stroke / 2 - ext);
      tick.setAttribute("y2", size / 2 - r + stroke / 2);
      tick.setAttribute("transform", "rotate(" + (0.85 * 360) + " " + (size / 2) + " " + (size / 2) + ")");
      svg.appendChild(tick);
    }
    if (big && !opts.noTick) {
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
    var band = h("div", "course-band dark-panel");
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
    // course pace: how far through the lectures you are
    var cp = Store.courseProgress();
    if (cp.lectures_total) {
      var prog = h("div", "cb-progress");
      prog.setAttribute("role", "img");
      prog.setAttribute("aria-label", cp.lectures_watched + " of " + cp.lectures_total + " lectures watched");
      prog.appendChild(h("div", "cb-progress-lab",
        cp.lectures_watched + " of " + cp.lectures_total + " lectures watched"));
      var bar = h("div", "bar");
      var fill = h("div", "bar-fill");
      fill.style.width = Math.round((cp.lectures_watched / cp.lectures_total) * 100) + "%";
      bar.appendChild(fill);
      prog.appendChild(bar);
      txt.appendChild(prog);
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

  // ---- fresh-start Monday (chunk 8) ----------------------------------------
  // On the first Home visit of a new week: last week's HONEST recap + this
  // week's focus, then a button to dismiss into the normal Home. Onyx outer
  // panel, slate stat boxes, orange action (layering rule).
  function freshStartPanel() {
    var wr = Store.weekReview();
    if (!wr) return null;
    var panel = h("div", "freshstart dark-panel");
    panel.appendChild(h("div", "fs-kicker", "New week"));
    panel.appendChild(h("h2", "fs-title", "Week " + wr.weekN + (wr.phase ? " — " + wr.phase : "")));
    panel.appendChild(h("p", "fs-sub",
      "A fresh start. Here's how last week went, then straight into this week."));
    var stats = h("div", "fs-stats");
    stats.appendChild(fsStat(wr.nights + " of " + wr.scheduled, "nights studied last week"));
    var dTxt = (wr.delta > 0 ? "+" : "") + wr.delta + " pt" + (Math.abs(wr.delta) === 1 ? "" : "s");
    stats.appendChild(fsStat(dTxt, "readiness change last week"));
    stats.appendChild(fsStat(String(wr.blindSpots),
      wr.blindSpots === 1 ? "blind spot to review" : "blind spots to review"));
    panel.appendChild(stats);
    var btn = h("button", "btn btn-primary fs-start", "Start week " + wr.weekN + "  →");
    btn.onclick = function () { Store.markWeekSeen(wr.weekMonday); renderHome(); };
    panel.appendChild(btn);
    return panel;
  }
  function fsStat(val, lab) {
    var b = h("div", "panel-inner fs-box");
    b.appendChild(h("div", "fs-val", val));
    b.appendChild(h("div", "fs-lab", lab));
    return b;
  }

  // ---- tonight quest components (chunk 7) ----------------------------------
  // Every quest row is a button that takes you straight into that work
  // (Joel review 2026-08-01). The lecture row toggles its mark (the work is
  // external); the guide row opens the guide, with a separate check control
  // to mark it reviewed (reading is at your pace - an open is never a reward).
  // Completion is always derived by the store - a check always means real work.
  function questRow(q) {
    var row = h(q.id === "guide" ? "div" : "button", "quest-row");
    row.setAttribute("data-q", q.id);
    var ic = h("span", "quest-ic");
    ic.innerHTML = (window.ICONS && ICONS[q.icon]) || "";
    row.appendChild(ic);
    row.appendChild(h("span", "quest-lab", q.label));
    row.appendChild(questStatus(q));
    if (q.id === "lecture") {
      row.setAttribute("aria-pressed", q.done ? "true" : "false");
      row.onclick = function () { Store.markLecture(); renderHome(); };
    } else if (q.id === "guide") {
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      function openGuide() { location.hash = "#guides/" + q.guideId; }
      row.onclick = openGuide;
      row.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGuide(); } };
      var chk = h("button", "guide-check" + (q.done ? " on" : ""));
      chk.setAttribute("aria-pressed", q.done ? "true" : "false");
      chk.setAttribute("aria-label", "Mark the guide reviewed");
      chk.title = "Mark reviewed";
      chk.innerHTML = (window.ICONS && ICONS.check) || "";
      chk.onclick = function (e) { e.stopPropagation(); Store.markGuide(); renderHome(); };
      row.appendChild(chk);
    } else if (q.id === "cards") {
      row.onclick = function () {
        var tq = Store.tonightQueue();
        if (tq.cards.length) runFlashcardDeck(tq.cards, function () { go("home"); });
      };
    } else if (q.id === "questions") {
      row.onclick = function () {
        runQuestions(Store.buildSession(8).questions, "practice", function (r) {
          showSessionDone(r, "Practice complete");
        });
      };
    }
    return row;
  }
  function questStatus(q) {
    var st = h("span", "quest-status");
    if (q.done) {
      st.classList.add("done");
      st.innerHTML = (window.ICONS && ICONS.circleCheck) || "";
      st.appendChild(document.createTextNode("done"));
    } else if (q.status) {
      st.textContent = q.status;
    }
    return st;
  }
  // the bonus is genuinely optional: one tap declines it for the night,
  // nothing is lost and nothing comes back to collect
  function bonusRow(b) {
    var row = h("div", "quest-row bonus");
    row.setAttribute("data-q", "bonus");
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    function launch() {
      if (b.kind === "misses") {
        var m = Store.misses();
        if (m.length) runQuestions(m, "practice", function (r) { showSessionDone(r, "Misses cleared"); });
      } else {
        runQuestions(shuffleStable(CONTENT.questions).slice(0, 5), "practice", function (r) {
          showSessionDone(r, "Bonus done");
        });
      }
    }
    row.onclick = launch;
    row.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch(); } };
    var ic = h("span", "quest-ic");
    ic.innerHTML = (window.ICONS && ICONS[b.icon]) || "";
    row.appendChild(ic);
    row.appendChild(h("span", "quest-lab", b.label));
    row.appendChild(questStatus(b));
    var x = h("button", "bonus-x");
    x.innerHTML = (window.ICONS && ICONS.x) || "";
    x.setAttribute("aria-label", "Skip tonight's bonus - no penalty");
    x.title = "Skip tonight's bonus - no penalty";
    x.onclick = function (e) {
      e.stopPropagation();
      Store.declineBonus();
      renderHome();
    };
    row.appendChild(x);
    return row;
  }
  function questRing(qt) {
    var pct = qt.total ? Math.round((qt.done / qt.total) * 100) : 0;
    var box = svgRing(pct, 88,
      "Tonight: " + qt.done + " of " + qt.total + " quests complete.", "questring", { noTick: true });
    box.classList.add("quest-ringbox", "ring-sm");
    if (pct >= 100) {
      var prog = box.querySelector(".ring-prog");
      if (prog) prog.classList.add("hit");
    }
    var num = h("div", "ring-num");
    num.setAttribute("aria-hidden", "true");
    num.appendChild(h("div", "ring-val", qt.done + "/" + qt.total));
    num.appendChild(h("div", "ring-sub", "tonight"));
    box.appendChild(num);
    return box;
  }
  // this week at a glance: Mon-Sat cells from the same walker as the calendar
  function weekStrip() {
    var wb = Store.weekBar();
    if (!wb) return null;
    var NAME = { done: "studied", frz: "covered by a freeze", rep: "earned back", pend: "tonight", miss: "missed", fut: "coming up", off: "off" };
    var strip = h("div", "weekstrip");
    strip.setAttribute("role", "img");
    strip.setAttribute("aria-label", "This week: " + wb.map(function (d) {
      return weekdayName(d.date) + " " + (NAME[d.state] || d.state);
    }).join(", ") + ".");
    wb.forEach(function (d) {
      var day = h("div", "ws-day");
      day.appendChild(h("span", "ws-cell " + d.state));
      day.appendChild(h("span", "ws-lab", d.label));
      strip.appendChild(day);
    });
    return strip;
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
    var before = sessionBaseline();
    var plan = Store.buildSession(8);
    var cards = plan.cards.slice(0, 10);
    function doQuestions() {
      runQuestions(plan.questions, "practice", function (res) {
        showRecap({ title: "That's tonight done.", res: res, cardsCount: cards.length, before: before });
      });
    }
    if (cards.length) runFlashcardDeck(cards, doQuestions);
    else doQuestions();
  }
  // facts captured before a session so the recap can show a TRUE delta
  function sessionBaseline() {
    return { r: Store.readiness(), mastered: Store.objectiveProgress().mastered };
  }
  function weekdayName(dateStr) {
    var p = dateStr.split("-").map(Number);
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(p[0], p[1] - 1, p[2]).getDay()];
  }
  // Earn-Back repair: a double-size session (full card queue + 16 questions);
  // the repair is recorded ONLY when the whole session completes.
  function startRepairSession() {
    var before = sessionBaseline();
    var plan = Store.buildSession(16);
    function doQuestions() {
      runQuestions(plan.questions, "practice", function (res) {
        var restored = Store.recordRepair();
        showRecap({
          title: restored ? "Streak earned back" : "Session complete",
          res: res, cardsCount: plan.cards.length, before: before, repaired: restored
        });
      });
    }
    if (plan.cards.length) runFlashcardDeck(plan.cards, doQuestions);
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

  // ---- session-end recap (chunk 7): the peak-end moment --------------------
  // Scaled celebration, then honest lines: what you did, ONE true delta (shown
  // even when zero or negative), what tomorrow holds, and - only when there is
  // a true stat worth saying - a rotating surprise line. Never inflated.
  function showRecap(opts) {
    var after = { r: Store.readiness(), mastered: Store.objectiveProgress().mastered };
    var deltaPts = Math.round((after.r - opts.before.r) * 100);
    var newMastered = after.mastered - opts.before.mastered;
    var effort = (opts.res.total || 0) + (opts.cardsCount || 0);
    confetti(Math.min(64, 20 + effort * 2 + (newMastered > 0 ? 18 : 0) + (opts.repaired ? 12 : 0)));

    var wrap = h("div", "card done recap");
    wrap.appendChild(h("h2", null, opts.title));
    if (opts.res.total) wrap.appendChild(h("div", "done-score", opts.res.correct + " / " + opts.res.total + " correct"));
    var lines = h("div", "recap-lines");

    // 1 - what you did
    var didBits = [];
    if (opts.cardsCount) didBits.push(opts.cardsCount + " flashcard" + (opts.cardsCount === 1 ? "" : "s") + " reviewed");
    if (opts.res.total) {
      var pct = Math.round((opts.res.correct / opts.res.total) * 100);
      didBits.push(opts.res.total + " question" + (opts.res.total === 1 ? "" : "s") + " answered (" + pct + "% correct)");
    }
    lines.appendChild(recapLine("circleCheck", didBits.join(" · ") || "Session logged", null));

    // 2 - the true delta, even when it is zero or negative
    var dir = deltaPts > 0 ? "up" : (deltaPts < 0 ? "down" : "flat");
    var dTxt = (deltaPts > 0 ? "+" : "") + deltaPts + " pt" + (Math.abs(deltaPts) === 1 ? "" : "s") + " readiness tonight";
    if (deltaPts < 0) dTxt += " - dips happen when practice exposes weak spots; that's the system working";
    else if (deltaPts === 0) dTxt += " - readiness moves slowly by design; the work still counts";
    lines.appendChild(recapLine(dir === "up" ? "trendingUp" : (dir === "down" ? "trendingDown" : "trendingFlat"), dTxt, dir));

    // 3 - tomorrow, concretely
    var tm = Store.tomorrowPreview();
    var tTxt = tm.offDay
      ? "Tomorrow's your off-day - rest. " + tm.nextName + ": ~" + tm.cards + " card" + (tm.cards === 1 ? "" : "s") + " + the next lecture."
      : "Tomorrow: ~" + tm.cards + " card" + (tm.cards === 1 ? "" : "s") + " + the next lecture.";
    lines.appendChild(recapLine("calendar", tTxt, null));

    // 4 - honest surprise (only when a true stat exists)
    var s = surpriseLine(newMastered, after);
    if (s) lines.appendChild(s);

    wrap.appendChild(lines);
    var row = h("div", "actions");
    row.style.justifyContent = "center";
    var a = h("button", "btn btn-primary", "Back to Home"); a.onclick = function () { go("home"); };
    var b = h("button", "btn", "See progress"); b.onclick = function () { go("progress"); };
    row.appendChild(a); row.appendChild(b);
    wrap.appendChild(row);
    mount(wrap);
  }
  function recapLine(iconKey, text, tone) {
    var d = h("div", "recap-line" + (tone ? " " + tone : ""));
    var ic = h("span", "recap-ic");
    ic.innerHTML = (window.ICONS && ICONS[iconKey]) || "";
    d.appendChild(ic);
    d.appendChild(h("span", null, text));
    return d;
  }
  // candidates are all TRUE stats; a new mastered objective takes priority,
  // otherwise rotate by day so the slot doesn't repeat every night
  function surpriseLine(newMastered, after) {
    if (newMastered > 0) {
      return supLine("New exam skill proven tonight - that's " +
        after.mastered + " of " + Store.objectiveProgress().total + " objectives mastered.");
    }
    var cands = [];
    var totalAnswers = Store.calibration().length;
    if (totalAnswers >= 20) cands.push("You've answered " + totalAnswers + " practice questions so far.");
    var mature = Store.cardCounts().mature;
    if (mature > 0) cands.push(mature + " fact" + (mature === 1 ? " is" : "s are") + " locked into long-term memory.");
    var st = Store.streak();
    if (st >= 3) cands.push("That's " + st + " scheduled nights in a row.");
    if (after.mastered > 0) cands.push(after.mastered + " of " + Store.objectiveProgress().total + " exam skills proven.");
    if (!cands.length) return null;
    return supLine(cands[new Date().getDate() % cands.length]);
  }
  function supLine(text) { return recapLine("sparkles", text, "surprise"); }

  // ---- confetti (chunk 7, the last W1 leftover) -----------------------------
  // Brand colors only, under 2 seconds, pointer-events none so it can never
  // block input, and absent entirely under reduced-motion.
  function confetti(count) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var old = document.querySelector(".confetti");
    if (old) old.remove();
    var box = h("div", "confetti");
    box.setAttribute("aria-hidden", "true");
    var tones = ["cfp-o", "cfp-l", "cfp-s", "cfp-w"];
    for (var i = 0; i < count; i++) {
      var p = h("span", "cfp " + tones[i % tones.length]);
      p.style.left = (Math.random() * 100) + "%";
      p.style.animationDelay = (Math.random() * 0.3).toFixed(2) + "s";
      p.style.animationDuration = (1.1 + Math.random() * 0.6).toFixed(2) + "s";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 2000);
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
    var tq = Store.tonightQueue();
    var lch = Store.leeches();

    // deck breakdown: new (never rated) / learning / mature (interval > 21d)
    var counts = { fresh: 0, learning: 0, mature: 0 };
    CONTENT.cards.forEach(function (c) {
      var s = Store.cardState(c.id);
      if (!s || s.box === 0) counts.fresh++;
      else if (s.interval > 21) counts.mature++;
      else counts.learning++;
    });

    var deck = h("div", "deck-hero dark-panel");
    var top = h("div", "deck-top");
    top.appendChild(chipIcon("layers", tq.cards.length ? "orange" : "lime"));
    var nums = h("div");
    nums.appendChild(h("div", "deck-due", String(tq.cards.length)));
    var lab = h("div", "deck-due-lab");
    lab.appendChild(document.createTextNode(tq.deferred
      ? "tonight — " + tq.deferred + " more spread across this week"
      : "due tonight · " + CONTENT.cards.length + " cards in the deck"));
    if (tq.deferred) lab.appendChild(infoBtn("spread", deck));
    nums.appendChild(lab);
    top.appendChild(nums);
    deck.appendChild(top);

    var chips = h("div", "stat-chips");
    chips.appendChild(h("span", "stat-chip tone-slate", counts.fresh + " new"));
    chips.appendChild(h("span", "stat-chip tone-orange", counts.learning + " learning"));
    chips.appendChild(h("span", "stat-chip tone-lime", counts.mature + " mature"));
    chips.appendChild(infoBtn("stages", deck));
    if (lch.length) {
      chips.appendChild(h("span", "stat-chip tone-slate", lch.length + " moved to lab"));
      chips.appendChild(infoBtn("leech", deck));
    }
    deck.appendChild(chips);

    // 7-day due forecast (spaced repetition made visible): bars rise off one
    // baseline; a day with nothing due is a quiet dot, not an empty block
    var fc = Store.dueForecast(7);
    var maxDue = Math.max.apply(null, fc.map(function (d) { return d.due; }).concat([1]));
    var chart = h("div", "fchart");
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-label", "Reviews due over the next 7 days: " +
      fc.map(function (d) { return d.label + " " + d.due; }).join(", "));
    var labels = h("div", "flabels");
    labels.setAttribute("aria-hidden", "true");
    fc.forEach(function (d, i) {
      var cell = h("div", "fcell" + (i === 0 ? " today" : ""));
      if (d.due > 0) {
        cell.appendChild(h("div", "fcol-n", String(d.due)));
        var bar = h("div", "fbar");
        // px, not % - the flex cell has no fixed height for a % to resolve
        bar.style.height = Math.max(10, Math.round((d.due / maxDue) * 60)) + "px";
        cell.appendChild(bar);
      } else {
        cell.appendChild(h("div", "fdot"));
      }
      chart.appendChild(cell);
      labels.appendChild(h("div", "fcol-lab" + (i === 0 ? " today" : ""), d.label));
    });
    // slate inner panel on the onyx hero (layering rule)
    var fbox = h("div", "panel-inner");
    var kick = h("div", "pi-kicker");
    var kic = h("span");
    kic.innerHTML = (window.ICONS && ICONS.chartLine) || "";
    if (kic.firstChild) kick.appendChild(kic.firstChild);
    kick.appendChild(document.createTextNode("Your review load this week"));
    fbox.appendChild(kick);
    fbox.appendChild(chart);
    fbox.appendChild(labels);
    fbox.appendChild(h("p", "forecast-cap", "Spaced repetition schedules each card just before you'd forget it — nights stay light when you keep up."));
    deck.appendChild(fbox);

    var row = h("div", "filters");
    var b1 = h("button", "btn btn-primary", "Review tonight (" + tq.cards.length + ")");
    b1.onclick = function () { if (tq.cards.length) runFlashcardDeck(tq.cards, function () { go("cards"); }); };
    if (!tq.cards.length) b1.disabled = true;
    row.appendChild(b1);
    var b2 = h("button", "btn", "Review all (" + CONTENT.cards.length + ")");
    b2.onclick = function () { runFlashcardDeck(CONTENT.cards.slice(), function () { go("cards"); }); };
    row.appendChild(b2);
    deck.appendChild(row);
    wrap.appendChild(deck);

    if (!tq.cards.length) wrap.appendChild(emptyState("circleCheck", "All caught up",
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
      // onyx stage around the card (layering rule: media/feature stages = onyx)
      var stagePanel = h("div", "fc-wrap dark-panel");
      stagePanel.appendChild(stage);
      stagePanel.appendChild(h("div", "fc-hint", "Tap the card to flip. Desktop: space flips, 1 2 3 rates."));
      var acts = h("div", "fc-actions");
      stagePanel.appendChild(acts);
      wrap.appendChild(stagePanel);

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
        var s = Store.reviewCard(c.id, rating);
        i++;
        // leech moment: the 3rd miss routes this card to Saturday's lab -
        // tell the learner the system is managing difficulty FOR them
        if (rating === "again" && s.lapses === 3) { showLeechNote(); return; }
        show();
      }
      function showLeechNote() {
        var v = h("div", "runner");
        var note = h("div", "card leech-note");
        note.appendChild(chipIcon("listChecks", "slate"));
        var txt = h("div");
        txt.appendChild(h("div", "ln-title", "Moved to Saturday's lab"));
        txt.appendChild(h("p", "ln-sub muted",
          "You've missed this one 3 times — that's not a memory problem, it's a build-it problem. " +
          "It's out of your review pile; you'll practice it hands-on instead."));
        note.appendChild(txt);
        var cont = h("button", "btn btn-primary", "Continue  →");
        cont.onclick = function () { show(); };
        note.appendChild(cont);
        v.appendChild(note);
        mount(v);
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

    var ra = readAloudControl(g);
    if (ra) wrap.appendChild(ra);

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
      body.appendChild(h("p", "gsec-cap muted small",
        "Each fact below is a real flashcard in your deck — these are the ones to lock into memory."));
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
      body.appendChild(h("p", "gsec-cap muted small",
        "Hands-on practice for this section — do each step in Azure yourself, then check it off."));
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

  // ---- read-aloud (chunk 8): browser Web Speech API, play/pause/resume/stop -
  // v1 uses the browser's built-in speechSynthesis (free, offline, no keys).
  // Feature-detected so a browser without it simply shows no control. Speech
  // is cancelled on navigation away, same as the flashcard runner's cleanup.
  function stripTags(html) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
  }
  function guideSpeechText(g) {
    var parts = [g.title];
    if (g.description) parts.push(g.description);
    (g.sections || []).forEach(function (s) {
      if (s.kind === "diagram") return;                  // nothing to read in an SVG
      if (s.title || s.label) parts.push((s.title || s.label) + ".");
      if (s.note) parts.push(stripTags(s.note));
      (s.items || []).forEach(function (it) { parts.push(stripTags(it)); });
      if (s.html) parts.push(stripTags(s.html));
    });
    return parts.filter(Boolean).join(". ");
  }
  function readAloudControl(g) {
    if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance === "undefined") return null;
    var text = guideSpeechText(g);
    if (!text) return null;
    var synth = window.speechSynthesis;
    var wrap = h("div", "readaloud");
    var lead = h("span", "ra-lead");
    lead.innerHTML = (window.ICONS && ICONS.volume2) || "";
    wrap.appendChild(lead);
    var toggle = h("button", "btn ra-toggle");
    var stop = h("button", "btn ra-stop");
    function paint(stateName) {                            // idle | playing | paused
      toggle.innerHTML = "";
      var ic = h("span");
      ic.innerHTML = (window.ICONS && ICONS[stateName === "playing" ? "pause" : "play"]) || "";
      if (ic.firstChild) toggle.appendChild(ic.firstChild);
      toggle.appendChild(document.createTextNode(
        stateName === "idle" ? "Listen" : stateName === "playing" ? "Pause" : "Resume"));
      toggle.setAttribute("aria-label", stateName === "playing" ? "Pause reading" : stateName === "paused" ? "Resume reading" : "Read this guide aloud");
      stop.disabled = stateName === "idle";
    }
    function start() {
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.onend = function () { paint("idle"); };
      u.onerror = function () { paint("idle"); };
      synth.cancel();
      synth.speak(u);
      paint("playing");
    }
    toggle.onclick = function () {
      if (!synth.speaking) { start(); return; }
      if (synth.paused) { synth.resume(); paint("playing"); }
      else { synth.pause(); paint("paused"); }
    };
    stop.innerHTML = (window.ICONS && ICONS.square) || "";
    stop.appendChild(document.createTextNode("Stop"));
    stop.setAttribute("aria-label", "Stop reading");
    stop.onclick = function () { synth.cancel(); paint("idle"); };
    paint("idle");
    // never keep reading after the learner leaves the guide
    window.addEventListener("hashchange", function () { try { synth.cancel(); } catch (e) {} }, { once: true });
    wrap.appendChild(toggle);
    wrap.appendChild(stop);
    return wrap;
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

    // orange showcase panel (layering rule variant): orange surface, onyx
    // lettering, white compass mark watermark
    var total = CONTENT.questions.length;
    var cfg = h("div", "mock-cfg panel-orange");
    cfg.appendChild(h("div", "po-kicker", "Real clock · about 90 seconds per question"));
    cfg.appendChild(h("div", "po-title", "Ready to test yourself?"));
    cfg.appendChild(h("div", "po-lab", "Length"));
    var counts = [10, total].filter(function (v, idx, a) { return a.indexOf(v) === idx && v <= total; });
    var chosenN = counts[0];
    var row = h("div", "filters");
    counts.forEach(function (n) {
      var b = h("button", "pill" + (n === chosenN ? " on" : ""), n + " questions");
      b.onclick = function () { chosenN = n; row.querySelectorAll(".pill").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); };
      row.appendChild(b);
    });
    cfg.appendChild(row);
    var start = h("button", "btn btn-lg mock-start", "Start mock  →");
    start.onclick = function () { startMock(chosenN); };
    cfg.appendChild(start);
    cfg.appendChild(h("p", "po-note", "Graded at the end, just like exam day — scores of 85%+ count toward your booking gate."));
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
    var hero = h("div", "prog-hero dark-panel");
    hero.appendChild(readinessRing(r * 100, 180, "progress", "of 85% target"));
    var stats = h("div", "ph-stats");
    stats.appendChild(phStat("Days to exam", String(Store.daysToExam())));
    stats.appendChild(phStat("Booking gate", gate.passing + " of " + gate.needed + " mocks ≥ " + gate.threshold + "%", "gate", hero));
    stats.appendChild(phStat("Mature cards", cc.mature + " of " + cc.total, "mature", hero));
    stats.appendChild(trendStat(hero));
    stats.appendChild(howBtn("readiness", "How readiness works", hero));
    hero.appendChild(stats);
    // the honest-low caption: shown only while readiness is actually low
    if (r < 0.10) {
      hero.appendChild(h("p", "flag-note", "This number is designed to start near zero and be earned - " +
        "under 10% before Week 3 is expected. Watch the trend, not the level."));
    }
    wrap.appendChild(hero);

    // the 8-week milestone map: where this week sits on the road to the exam
    wrap.appendChild(planSection());

    // milestone badges: real thresholds only, criteria printed on each
    wrap.appendChild(badgesSection());

    // course position: the whole-course view (lectures + objectives)
    var cp = Store.courseProgress();
    var cpsec = section("Course progress", "graduationCap", "objectives");
    cpsec.appendChild(courseRow("Lectures watched", cp.lectures_watched, cp.lectures_total,
      "How far you are through the course videos."));
    cpsec.appendChild(courseRow("Objectives mastered", cp.objectives_mastered, cp.objectives_total,
      "Exam skills you've proven with correct answers on separate days."));
    wrap.appendChild(cpsec);

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

    // objectives by domain: covered (light) vs mastered (lime), per domain
    var csec = section("Objectives by domain", "listChecks", "objectives");
    Store.objectiveProgress().domains.forEach(function (d) {
      var row = h("div", "dbar");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", d.name + ": " + d.mastered + " of " + d.total +
        " objectives mastered, " + d.touched + " covered so far" +
        (d.gaps ? ", " + d.gaps + " known gap" + (d.gaps > 1 ? "s" : "") : ""));
      row.appendChild(h("div", "dbar-lab",
        d.name + " · " + d.mastered + " mastered · " + d.touched + " of " + d.total + " covered" +
        (d.gaps ? "  ·  " + d.gaps + " gap" + (d.gaps > 1 ? "s" : "") : "")));
      row.appendChild(layeredBar(d.mastered / d.total, d.touched / d.total));
      csec.appendChild(row);
    });
    csec.appendChild(h("p", "muted small",
      "Light fill = taught by your materials so far. Solid green = proven by your answers."));
    wrap.appendChild(csec);

    // calibration
    var cal = Store.calibration();
    var calsec = section("Confidence vs accuracy", "lightbulb", "calibration");
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

    // streak calendar: studied / frozen / repaired / off days all distinct -
    // the history is never rewritten, so recovery marks stay visible
    var ssec = section("Study streak (last 30 days)", "flame", "streak");
    var si2 = Store.streakInfo();
    if (si2.preStart) {
      // before the plan starts there is no calendar to show - say so instead
      // of rendering a month of empty cells
      ssec.appendChild(emptyState("flame", "Your calendar starts Monday",
        "Every scheduled study night you complete turns a square green here. Sundays are off-days — they never count against you.", null));
    } else {
      var days = Store.calendar(30);
      var tally = { studied: 0, frozen: 0, repaired: 0 };
      var CELL_CLASS = { studied: " on", extra: " on", frozen: " frz", repaired: " rep", pending: " pend", off: " offd", missed: "" };
      var grid = h("div", "streak-grid");
      grid.setAttribute("role", "img");
      days.forEach(function (d) {
        if (d.state === "studied" || d.state === "extra") tally.studied++;
        if (d.state === "frozen") tally.frozen++;
        if (d.state === "repaired") tally.repaired++;
        var cell = h("div", "streak-cell" + (CELL_CLASS[d.state] || ""));
        cell.title = d.date + " · " + d.state;
        grid.appendChild(cell);
      });
      grid.setAttribute("aria-label", "Last 30 days: studied on " + tally.studied +
        (tally.frozen ? ", " + tally.frozen + " covered by a streak freeze" : "") +
        (tally.repaired ? ", " + tally.repaired + " earned back" : ""));
      ssec.appendChild(grid);
      // designed legend: swatch chips, not a wall of text
      var leg = h("div", "cal-legend");
      [["on", "Studied"], ["frz", "Freeze covered it"], ["rep", "Earned back"], ["offd", "Off-day"]].forEach(function (k) {
        var item = h("span", "cal-key");
        item.appendChild(h("span", "streak-cell cal-swatch " + k[0]));
        item.appendChild(h("span", "cal-key-lab", k[1]));
        leg.appendChild(item);
      });
      ssec.appendChild(leg);
      ssec.appendChild(h("p", "muted small",
        "Current streak: " + si2.days + " scheduled day" + (si2.days === 1 ? "" : "s") +
        (si2.freezes ? " · " + si2.freezes + " freeze" + (si2.freezes > 1 ? "s" : "") + " saved" : "") +
        " · Sundays never count against you."));
    }
    wrap.appendChild(ssec);

    // mock trend
    var msec = section("Practice-exam trend", "chartLine", "mock");
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
  // ---- 8-week milestone map (chunk 7) ---------------------------------------
  // Phase rows of week cells, never one long bar. Past weeks are neutral (a
  // week behind you is not automatically a week done well), the current week
  // is orange, exam week is its own chip at the end.
  function fmtShortDate(dateStr) {
    var p = dateStr.split("-").map(Number);
    var M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return M[p[1] - 1] + " " + p[2];
  }
  function planSection() {
    var pw = Store.planWeeks();
    var sec = section("Your 8-week plan", "calendar", "plan");
    var card = h("div", "card plan-card");
    // group consecutive weeks by phase label (from STUDY_DATA.schedule.phases)
    var groups = [];
    pw.weeks.forEach(function (w) {
      var g = groups[groups.length - 1];
      if (!g || g.label !== w.phase) { g = { label: w.phase, weeks: [] }; groups.push(g); }
      g.weeks.push(w);
    });
    groups.forEach(function (g) {
      var row = h("div", "plan-phase");
      row.setAttribute("role", "img");
      row.setAttribute("aria-label", g.label + ": weeks " + g.weeks[0].n + " to " +
        g.weeks[g.weeks.length - 1].n +
        (g.weeks.some(function (w) { return w.state === "current"; }) ? ", you are here" : ""));
      row.appendChild(h("div", "plan-lab", g.label));
      var cells = h("div", "plan-weeks");
      g.weeks.forEach(function (w) {
        cells.appendChild(h("span", "pw-cell " + w.state, "W" + w.n));
      });
      row.appendChild(cells);
      card.appendChild(row);
    });
    var ex = h("div", "plan-phase");
    ex.setAttribute("role", "img");
    ex.setAttribute("aria-label", "Exam week starts " + fmtShortDate(STUDY_DATA.meta.exam_date));
    ex.appendChild(h("div", "plan-lab", "Exam"));
    var ec = h("div", "plan-weeks");
    ec.appendChild(h("span", "pw-cell pw-exam", "Week of " + fmtShortDate(STUDY_DATA.meta.exam_date)));
    ex.appendChild(ec);
    card.appendChild(ex);
    var cur = pw.weeks.filter(function (w) { return w.state === "current"; })[0];
    card.appendChild(h("p", "plan-cap muted small", cur
      ? "You're in week " + cur.n + ": " + cur.phase + "."
      : "Your plan starts Monday - week 1 begins " + fmtShortDate(STUDY_DATA.meta.study_start) + "."));
    sec.appendChild(card);
    return sec;
  }
  // ---- milestone badges (chunk 8) ------------------------------------------
  // Onyx panel, slate tiles; earned = lime accent + "Earned", locked = calm
  // with its criteria printed. Real thresholds only (mechanic #13).
  function badgesSection() {
    var data = Store.badges();
    var sec = section("Milestones", "award", "badges");
    var panel = h("div", "badge-panel dark-panel");
    panel.appendChild(h("div", "badge-count", data.earned + " of " + data.total + " earned"));
    panel.appendChild(h("p", "badge-sub muted",
      "Each badge marks a real milestone — the goal is printed on every one. Nothing here is given for just showing up."));
    var grid = h("div", "badge-grid");
    data.badges.forEach(function (b) {
      var tile = h("div", "badge-tile panel-inner " + (b.earned ? "earned" : "locked"));
      tile.setAttribute("role", "img");
      tile.setAttribute("aria-label", b.label + (b.earned ? " — earned. " : " — locked. ") + b.criteria);
      var ic = h("span", "badge-ic");
      ic.innerHTML = (window.ICONS && ICONS.award) || "";
      tile.appendChild(ic);
      tile.appendChild(h("div", "badge-label", b.label));
      tile.appendChild(h("div", "badge-crit", b.criteria));
      if (b.earned) {
        var e = h("span", "badge-earned");
        e.innerHTML = (window.ICONS && ICONS.circleCheck) || "";
        e.appendChild(document.createTextNode("Earned"));
        tile.appendChild(e);
      }
      grid.appendChild(tile);
    });
    panel.appendChild(grid);
    sec.appendChild(panel);
    return sec;
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
  // readiness trend: slope arrow + delta + sparkline in one hero stat row
  function trendStat(host) {
    var t = Store.readinessTrend();
    var row = h("div", "ph-stat");
    var lw = h("span", "kpi-title-wrap");
    lw.appendChild(h("span", "ph-label", "7-day trend"));
    lw.appendChild(infoBtn("trend", host));
    row.appendChild(lw);
    var val = h("span", "ph-val ph-trend-val");
    if (!t.hasTrend) {
      val.classList.add("flat");
      val.appendChild(document.createTextNode("shows after 2 study days"));
    } else {
      var pts = Math.round(t.delta * 100);
      var dir = pts > 0 ? "up" : (pts < 0 ? "down" : "flat");
      val.classList.add(dir);
      var ic = h("span");
      ic.innerHTML = ICONS[dir === "up" ? "trendingUp" : (dir === "down" ? "trendingDown" : "trendingFlat")] || "";
      if (ic.firstChild) val.appendChild(ic.firstChild);
      val.appendChild(document.createTextNode(
        (pts > 0 ? "+" : "") + pts + " pt" + (Math.abs(pts) === 1 ? "" : "s") + " this week"));
      var spark = sparkline(t.points);
      if (spark) val.appendChild(spark);
    }
    row.appendChild(val);
    return row;
  }
  // tiny readiness sparkline from the daily snapshots (decorative; trend row
  // carries the accessible text, so this is aria-hidden)
  function sparkline(points) {
    if (!points || points.length < 2) return null;
    var W = 84, H = 24, PAD = 3;
    var max = 0;
    points.forEach(function (p) { if (p.r > max) max = p.r; });
    if (max <= 0) max = 0.01;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "spark");
    svg.setAttribute("width", W); svg.setAttribute("height", H);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("aria-hidden", "true");
    var coords = points.map(function (p, i) {
      var x = PAD + (i / (points.length - 1)) * (W - 2 * PAD);
      var y = H - PAD - (p.r / max) * (H - 2 * PAD);
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    });
    var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("class", "spark-line");
    line.setAttribute("points", coords.map(function (c) { return c.join(","); }).join(" "));
    svg.appendChild(line);
    var end = coords[coords.length - 1];
    var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("class", "spark-dot");
    dot.setAttribute("cx", end[0]); dot.setAttribute("cy", end[1]); dot.setAttribute("r", 2.5);
    svg.appendChild(dot);
    return svg;
  }
  // course-progress row: "Lectures watched · 3 of 102" + neutral bar + caption
  function courseRow(label, n, total, caption) {
    var row = h("div", "dbar");
    row.setAttribute("role", "img");
    row.setAttribute("aria-label", label + ": " + n + " of " + total + ". " + caption);
    row.appendChild(h("div", "dbar-lab", label + " · " + n + " of " + total));
    var pct = total ? Math.round((n / total) * 100) : 0;
    var bar = h("div", "bar bar-inline");
    var fill = h("div", "bar-fill");
    fill.style.width = pct + "%";
    bar.appendChild(fill);
    var wrapB = h("div", "bar-wrap");
    wrapB.appendChild(bar);
    wrapB.appendChild(h("span", "bar-pct muted", pct + "%"));
    row.appendChild(wrapB);
    row.appendChild(h("div", "muted small", caption));
    return row;
  }
  // two-layer bar: light fill = covered by materials, solid lime = mastered
  function layeredBar(masteredFrac, coverFrac) {
    var bar = h("div", "bar bar-inline bar-layered");
    var cover = h("div", "bar-fill cover");
    cover.style.width = Math.round(Math.max(0, Math.min(1, coverFrac)) * 100) + "%";
    bar.appendChild(cover);
    var mast = h("div", "bar-fill mastered");
    mast.style.width = Math.round(Math.max(0, Math.min(1, masteredFrac)) * 100) + "%";
    bar.appendChild(mast);
    var wrapB = h("div", "bar-wrap");
    wrapB.appendChild(bar);
    wrapB.appendChild(h("span", "bar-pct muted", Math.round(masteredFrac * 100) + "%"));
    return wrapB;
  }
  // decision 22: the weakest HEAVY domain gets flagged in a plain sentence.
  // Three honest states: nothing tried yet / a heavy domain untouched / all
  // heavy domains tried - steer or maintain depending on how they're holding.
  function weakestNote(dd) {
    var heavy = dd.filter(function (d) { return d.weight >= 0.2; });
    var tried = heavy.filter(function (d) { return d.attempts > 0; });
    if (!tried.length) {
      return h("p", "flag-note", "No heavy-domain attempts yet. " + DOMAIN_NAME.D2 +
        " is a third of the exam — start your practice there.");
    }
    var untouched = heavy.filter(function (d) { return d.attempts === 0; })
      .sort(function (a, b) { return b.weight - a.weight; });
    if (untouched.length) {
      var u = untouched[0];
      return h("p", "flag-note", "You haven't practiced " + u.name + " yet — it's " +
        Math.round(u.weight * 100) + "% of the exam. Point your next session there.");
    }
    tried.sort(function (a, b) { return a.accuracy - b.accuracy; });
    var w = tried[0];
    if (w.accuracy >= 0.85) {
      return h("p", "flag-note ok", "Your heavy domains are holding — the weakest, " + w.name +
        ", is at " + Math.round(w.accuracy * 100) + "% correct. Keep them warm with mixed practice " +
        "and put new effort into the smaller domains.");
    }
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
