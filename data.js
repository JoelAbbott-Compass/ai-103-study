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
    updated:     "2026-08-01",
    booking_gate:{ exams_needed: 2, threshold: 85 },
    // Source course. Hand-authored until the W4 ledger owns it. Title + URL
    // verified against christophernett.com/courses/ai-103 on 2026-08-01;
    // lecture count and length from study_schedule.md.
    course: {
      title:  "Azure AI Apps and Agents Developer (AI-103)",
      author: "Christopher Nett",
      platform: "Udemy",
      url:    "https://www.udemy.com/course/ai-103-azure-ai-apps-and-agents-developer-associate-c/",
      total_lectures: 102,
      length: "~13 hours"
    }
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
  // phases: the plan's shape for the milestone map. Week 1 starts study_start;
  // weeks run Mon-Sat. Labels/spans come from study_schedule.md headings.
  schedule: {
    total_lectures:102, watched:3, planned_to_date:0, completed_to_date:0,
    phases: [
      { label:"Learn the course",        from_week:1, to_week:5 },
      { label:"Fill gaps + first mocks", from_week:6, to_week:7 },
      { label:"Drill to 85%",            from_week:8, to_week:8 }
    ]
  }
};
