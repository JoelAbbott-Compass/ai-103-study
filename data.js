/* ============================================================================
   AI-103 STUDY APP — CONFIG + COVERAGE FACTS  (window.STUDY_DATA)
   ----------------------------------------------------------------------------
   Raw facts only. Claude updates this at the close of each session:
   exam date, domain weights, objectives_touched, gaps, coverage, schedule.
   Live study metrics (attempts, cards, streak, readiness) are computed by
   store.js from Joel's browser progress — never hand-written here.
   ========================================================================== */

window.STUDY_DATA = {
  meta: {
    exam_date:   "2026-09-28",
    study_start: "2026-08-03",
    learner:     "Joel",
    updated:     "2026-07-31",
    booking_gate:{ exams_needed: 2, threshold: 85 }
  },

  // Domain weights sum to 1.00. objectives_touched/gaps come from coverage_map.md.
  domains: [
    { id:"D1", name:"Plan & manage Azure AI", weight:0.28, objectives_total:16, objectives_touched:3, gaps:1 },
    { id:"D2", name:"Generative AI & agents", weight:0.33, objectives_total:16, objectives_touched:0, gaps:0 },
    { id:"D3", name:"Computer vision",        weight:0.13, objectives_total:16, objectives_touched:0, gaps:10 },
    { id:"D4", name:"Text analysis",          weight:0.13, objectives_total:8,  objectives_touched:0, gaps:0 },
    { id:"D5", name:"Information extraction",  weight:0.13, objectives_total:8,  objectives_touched:0, gaps:2 }
  ],

  // Pace vs plan (from study_schedule.md). Before study_start, pace is neutral.
  schedule: { total_lectures:102, watched:3, planned_to_date:0, completed_to_date:0 }
};
