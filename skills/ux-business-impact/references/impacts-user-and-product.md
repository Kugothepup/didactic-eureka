# User and Product Impacts

User impacts are where UX has the most direct causal claim and the least immediate executive interest. Product impacts are the bridge: they translate user change into terms product, marketing and growth teams already use.

The cascade almost always starts here. A user impact is rarely the end of a claim — it is the first link. See `translation-playbook.md` for how far to carry it.

---

## User Impacts (U1–U5)

### U1. Improve User Outcomes
The person accomplishes the real-world goal they came for — not the interface task, the actual goal behind it.

**Metrics.** Goal completion rate measured outside the interface (loan approved, dose taken correctly, lesson understood, refund received); end-to-end journey success including offline steps; rate of abandoned-then-resolved-elsewhere journeys.

**Produced by.** S09 Observe People in Their Context, S22 Create User Journeys, S21 Create a Service Design Blueprint, S63 Evaluate Design Solutions, S19 Create an Experience Vision.

**Caution.** The most commonly faked impact in the taxonomy, because teams substitute a UI task-success rate for a real outcome. "94% completed the form" is not U1. "94% received the benefit they applied for" is. If you cannot see past the screen, you are measuring something else — say so.

**Cascade.** U1 is the primary upstream node. It reliably drives F1, F3, P4 and P11.

---

### U2. Increase User Confidence
People act without hesitation because they trust what will happen next.

**Metrics.** Self-reported confidence before and after a task; back-navigation and undo rates within a flow; hover-and-abandon on commit actions; help-seeking mid-task; time spent on confirmation screens.

**Produced by.** S37 Design Content for Usability, S51 Annotate Designs, S46 Design Wayfinding Systems, S39 Prototype a User Experience, S40 Design for Conversation.

**Caution.** Confidence and competence dissociate. Users can be confidently wrong, and an interface can manufacture false confidence. Pair every confidence measure with an accuracy measure or the claim is unsafe.

---

### U3. Increase User Understanding
People correctly interpret what they are seeing, choosing or agreeing to.

**Metrics.** Comprehension test scores; rate of misinterpretation errors; information-seeking behaviour (search, help, re-reads); "what does this mean" support contacts; readability against the audience's actual reading level, not a generic target.

**Produced by.** S12 Audit Content, S54 Control Terminology, S37 Design Content for Usability, S61 Create How-To Content, S45 Guide Naming Processes, S33 Visualize Data.

**Caution.** Reduced information-seeking can mean people understand, or that they have given up. Always pair with a task or comprehension measure to tell the two apart.

---

### U4. Save User Time
Less time and effort to reach the same outcome.

**Metrics.** Time on task; steps or interactions to completion; GOMS/KLM predicted execution time; wait and system-response time; total journey duration including offline waits.

**Produced by.** S23 Map User Flows, S34 Design for Structure, S47 Create an Information Architecture, S49 Design a Graphical User Interface, S63 Evaluate Design Solutions.

**Caution.** Faster is not always better — speed on a consequential, irreversible action is a risk, not a win. And modelled time (GOMS) is a prediction, not a measurement; label it accordingly.

**Note.** This is the most directly monetisable user impact. Seconds saved, times frequency, times a loaded hourly rate, converts straight into F1, F6 or O8 for internal tools.

---

### U5. Increase User Satisfaction
People feel better about the experience.

**Metrics.** CSAT; SUS or UMUX-Lite; review scores and sentiment; NPS (with caveats); repeat voluntary use of an optional feature.

**Produced by.** S63 Evaluate Design Solutions, S38 Design Branded UX Content, S22 Create User Journeys, S31 Design for Sensitive Topics.

**Caution.** NPS is widely used and widely criticised — it is a single item with poor sensitivity, and it moves on brand and price as much as experience. Prefer SUS or UMUX-Lite for interface work. If the organisation runs on NPS, use it but report a second measure alongside.

---

## Product Impacts (P1–P11)

### P1. Increase Quality
The experience meets a higher standard of utility, correctness and craft.

**Metrics.** Severity-weighted defect count; heuristic evaluation scores; accessibility conformance; content accuracy audit results; user-reported issue rate per release.

**Produced by.** S63 Evaluate Design Solutions, S64 Identify and Report Issues, S12 Audit Content, S55 Edit for Accuracy, S83 Run Effective Design Critiques.

**Caution.** Quality requires cross-functional agreement on what "good" means before you measure it. Without an agreed standard, quality claims become taste arguments.

---

### P2. Increase Consistency of Experience
Visual, semantic and behavioural cues mean the same thing everywhere.

**Metrics.** Design system component adoption rate; count of off-system patterns; terminology variance across surfaces; interaction-pattern audit findings.

**Produced by.** S90 Create a Design System, S92 Create a Style Guide, S54 Control Terminology, S91 Design a Brand Voice, S87 Establish a System for Governance.

