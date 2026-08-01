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
    return { answers: {}, cards: {}, mocks: [], studyDays: [], guides: {}, snapshots: [] };
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
    var cards = dueCards();

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
    return { cards: cards, questions: questions, weakest: weakest };
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
  function streak() {
    if (!state.studyDays.length) return 0;
    var t = todayStr(), n = 0, cursor = t;
    // streak counts back from today (or yesterday if not studied yet today)
    if (state.studyDays.indexOf(t) === -1) cursor = addDays(t, -1);
    while (state.studyDays.indexOf(cursor) !== -1) { n++; cursor = addDays(cursor, -1); }
    return n;
  }
  function studyDaysWindow(days) {
    var out = [], t = todayStr();
    for (var i = days - 1; i >= 0; i--) {
      var d = addDays(t, -i);
      out.push({ date: d, studied: state.studyDays.indexOf(d) !== -1 });
    }
    return out;
  }
  // next N days of card reviews (anything already due counts as today)
  function dueForecast(days) {
    var t = todayStr(), counts = {};
    CONTENT.cards.forEach(function (c) {
      var s = state.cards[c.id];
      var d = (!s || s.nextReview <= t) ? t : s.nextReview;
      counts[d] = (counts[d] || 0) + 1;
    });
    var names = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var out = [];
    for (var i = 0; i < days; i++) {
      var d = addDays(t, i);
      var p = d.split("-").map(Number);
      var label = i === 0 ? "Today" : names[new Date(p[0], p[1] - 1, p[2]).getDay()];
      out.push({ date: d, label: label, due: counts[d] || 0 });
    }
    return out;
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
    streak: streak, studyDaysWindow: studyDaysWindow,
    mocks: mocks, recordMock: recordMock, gateStatus: gateStatus,
    guideChecks: guideChecks, toggleGuideCheck: toggleGuideCheck,
    readiness: readiness, paceFactor: paceFactor,
    objectiveStats: objectiveStats, objectiveProgress: objectiveProgress,
    courseProgress: courseProgress, readinessTrend: readinessTrend,
    exportJSON: exportJSON, reset: reset
  };
})();
