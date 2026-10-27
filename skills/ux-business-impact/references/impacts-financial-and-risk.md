# Financial and Risk Impacts

The two categories that reach executives and finance without translation. Financial impacts move the P&L directly. Risk impacts reduce the likelihood or cost of bad outcomes — harder to prove, but the only category that gets funded on the strength of a near-miss.

Each entry gives: what it means, the metrics that evidence it, the skills most likely to produce it, and the caution that makes the claim fall apart under scrutiny.

---

## Financial Impacts (F1–F8)

### F1. Reduce Cost of Support
Fewer, shorter, or cheaper human support interactions because the experience or its content answers the question first.

**Metrics.** Contact rate per 1,000 active users; ticket volume by topic; average handle time; self-serve deflection rate; cost per contact (fully loaded, ask finance — it is usually far higher than teams assume).

**Produced by.** S12 Audit Content, S61 Create How-To Content, S37 Design Content for Usability, S54 Control Terminology, S63 Evaluate Design Solutions, S64 Identify and Report Issues.

**Caution.** Total ticket volume moves for reasons unrelated to design — seasonality, marketing pushes, a competitor outage. Always segment to the specific contact reason your work addressed. A 20% drop in one contact category is a stronger claim than a 4% drop overall.

---

### F2. Leverage Existing Investments
Getting more value from things the organisation has already paid for — components, content, research, platforms — instead of commissioning new ones.

**Metrics.** Component reuse rate; share of new work assembled from the system versus built bespoke; content reuse across channels; cost avoided against a rebuild estimate; research repository query volume.

**Produced by.** S90 Create a Design System, S95 Structure Content for Reuse, S89 Centralize Data and Insights, S94 Migrate User Experiences, S48 Create and Work with Taxonomies.

**Caution.** "Cost avoided" is the softest number in this whole taxonomy because the counterfactual is invented. Anchor it to a real quote or a real historical build cost, never to an estimate you produced yourself.

---

### F3. Increase Sales Volume
More units, subscriptions, renewals or upgrades sold.

**Metrics.** Conversion rate by funnel stage; trial-to-paid rate; renewal and expansion rate; average order value; cart or form abandonment.

**Produced by.** S39 Prototype a User Experience, S49 Design a Graphical User Interface, S38 Design Branded UX Content, S60 Write Marketing Copy, S18 Evaluate Value Propositions, S28 Establish a Personalization Strategy.

**Caution.** This is the most contested attribution in the book, because sales, pricing and marketing all claim it simultaneously. Either run a controlled test or claim contribution rather than causation. Do not claim the full revenue delta.

---

### F4. Reduce Cost of UX Work
The design and research function itself gets cheaper per unit of output.

**Metrics.** Designer hours per artefact; research cost per insight; time from brief to approved design; share of work using templates or system components; participant recruitment cost per session.

**Produced by.** S97 Establish Research Operations, S98 Establish Design Operations, S90 Create a Design System, S69 Know Your Toolset, S07 Describe Research Participants.

**Caution.** Easy to claim, easy to dismiss as self-serving. Strongest when paired with a maintained or improved quality measure — cheaper *and* not worse.

---

### F5. Reduce Cost of Maintenance
Less ongoing effort to keep the experience current, correct and working.

**Metrics.** Number of pages, components or content items under management; content update cycle time; defect backlog size and age; number of off-system patterns requiring bespoke fixes.

**Produced by.** S12 Audit Content, S95 Structure Content for Reuse, S53 Create Content Models, S90 Create a Design System, S96 Adopt and Use a CMS, S99 Establish Content Operations.

**Caution.** Deleting content reduces maintenance cost immediately and visibly. Resist stopping there — pair the volume reduction with a quality or findability measure, or the claim reads as vandalism with a spreadsheet.

---

### F6. Reduce Cost of Sales
The sales motion itself requires less human effort per deal.

**Metrics.** Sales cycle length; pre-sales and solution-engineering hours per deal; demo-to-close ratio; volume of sales-requested custom collateral; onboarding hours per new account.

