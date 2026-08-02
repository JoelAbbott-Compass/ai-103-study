/* ============================================================================
   AI-103 STUDY APP — STORE  (window.Store)
   ----------------------------------------------------------------------------
   Owns Joel's live progress in browser localStorage: answered questions,
   spaced-repetition card state, mock scores, study-day streak, calibration.
   Also builds the "Study now" session and derives all dashboard metrics.
   Pure browser JS — Date and localStorage are fine here.
   ========================================================================== */

window.Store = (function () {
  "use strict";

  var KEY = "ai103_v1";
  var LADDER = [1, 3, 7, 14, 30];              // spaced-repetition interval ladder (days)
  var CONF = { low: 0.25, med: 0.6, high: 0.9 }; // confidence tag -> numeric

  // ---- date helpers (local, no UTC surprises) ----------------------------
  function todayStr(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }
  function addDays(dateStr, n) {
    var p = dateStr.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + n);
    return todayStr(d);
  }
  function daysBetween(aStr, bStr) {
    var a = aStr.split("-").map(Number), b = bStr.split("-").map(Number);
    var da = new Date(a[0], a[1] - 1, a[2]), db = new Date(b[0], b[1] - 1, b[2]);
    return Math.round((db - da) / 86400000);
  }
  function tsToDateStr(ts) { return ts ? todayStr(new Date(ts)) : todayStr(); }

  // ---- state --------------------------------------------------------------
  function blank() {
    return { answers: {}, cards: {}, mocks: [], studyDays: [], guides: {}, snapshots: [], repairs: [], quests: {} };
  }
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return seed(blank());
      var parsed = JSON.parse(raw);
      return seed(Object.assign(blank(), parsed));
    } catch (e) {
      return seed(blank());
    }
  }
  // seed any not-yet-tracked card as a brand-new (due today) card
  function seed(s) {
    (window.CONTENT ? CONTENT.cards : []).forEach(function (c) {
      if (!s.cards[c.id]) {
        s.cards[c.id] = { box: 0, interval: 0, nextReview: todayStr(), lapses: 0, learned: null };
      }
    });
    return s;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function markStudyDay() {
    var t = todayStr();
    if (state.studyDays.indexOf(t) === -1) { state.studyDays.push(t); state.studyDays.sort(); }
  }

  // ---- questions ----------------------------------------------------------
  function recordAnswer(qid, correct, confidence, domain) {
    if (!state.answers[qid]) state.answers[qid] = [];
    state.answers[qid].push({ ts: Date.now(), correct: !!correct, confidence: confidence || "med", domain: domain });
    markStudyDay();
    snapshot();
    save();
  }
  function lastAnswer(qid) {
    var a = state.answers[qid];
    return a && a.length ? a[a.length - 1] : null;
  }
  // "retry my misses": most recent answer was wrong
  function misses() {
    return CONTENT.questions.filter(function (q) {
      var la = lastAnswer(q.id);
      return la && la.correct === false;
    });
  }

  // ---- flashcards (spaced repetition) ------------------------------------
  function cardState(cid) { return state.cards[cid]; }
  function dueCards() {
    var t = todayStr();
    return CONTENT.cards.filter(function (c) {
      var s = state.cards[c.id];
      return !s || s.nextReview <= t;
    });
  }
  // ---- tonight's queue: backlog auto-spread + leech routing ---------------
  // The visible nightly pile is capped; anything beyond it simply stays due
  // and surfaces over the next nights (nextReview data is NEVER rewritten -
  // only presentation softens). Cards failed 3+ times are leeches: they're
  // routed out of the review queue toward Saturday's lab per the leech rule.
  var NIGHT_CAP = 15;
  function isLeech(cid) { var s = state.cards[cid]; return !!s && s.lapses >= 3; }
  function leeches() { return CONTENT.cards.filter(function (c) { return isLeech(c.id); }); }
  function tonightQueue() {
    var t = todayStr();
    var pool = CONTENT.cards.filter(function (c) {
      if (isLeech(c.id)) return false;
      var s = state.cards[c.id];
      return !s || s.nextReview <= t;
    });
    pool.sort(function (a, b) {                     // most behind first, then shakier memory
      var sa = state.cards[a.id] || { nextReview: t, box: 0 };
      var sb = state.cards[b.id] || { nextReview: t, box: 0 };
      if (sa.nextReview !== sb.nextReview) return sa.nextReview < sb.nextReview ? -1 : 1;
      return sa.box - sb.box;
    });
    if (pool.length <= NIGHT_CAP) return { cards: pool, deferred: 0, spreadDays: 0 };
    var deferred = pool.length - NIGHT_CAP;
    return { cards: pool.slice(0, NIGHT_CAP), deferred: deferred, spreadDays: Math.ceil(deferred / NIGHT_CAP) };
  }

  function reviewCard(cid, rating) {  // rating: "again" | "hard" | "good"
    var s = state.cards[cid] || { box: 0, interval: 0, nextReview: todayStr(), lapses: 0, learned: null };
    if (!s.learned) s.learned = todayStr();
    if (rating === "again") {
      s.box = 1; s.interval = 1; s.lapses += 1;
    } else if (rating === "hard") {
      s.box = Math.max(1, s.box);
      s.interval = LADDER[Math.max(0, s.box - 1)];
    } else { // good
      s.box = s.box + 1;
      s.interval = LADDER[Math.min(s.box, LADDER.length - 1)];
    }
    s.nextReview = addDays(todayStr(), s.interval);
    state.cards[cid] = s;
    markStudyDay();
    snapshot();
    save();
    return s;
  }

  // ---- "Study now" session builder ---------------------------------------
  // Mix: due cards (memory) + questions weighted to the weakest domain,
  // preferring your misses and unseen questions, with light interleaving.
  function buildSession(qCount) {
    qCount = qCount || 8;
    var tq = tonightQueue();
    var cards = tq.cards;

    var weakest = weakestDomain();
    var missSet = {}; misses().forEach(function (q) { missSet[q.id] = true; });

    var scored = CONTENT.questions.map(function (q) {
      var score = 0;
      if (missSet[q.id]) score += 5;                 // re-drill misses first
      if (q.domain === weakest) score += 3;          // steer to weakest domain
      if (!lastAnswer(q.id)) score += 2;             // prefer unseen
      score += (q.id.charCodeAt(4) % 3);             // deterministic tie-break spread
      return { q: q, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    var questions = scored.slice(0, qCount).map(function (x) { return x.q; });
    return { cards: cards, questions: questions, weakest: weakest, deferred: tq.deferred };
  }

  // ---- metrics (derived for the Progress tab) ----------------------------
  function perDomain() {
    var cfg = STUDY_DATA.domains;
    return cfg.map(function (d) {
      var attempts = 0, correct = 0;
      Object.keys(state.answers).forEach(function (qid) {
        state.answers[qid].forEach(function (a) {
          if (a.domain === d.id) { attempts++; if (a.correct) correct++; }
        });
      });
      var acc = attempts ? correct / attempts : 0;
      // Conservative trust ramp: a domain counts NOTHING under 5 attempts, then
      // ramps linearly to full trust at 15 — a few answers can't inflate readiness.
      var discount = attempts < 5 ? 0 : Math.min(1, (attempts - 4) / 11);
      return {
        id: d.id, name: d.name, weight: d.weight,
        attempts: attempts, correct: correct, accuracy: acc,
        mastery: acc * discount,
        objectives_total: d.objectives_total, objectives_touched: d.objectives_touched, gaps: d.gaps
      };
    });
  }
  function weakestDomain() {
    // weakest among heavy/attempted domains; default to biggest domain early on
    var dd = perDomain();
    var withData = dd.filter(function (d) { return d.attempts > 0; });
    if (!withData.length) return "D2"; // biggest weight, sensible early focus
    withData.sort(function (a, b) { return a.accuracy - b.accuracy; });
    return withData[0].id;
  }
  function cardCounts() {
    var t = todayStr(), total = CONTENT.cards.length, due = 0, overdue = 0, mature = 0;
    CONTENT.cards.forEach(function (c) {
      var s = state.cards[c.id];
      if (!s) { due++; return; }
      if (s.nextReview <= t) due++;
      if (s.nextReview < t) overdue++;
      if (s.interval > 21) mature++;
    });
    return { total: total, due_today: due, overdue: overdue, mature: mature };
  }
  function calibration() {
    var pts = [];
    Object.keys(state.answers).forEach(function (qid) {
      state.answers[qid].forEach(function (a) {
        pts.push({ confidence: CONF[a.confidence] || 0.6, correct: a.correct ? 1 : 0, tag: a.confidence, domain: a.domain });
      });
    });
    return pts;
  }
  // ---- scheduled-day streak (W2 chunk 6) ----------------------------------
  // The plan is Mon-Sat; Sunday is an off-day and passes silently. The streak
  // counts consecutive scheduled days handled: studied, covered by an
  // auto-granted freeze, or earned back with a repair session. Freezes are
  // earned (1 when a streak run reaches 3 days, +1 per fully-studied Mon-Sat
  // week, inventory capped at 2) and consumed automatically overnight.
  // Everything is DERIVED from studyDays + repairs on every call - no stored
  // streak or freeze counters that could drift from the honest history.
  function isScheduled(dateStr) {
    if (dateStr < STUDY_DATA.meta.study_start) return false;
    var p = dateStr.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]).getDay() !== 0; // Sunday = 0
  }
  function scheduleWalk() {
    var t = todayStr(), start = STUDY_DATA.meta.study_start;
    var states = {};      // date -> studied|repaired|frozen|missed|pending|off|extra
    var inv = 0, run = 0, grantedAt3 = false, weekAll = true;
    var studied = {}; state.studyDays.forEach(function (d) { studied[d] = true; });
    var repaired = {}; (state.repairs || []).forEach(function (r) { repaired[r.covers] = true; });
    if (t < start) return { states: states, streak: 0, freezes: 0 };
    for (var d = start; d <= t; d = addDays(d, 1)) {
      var p = d.split("-").map(Number);
      var dow = new Date(p[0], p[1] - 1, p[2]).getDay();
      if (!isScheduled(d)) {
        states[d] = studied[d] ? "extra" : "off";   // extra study still shows on the calendar
        continue;
      }
      if (studied[d]) {
        states[d] = "studied";
        run++;
        if (run === 3 && !grantedAt3) { inv = Math.min(2, inv + 1); grantedAt3 = true; }
      } else if (d === t) {
        states[d] = "pending";                      // tonight isn't a miss until the day ends
      } else if (repaired[d]) {
        states[d] = "repaired";                     // earned back; streak preserved, not incremented
        weekAll = false;
      } else if (inv > 0) {
        inv--; states[d] = "frozen";                // freeze consumed silently overnight
        weekAll = false;
      } else {
        states[d] = "missed";
        run = 0; grantedAt3 = false; weekAll = false;
      }
      if (dow === 6) {                              // Saturday closes a Mon-Sat week
        if (weekAll && d !== t) inv = Math.min(2, inv + 1);
        weekAll = true;
      }
    }
    return { states: states, streak: run, freezes: inv };
  }
  function streak() { return scheduleWalk().streak; }
  function streakInfo() {
    var w = scheduleWalk();
    return {
      days: w.streak, freezes: w.freezes, repair: repairEligible(),
      preStart: todayStr() < STUDY_DATA.meta.study_start
    };
  }
  // repair window: the single most recent scheduled day was missed with no
  // freeze, the miss is <= 2 days old, and the scheduled day before it was OK
  function repairEligible() {
    var w = scheduleWalk(), t = todayStr(), start = STUDY_DATA.meta.study_start;
    var d = addDays(t, -1), hops = 0, miss = null;
    while (d >= start && hops < 4) {
      if (isScheduled(d)) { if (w.states[d] === "missed") miss = d; break; }
      d = addDays(d, -1); hops++;
    }
    if (!miss || daysBetween(miss, t) > 2) return null;
    var prev = addDays(miss, -1), hops2 = 0;
    while (prev >= start && !isScheduled(prev) && hops2 < 4) { prev = addDays(prev, -1); hops2++; }
    if (prev >= start && isScheduled(prev) && w.states[prev] === "missed") return null;
    return { missDate: miss, daysLeft: Math.max(0, 2 - daysBetween(miss, t)) };
  }
  // called by the app ONLY when the double-size repair session completes
  function recordRepair() {
    var e = repairEligible();
    if (!e) return false;
    if (!state.repairs) state.repairs = [];
    state.repairs.push({ date: todayStr(), covers: e.missDate });
    save();
    return true;
  }
  // last-N-days calendar states for the Progress grid
  function calendar(days) {
    var w = scheduleWalk(), t = todayStr(), out = [];
    for (var i = days - 1; i >= 0; i--) {
      var d = addDays(t, -i);
      var st = w.states[d] || (state.studyDays.indexOf(d) !== -1 ? "extra" : "off");
      out.push({ date: d, state: st });
    }
    return out;
  }
  function studyDaysWindow(days) {
    var out = [], t = todayStr();
    for (var i = days - 1; i >= 0; i--) {
      var d = addDays(t, -i);
      out.push({ date: d, studied: state.studyDays.indexOf(d) !== -1 });
    }
    return out;
  }
  // next N days of card reviews as the app will actually SERVE them:
  // leeches are out of the pile, anything already due counts as today, and
  // each night is capped at NIGHT_CAP with the overflow carrying forward -
  // the same spread the nightly queue applies, so the chart never promises
  // a pile bigger than a real night.
  function dueForecast(days) {
    var t = todayStr(), counts = {};
    CONTENT.cards.forEach(function (c) {
      if (isLeech(c.id)) return;
      var s = state.cards[c.id];
      var d = (!s || s.nextReview <= t) ? t : s.nextReview;
      counts[d] = (counts[d] || 0) + 1;
    });
    var names = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var out = [], carry = 0;
    for (var i = 0; i < days; i++) {
      var d = addDays(t, i);
      var p = d.split("-").map(Number);
      var label = i === 0 ? "Today" : names[new Date(p[0], p[1] - 1, p[2]).getDay()];
      var raw = (counts[d] || 0) + carry;
      var show = Math.min(raw, NIGHT_CAP);
      carry = raw - show;
      out.push({ date: d, label: label, due: show });
    }
    return out;
  }
  // ---- tonight's quests (W2 chunk 7) ---------------------------------------
  // Three small targets derived from real state on every call, plus one
  // declinable bonus. Only three things are ever STORED (per date): the manual
  // lecture mark, the night's bonus assignment, and a bonus decline. Completion
  // is always derived - a quest can never be "done" without the work existing.
  var Q_TARGET = 8;                              // nightly question target (ritual size)
  function questDay() {
    var t = todayStr();
    if (!state.quests[t]) state.quests[t] = {};
    return state.quests[t];
  }
  function answersToday() {
    var t = todayStr(), n = 0;
    Object.keys(state.answers).forEach(function (qid) {
      state.answers[qid].forEach(function (a) { if (tsToDateStr(a.ts) === t) n++; });
    });
    return n;
  }
  // the endowed start: watching tonight's lecture is real study done before the
  // app opens, so marking it pre-fills the ring with credit that was EARNED
  function markLecture() {
    var qd = questDay();
    qd.lecture = !qd.lecture;
    save();
    return !!qd.lecture;
  }
  function declineBonus() {
    var qd = questDay();
    qd.bonusDeclined = true;
    save();
  }
  // guide review is real study at the learner's pace - manual mark, same
  // pattern as the lecture (never auto-completed by a mere open)
  function markGuide() {
    var qd = questDay();
    qd.guide = !qd.guide;
    save();
    return !!qd.guide;
  }
  function questsTonight() {
    var t = todayStr(), start = STUDY_DATA.meta.study_start;
    var qd = questDay();
    var scheduled = t >= start && isScheduled(t);
    var quests = [];
    if (scheduled) {
      quests.push({
        id: "lecture", icon: "video", label: "Watch tonight's lecture",
        manual: true, done: !!qd.lecture, status: qd.lecture ? "" : "tap when watched"
      });
    }
    var g = (window.CONTENT && CONTENT.guides && CONTENT.guides.length)
      ? CONTENT.guides[CONTENT.guides.length - 1] : null;
    if (g) {
      quests.push({
        id: "guide", icon: "bookOpen", label: "Review the newest guide",
        manual: true, done: !!qd.guide, status: qd.guide ? "" : "tap to open",
        guideId: g.id
      });
    }
    var tq = tonightQueue();
    quests.push({
      id: "cards", icon: "layers", label: "Clear tonight's flashcards",
      done: tq.cards.length === 0,
      status: tq.cards.length ? tq.cards.length + " left" : ""
    });
    var n = answersToday();
    quests.push({
      id: "questions", icon: "target", label: "Answer " + Q_TARGET + " practice questions",
      done: n >= Q_TARGET, status: Math.min(n, Q_TARGET) + " of " + Q_TARGET
    });
    // bonus: assigned once per night so it can't shift goalposts mid-session;
    // declining it costs nothing and is remembered for the night
    var bonus = null;
    if (!qd.bonusDeclined) {
      if (!qd.bonusKind) { qd.bonusKind = misses().length ? "misses" : "extra"; save(); }
      if (qd.bonusKind === "misses") {
        var m = misses().length;
        bonus = {
          id: "bonus", kind: "misses", icon: "rotateCcw", label: "Bonus: clear your missed questions",
          done: m === 0, status: m ? m + " to clear" : ""
        };
      } else {
        var extra = Math.max(0, Math.min(5, n - Q_TARGET));
        bonus = {
          id: "bonus", kind: "extra", icon: "sparkles", label: "Bonus: 5 extra questions",
          done: n >= Q_TARGET + 5, status: extra + " of 5"
        };
      }
    }
    var done = quests.filter(function (q) { return q.done; }).length;
    var note = null;
    if (!scheduled) {
      note = t < start
        ? "Your plan starts Monday - tonight's a warm-up, and it all counts."
        : "Sunday is your off-day - anything tonight is pure bonus.";
    }
    return { quests: quests, bonus: bonus, done: done, total: quests.length, note: note };
  }
  // this week's Mon-Sat at a glance (states from the same honest walker)
  function weekBar() {
    var t = todayStr(), start = STUDY_DATA.meta.study_start;
    if (t < start) return null;
    var w = scheduleWalk();
    var p = t.split("-").map(Number);
    var dow = new Date(p[0], p[1] - 1, p[2]).getDay();      // 0 Sun .. 6 Sat
    var mon = addDays(t, dow === 0 ? -6 : 1 - dow);
    var letters = ["M", "T", "W", "T", "F", "S"];
    var MAP = { studied: "done", extra: "done", frozen: "frz", repaired: "rep", pending: "pend", missed: "miss", off: "off" };
    var out = [];
    for (var i = 0; i < 6; i++) {
      var d = addDays(mon, i);
      var st = d > t ? "fut" : (MAP[w.states[d]] || (d < start ? "off" : "fut"));
      out.push({ date: d, label: letters[i], state: st });
    }
    return out;
  }
  // the 8-week milestone map: week states + the phase each belongs to
  function planWeeks() {
    var start = STUDY_DATA.meta.study_start, t = todayStr();
    var phases = STUDY_DATA.schedule.phases || [];
    var totalW = 0;
    phases.forEach(function (p) { if (p.to_week > totalW) totalW = p.to_week; });
    var weeks = [], current = null;
    for (var n = 1; n <= totalW; n++) {
      var ws = addDays(start, (n - 1) * 7), we = addDays(ws, 5);
      var st = t > we ? "past" : (t >= ws ? "current" : "future");
      if (st === "current") current = n;
      var ph = phases.filter(function (p) { return n >= p.from_week && n <= p.to_week; })[0];
      weeks.push({ n: n, state: st, phase: ph ? ph.label : "" });
    }
    return { weeks: weeks, current: current };
  }
  // what tomorrow actually holds (for the session-end recap)
  function tomorrowPreview() {
    var t = todayStr(), start = STUDY_DATA.meta.study_start;
    var d1 = addDays(t, 1);
    var fc = dueForecast(3);
    if (d1 >= start && isScheduled(d1)) {
      return { offDay: false, cards: fc[1].due };
    }
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d2 = addDays(t, 2);
    var p = d2.split("-").map(Number);
    return { offDay: true, nextName: names[new Date(p[0], p[1] - 1, p[2]).getDay()], cards: fc[2].due };
  }

  function mocks() { return state.mocks.slice(); }
  function recordMock(score, total) {
    state.mocks.push({ date: todayStr(), score: score, total: total, pct: Math.round((score / total) * 100) });
    markStudyDay(); snapshot(); save();
  }
  function gateStatus() {
    var g = STUDY_DATA.meta.booking_gate;
    var passing = state.mocks.filter(function (m) { return m.pct >= g.threshold; }).length;
    return { needed: g.exams_needed, threshold: g.threshold, passing: passing, cleared: passing >= g.exams_needed };
  }

  function readiness() {
    var dd = perDomain();
    var weightedMastery = dd.reduce(function (s, d) { return s + d.weight * d.mastery; }, 0);
    var touched = STUDY_DATA.domains.reduce(function (s, d) { return s + d.objectives_touched; }, 0);
    var totalObj = STUDY_DATA.domains.reduce(function (s, d) { return s + d.objectives_total; }, 0);
    var coverage = totalObj ? touched / totalObj : 0;
    var cc = cardCounts();
    var retention = cc.total ? cc.mature / cc.total : 0;
    var pace = paceFactor();
    var r = 0.50 * weightedMastery + 0.20 * coverage + 0.15 * retention + 0.15 * pace;
    return Math.max(0, Math.min(1, r));
  }
  function paceFactor() {
    var sc = STUDY_DATA.schedule;
    if (sc.planned_to_date > 0) return Math.max(0, Math.min(1, sc.completed_to_date / sc.planned_to_date));
    // No plan checkpoints reached yet: use course progress as a gentle proxy so
    // readiness reflects work actually done — never a false "on-pace" 15% floor.
    return Math.max(0, Math.min(1, (sc.watched || 0) / (sc.total_lectures || 102)));
  }
  function daysToExam() { return Math.max(0, daysBetween(todayStr(), STUDY_DATA.meta.exam_date)); }

  // ---- course-anchored metrics --------------------------------------------
  // An objective is MASTERED when >= 3 different questions tagged to it have
  // each been answered correctly on their latest attempt, and those latest
  // correct answers span >= 2 different days (knowledge, not a lucky night).
  // Definition approved by Joel 2026-08-01.
  function objectiveStats() {
    var byObj = {};
    CONTENT.questions.forEach(function (q) {
      if (!q.objective) return;
      if (!byObj[q.objective]) {
        byObj[q.objective] = { code: q.objective, domain: q.domain, questions: 0, attempted: 0, solid: 0, days: {} };
      }
      var o = byObj[q.objective];
      o.questions++;
      var la = lastAnswer(q.id);
      if (la) {
        o.attempted++;
        if (la.correct) { o.solid++; o.days[tsToDateStr(la.ts)] = true; }
      }
    });
    return Object.keys(byObj).map(function (k) {
      var o = byObj[k];
      o.mastered = o.solid >= 3 && Object.keys(o.days).length >= 2;
      return o;
    });
  }
  // mastered-objective counts, overall and per domain (of that domain's total)
  function objectiveProgress() {
    var perDom = {};
    STUDY_DATA.domains.forEach(function (d) {
      perDom[d.id] = { id: d.id, name: d.name, total: d.objectives_total, touched: d.objectives_touched, gaps: d.gaps, mastered: 0 };
    });
    var mastered = 0;
    objectiveStats().forEach(function (o) {
      if (o.mastered) { mastered++; if (perDom[o.domain]) perDom[o.domain].mastered++; }
    });
    var total = STUDY_DATA.domains.reduce(function (s, d) { return s + d.objectives_total; }, 0);
    return { mastered: mastered, total: total, domains: STUDY_DATA.domains.map(function (d) { return perDom[d.id]; }) };
  }
  // whole-course position: lectures watched + objectives mastered
  function courseProgress() {
    var sc = STUDY_DATA.schedule, op = objectiveProgress();
    return {
      lectures_watched: sc.watched || 0,
      lectures_total: sc.total_lectures || 0,
      objectives_mastered: op.mastered,
      objectives_total: op.total
    };
  }

  // ---- readiness history (for the trend display) --------------------------
  // One snapshot per study day, computed from real state at save time - never
  // hand-written. Upserted on every study action (answer, card review, mock).
  function snapshot() {
    var t = todayStr(), r = readiness();
    var last = state.snapshots[state.snapshots.length - 1];
    if (last && last.date === t) last.r = r;
    else state.snapshots.push({ date: t, r: r });
  }
  // current readiness vs ~a week ago: delta + sparkline points
  function readinessTrend() {
    var current = readiness();
    var cutoff = addDays(todayStr(), -7);
    var base = null;
    state.snapshots.forEach(function (s) { if (s.date <= cutoff) base = s; });
    if (!base && state.snapshots.length > 1) base = state.snapshots[0];
    return {
      current: current,
      delta: base ? current - base.r : 0,
      hasTrend: state.snapshots.length >= 2,
      points: state.snapshots.slice(-14)
    };
  }

  // ---- guide lab checklists -------------------------------------------------
  // Per-guide DO-item check state, keyed by item index. Raw interaction data
  // (like answers/cards) - reconciled to the .md sources via Export.
  function guideChecks(gid) { return state.guides[gid] || {}; }
  function toggleGuideCheck(gid, idx) {
    if (!state.guides[gid]) state.guides[gid] = {};
    state.guides[gid][idx] = !state.guides[gid][idx];
    save();
    return !!state.guides[gid][idx];
  }

  // ---- export / reset -----------------------------------------------------
  function exportJSON() {
    return JSON.stringify({ exported: todayStr(), state: state }, null, 2);
  }
  function reset() { state = seed(blank()); save(); }

  return {
    todayStr: todayStr, daysToExam: daysToExam,
    recordAnswer: recordAnswer, lastAnswer: lastAnswer, misses: misses,
    dueCards: dueCards, cardState: cardState, reviewCard: reviewCard, dueForecast: dueForecast,
    buildSession: buildSession, weakestDomain: weakestDomain,
    perDomain: perDomain, cardCounts: cardCounts, calibration: calibration,
    streak: streak, streakInfo: streakInfo, calendar: calendar,
    repairEligible: repairEligible, recordRepair: recordRepair,
    tonightQueue: tonightQueue, leeches: leeches, studyDaysWindow: studyDaysWindow,
    questsTonight: questsTonight, markLecture: markLecture, markGuide: markGuide, declineBonus: declineBonus,
    weekBar: weekBar, planWeeks: planWeeks, tomorrowPreview: tomorrowPreview,
    mocks: mocks, recordMock: recordMock, gateStatus: gateStatus,
    guideChecks: guideChecks, toggleGuideCheck: toggleGuideCheck,
    readiness: readiness, paceFactor: paceFactor,
    objectiveStats: objectiveStats, objectiveProgress: objectiveProgress,
    courseProgress: courseProgress, readinessTrend: readinessTrend,
    exportJSON: exportJSON, reset: reset
  };
})();