**Caution.** Strategic precisely because it is double-sided: it cuts cost through reuse (F2, F5, F8) *and* raises learnability (U3, U2). Claim both halves — teams routinely claim only the cost half and undersell the work.

---

### P3. Extract Insights to Inform Strategy
Research changes what the organisation decides, not just what it builds.

**Metrics.** Number of strategic decisions traceable to a research input; insight reuse across teams; repository query volume; time from question raised to evidence delivered.

**Produced by.** S14 Parse and Synthesize Data, S41 Distill Recommendations from Research, S89 Centralize Data and Insights, S67 Advocate for User Insights, S03 Establish a Program.

**Caution.** Traceability must be recorded at the time. Reconstructing "research influenced this" after the decision is unconvincing and usually contested by whoever made it.

---

### P4. Increase Adoption and Usage
More people use it, more of it, more often.

**Metrics.** Activation rate; feature adoption percentage; DAU/MAU or equivalent frequency ratio; depth of use; time to first value.

**Produced by.** S35 Sketch Low-Fidelity Designs, S39 Prototype a User Experience, S61 Create How-To Content, S28 Establish a Personalization Strategy, S65 Leverage Analytics.

**Caution.** Usage is not value. Increased time-in-product can signal engagement or confusion, and for a utility it is often a failure. State which reading applies before claiming it.

---

### P5. Achieve Product-Market Fit
The product matches a real, reachable market well enough to sustain and grow.

**Metrics.** Sean Ellis test ("how disappointed if this disappeared" — 40% "very" as the conventional threshold); retention curve flattening; organic share of acquisition; segment concentration of heavy users.

**Produced by.** S18 Evaluate Value Propositions, S16 Define Customer and User Types, S13 Investigate Comparable Experiences, S01 Map Assumptions, S17 Frame Opportunities.

**Caution.** A Stage 1 survival impact. Claiming it requires evidence across several signals — no single metric establishes fit, and the 40% threshold is a heuristic, not a law.

---

### P6. Defend Brand from Competition
Harder for a competitor to take your users.

**Metrics.** Churn to named competitors; competitive win/loss rate and stated reasons; switching intent in surveys; feature-parity gap closure.

**Produced by.** S13 Investigate Comparable Experiences, S75 Track Trends and Signals, S76 Watch the World, S06 Adapt Research in Progress, S84 Practice Strategic Foresight.

**Caution.** Win/loss reasons are self-reported by sales and skew toward price and features because those are easy to say. Triangulate with churn behaviour.

---

### P7. Increase Durability
The experience survives change — new content, new features, new platforms — without needing rebuilding.

**Metrics.** Time between major redesigns; component and schema lifespan; cost of adding a new content type or surface; breakage rate when scaling.

**Produced by.** S34 Design for Structure, S53 Create Content Models, S95 Structure Content for Reuse, S90 Create a Design System, S48 Create and Work with Taxonomies.

**Caution.** Only provable over years. In the short term, evidence it structurally — show that a new case was absorbed without redesign — rather than statistically.

---

### P8. Increase Brand Recognition
More people know who you are and recognise you on sight.

**Metrics.** Aided and unaided brand recall; branded search volume; visual identification tests; share of voice.

**Produced by.** S27 Establish Brand Identity, S91 Design a Brand Voice, S38 Design Branded UX Content, S92 Create a Style Guide.

**Caution.** Marketing owns this measurement. Contribute to it; do not claim it alone.

---

### P9. Increase Organic Awareness
People find and recommend you without paid acquisition.

**Metrics.** Organic traffic and its share of total; referral rate; word-of-mouth coefficient; unprompted mentions; share and invite rates.

**Produced by.** S59 Optimize for Organic Discovery, S61 Create How-To Content, S60 Write Marketing Copy, S44 Create a Content Strategy.

**Caution.** Search algorithm changes dominate organic traffic movement. Segment by query intent and check for platform-level shifts before claiming a design effect.

---

### P10. Expand Market and Potential Audience
The experience becomes usable by people it previously excluded.

**Metrics.** Adoption within a newly served segment; locale and language coverage; assistive-technology user share; device and bandwidth reach; reading-level accessibility of critical content.

**Produced by.** S88 Embrace Accessibility, S62 Localize and Translate Experiences, S93 Establish Processes for Localization, S16 Define Customer and User Types, S09 Observe People in Their Context.

**Caution.** The strongest commercial argument for accessibility work, and the one most often left unmade — teams argue accessibility on compliance (R2) alone and lose the growth case. Make both.

---

### P11. Increase User Loyalty
People come back and stay.

**Metrics.** Retention by cohort; churn rate; repeat purchase or usage frequency; lifetime value; voluntary re-subscription.

**Produced by.** S22 Create User Journeys, S28 Establish a Personalization Strategy, S31 Design for Sensitive Topics, S66 Cultivate Relationships, S63 Evaluate Design Solutions.

**Caution.** Retention lags design change by weeks or months and is confounded by pricing, contracts and switching costs. Use cohorts, never aggregates, and be explicit about the lag window.