**Produced by.** S39 Prototype a User Experience, S61 Create How-To Content, S33 Visualize Data, S21 Create a Service Design Blueprint, S38 Design Branded UX Content.

**Caution.** Requires sales-side data you probably do not own. Get the baseline from the sales ops team before starting, or the claim cannot be made afterwards at any strength.

---

### F7. Reduce Cost of Marketing
Lower spend to acquire the same or greater attention and demand.

**Metrics.** Customer acquisition cost; organic versus paid traffic mix; content production cost per asset; landing page conversion rate against spend.

**Produced by.** S59 Optimize for Organic Discovery, S60 Write Marketing Copy, S91 Design a Brand Voice, S92 Create a Style Guide, S38 Design Branded UX Content.

**Caution.** Marketing attribution models are contested inside marketing teams, let alone across the aisle. Use their model, whatever it is, rather than importing your own.

---

### F8. Reduce Cost of Production
Cheaper to build and ship the experience.

**Metrics.** Build hours per feature; rework rate after handoff; clarification requests per story; localisation cost per locale; QA defect count at first submission.

**Produced by.** S43 Prepare Design Handoffs, S51 Annotate Designs, S29 Define Requirements, S30 Write Data-Informed User Stories, S90 Create a Design System, S62 Localize and Translate Experiences.

**Caution.** Engineering owns these numbers and is entitled to be sceptical of a design team claiming them. Co-author the claim with an engineering lead or expect it to be challenged.

---

## Impacts to Risk (R1–R4)

Risk impacts are the hardest to evidence because success looks like nothing happening. Frame them as reduced exposure, not as disasters averted — the latter sounds like fiction.

### R1. Reduce Risk to Brand Perception
Fewer experiences that make people think less of the organisation.

**Metrics.** Negative sentiment volume and share; review score distribution; escalation count; social complaint volume by theme; frequency of experience-driven press mentions.

**Produced by.** S32 Anticipate Harm, S31 Design for Sensitive Topics, S02 Design the Research, S63 Evaluate Design Solutions, S91 Design a Brand Voice.

**Caution.** Sentiment moves on news cycles, not just design. Segment to experience-specific themes or the claim is noise.

---

### R2. Reduce Regulatory and Legal Risk
Lower exposure to accessibility complaints, privacy enforcement, consumer-protection claims and sector regulation.

**Metrics.** WCAG conformance level and open issue count by severity; accessibility complaint volume; consent-flow audit findings; dark-pattern audit findings; documented remediation timelines.

**Produced by.** S88 Embrace Accessibility, S32 Anticipate Harm, S55 Edit for Accuracy, S87 Establish a System for Governance, S31 Design for Sensitive Topics.

**Caution.** This is the one impact category where legal counsel outranks you. Never characterise legal exposure as resolved. Describe conformance state and remaining gaps; let counsel draw the risk conclusion.

---

### R3. Reduce Risk in Development
Less chance of building the wrong thing, or building it twice.

**Metrics.** Share of critical assumptions tested before build; post-launch rework rate; scope changes per release; features shipped then deprecated within 12 months; concept-test kill rate before commitment.

**Produced by.** S01 Map Assumptions, S42 Assess Product Concepts, S39 Prototype a User Experience, S15 Check Insights for Actionability, S29 Define Requirements.

**Caution.** The strongest form of this claim is a *kill* — work stopped before spend. Track killed concepts and their avoided build estimate; it is the most persuasive number a UX team can hold, and almost nobody records it.

---

### R4. Increase Business Viability
The business model itself becomes more likely to survive and sustain.

**Metrics.** Unit economics per customer; LTV to CAC ratio; runway impact of a decision; retention curve shape; confidence intervals on funded bets.

**Produced by.** S18 Evaluate Value Propositions, S16 Define Customer and User Types, S01 Map Assumptions, S84 Practice Strategic Foresight, S25 Create Product Roadmaps.

**Caution.** Only claimable when UX genuinely shaped a strategic decision, and usually only by someone in the room where it was made. Claiming it from a delivery seat reads as overreach and undermines the credible claims sitting next to it.
