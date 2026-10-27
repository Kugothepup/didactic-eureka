#!/usr/bin/env python3
"""Interactive Inclusive Design Audit Scorer.

Walk through all 9 checklist items from the inclusion audit checklist,
score pass/fail/N-A, and generate remedies with Persona Spectrum analysis.

Usage:
    Interactive mode:  python3 inclusion_audit.py
    Export report:     python3 inclusion_audit.py --output report.md
"""

import argparse
import sys
from datetime import datetime

# Audit checklist items organized by category
CHECKLIST = {
    "Sensory Mismatches": [
        {
            "id": "vision",
            "label": "Vision",
            "question": "Is information conveyed by color alone?",
            "exclusion": "Colorblindness",
            "remedy": "Add icons, patterns, or text labels alongside color coding.",
            "persona_spectrum": {
                "permanent": "Color blindness (e.g., deuteranopia)",
                "temporary": "Screen glare, migraine aura",
                "situational": "Bright sunlight, low-contrast display",
            },
        },
        {
            "id": "hearing",
            "label": "Hearing",
            "question": "Is audio content captioned?",
            "exclusion": "Deaf / Situational Silence",
            "remedy": "Add captions or transcripts to all audio and video content.",
            "persona_spectrum": {
                "permanent": "Deaf or hard of hearing",
                "temporary": "Ear infection",
                "situational": "Noisy environment, library, sleeping baby nearby",
            },
        },
        {
            "id": "touch",
            "label": "Touch",
            "question": "Are touch targets at least 44px / 9mm?",
            "exclusion": "Tremors / Situational 'Fat Finger'",
            "remedy": "Increase target size to minimum 44x44px with adequate spacing.",
            "persona_spectrum": {
                "permanent": "Parkinson's disease, limited dexterity",
                "temporary": "Broken arm, bandaged hand",
                "situational": "Wearing gloves, holding a child",
            },
        },
    ],
    "Cognitive Exclusion": [
        {
            "id": "attention",
            "label": "Attention",
            "question": "Are there moving elements that cannot be paused?",
            "exclusion": "ADHD / Vestibular issues",
            "remedy": "Allow pausing, stopping, or hiding all animated/moving elements.",
            "persona_spectrum": {
                "permanent": "ADHD, vestibular disorder",
                "temporary": "Concussion, medication side effects",
                "situational": "Multitasking, stressful environment",
            },
        },
        {
            "id": "memory",
            "label": "Memory",
            "question": "Does the flow require remembering a code from a previous screen?",
            "exclusion": "Short-term memory loss / Stress",
            "remedy": "Keep relevant information visible or allow easy navigation back.",
            "persona_spectrum": {
                "permanent": "Cognitive impairment, traumatic brain injury",
                "temporary": "Sleep deprivation, grief",
                "situational": "Interrupted while completing task",
            },
        },
        {
            "id": "language",
            "label": "Language",
            "question": "Is the reading level above Grade 8?",
            "exclusion": "Cognitive impairment / Non-native speakers",
            "remedy": "Simplify language to Grade 8 or below. Use plain language principles.",
            "persona_spectrum": {
                "permanent": "Dyslexia, intellectual disability",
                "temporary": "Learning a new language",
                "situational": "Reading in a second language, time pressure",
            },
        },
    ],
    "Mental Health Impact": [
        {
            "id": "anxiety",
            "label": "Anxiety Trigger",
            "question": "Are there countdown timers or scarcity warnings?",
            "exclusion": "Anxiety disorders",
            "remedy": "Remove artificial urgency or allow time extensions.",
            "persona_spectrum": {
                "permanent": "Generalized anxiety disorder, PTSD",
                "temporary": "Period of high stress, life event",
                "situational": "Financial pressure, deadline stress",
            },
        },
        {
            "id": "control",
            "label": "Control",
            "question": "Is it easy to cancel/undo a subscription or critical action?",
            "exclusion": "Loss of autonomy",
            "remedy": "Add clear 'Undo' actions and easy cancellation paths.",
            "persona_spectrum": {
                "permanent": "OCD, anxiety about irreversible actions",
                "temporary": "Buyer's remorse",
                "situational": "Accidental click, changed mind",
            },
        },
        {
            "id": "safety",
            "label": "Safety",
            "question": "Can the user preserve their work if they need to step away abruptly?",
            "exclusion": "Data loss risk",
            "remedy": "Implement auto-save and recovery mechanisms.",
            "persona_spectrum": {
                "permanent": "Chronic illness requiring sudden breaks",
                "temporary": "Caring for a sick family member",
                "situational": "Phone call, doorbell, emergency",
            },
        },
    ],
}


def run_audit():
    """Interactive walkthrough of all checklist items."""
    print()
    print("  Inclusive Design Audit")
    print("  ======================")
    print("  Based on Holmes (Mismatch) and Microsoft Cognitive Guidebooks")
    print()
    print("  For each item, enter:")
    print("    p = Pass (no exclusion found)")
    print("    f = Fail (exclusion detected)")
    print("    n = Not Applicable")
    print()

    responses = []
    for category, items in CHECKLIST.items():
        print(f"  --- {category} ---")
        for item in items:
            print(f"\n  [{item['label']}] {item['question']}")
            print(f"    Excludes: {item['exclusion']}")
            while True:
                answer = input("    Result (p/f/n): ").strip().lower()
                if answer in ("p", "f", "n"):
                    break
                print("    Please enter p, f, or n.")
            notes = input("    Notes (optional): ").strip()
            responses.append({
                "category": category,
                "item": item,
                "result": answer,
                "notes": notes,
            })
    return responses


def score_results(responses):
    """Compute pass/fail per category."""
    categories = {}
    total_pass = 0
    total_fail = 0
    total_na = 0

    for r in responses:
        cat = r["category"]
        if cat not in categories:
            categories[cat] = {"pass": 0, "fail": 0, "na": 0}
        if r["result"] == "p":
            categories[cat]["pass"] += 1
            total_pass += 1
        elif r["result"] == "f":
            categories[cat]["fail"] += 1
            total_fail += 1
        else:
            categories[cat]["na"] += 1
            total_na += 1

    applicable = total_pass + total_fail
    score = total_pass
    max_score = applicable

    return {
        "categories": categories,
        "total_pass": total_pass,
        "total_fail": total_fail,
        "total_na": total_na,
        "score": score,
        "max_score": max_score,
    }


def generate_remedies(responses):
    """Map failures to recommendations with Persona Spectrum."""
    failures = [r for r in responses if r["result"] == "f"]
    remedies = []
    for f in failures:
        item = f["item"]
        remedies.append({
            "label": item["label"],
            "category": f["category"],
            "question": item["question"],
            "exclusion": item["exclusion"],
            "remedy": item["remedy"],
            "persona_spectrum": item["persona_spectrum"],
            "notes": f["notes"],
        })
    return remedies


def print_audit_report(responses):
    """Print formatted audit report to stdout."""
    scores = score_results(responses)
    remedies = generate_remedies(responses)

    print()
    print("  ==============================")
    print("  INCLUSIVE DESIGN AUDIT RESULTS")
    print("  ==============================")
    print()

    # Overall score
    print(f"  Overall Score: {scores['score']}/{scores['max_score']} passed", end="")
    if scores["total_na"] > 0:
        print(f" ({scores['total_na']} not applicable)", end="")
    print()
    print()

    # Per-category breakdown
    print("  Category Breakdown:")
    for cat, data in scores["categories"].items():
        status = "PASS" if data["fail"] == 0 else "ISSUES FOUND"
        print(f"    {cat}: {data['pass']}P / {data['fail']}F / {data['na']}N/A  [{status}]")
    print()

    # Detailed results
    print("  Detailed Results:")
    for r in responses:
        result_label = {"p": "PASS", "f": "FAIL", "n": "N/A"}[r["result"]]
        marker = {"p": "+", "f": "!", "n": "-"}[r["result"]]
        print(f"    [{marker}] {r['item']['label']}: {result_label}")
        if r["notes"]:
            print(f"        Note: {r['notes']}")
    print()

    # Exclusion points and remedies
    if remedies:
        print("  Exclusion Points & Remedies:")
        print(f"  {'-' * 50}")
        for rem in remedies:
            print(f"\n    {rem['label']} ({rem['category']})")
            print(f"    Issue: {rem['question']}")
            print(f"    Excludes: {rem['exclusion']}")
            print(f"    Remedy: {rem['remedy']}")
            print(f"    Persona Spectrum:")
            print(f"      Permanent:   {rem['persona_spectrum']['permanent']}")
            print(f"      Temporary:   {rem['persona_spectrum']['temporary']}")
            print(f"      Situational: {rem['persona_spectrum']['situational']}")
            if rem["notes"]:
                print(f"    Notes: {rem['notes']}")
        print()
    else:
        print("  No exclusion points found. All applicable items passed.")
        print()


def export_report(responses, path):
    """Write markdown report to file."""
    scores = score_results(responses)
    remedies = generate_remedies(responses)
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    lines = []
    lines.append("# Inclusive Design Audit Report")
    lines.append(f"*Generated: {now}*")
    lines.append("")
    lines.append(f"## Score: {scores['score']}/{scores['max_score']} passed")
    if scores["total_na"] > 0:
        lines.append(f"*{scores['total_na']} items marked as Not Applicable*")
    lines.append("")

    # Category breakdown
    lines.append("## Category Breakdown")
    lines.append("")
    lines.append("| Category | Pass | Fail | N/A | Status |")
    lines.append("|----------|------|------|-----|--------|")
    for cat, data in scores["categories"].items():
        status = "PASS" if data["fail"] == 0 else "ISSUES FOUND"
        lines.append(f"| {cat} | {data['pass']} | {data['fail']} | {data['na']} | {status} |")
    lines.append("")

    # Detailed results
    lines.append("## Detailed Results")
    lines.append("")
    for r in responses:
        result_label = {"p": "PASS", "f": "FAIL", "n": "N/A"}[r["result"]]
        marker = {"p": "[x]", "f": "[ ]", "n": "[-]"}[r["result"]]
        lines.append(f"- {marker} **{r['item']['label']}**: {result_label}")
        if r["notes"]:
            lines.append(f"  - Note: {r['notes']}")
    lines.append("")

    # Remedies
    if remedies:
        lines.append("## Exclusion Points & Remedies")
        lines.append("")
        for rem in remedies:
            lines.append(f"### {rem['label']} ({rem['category']})")
            lines.append(f"- **Issue:** {rem['question']}")
            lines.append(f"- **Excludes:** {rem['exclusion']}")
            lines.append(f"- **Remedy:** {rem['remedy']}")
            lines.append(f"- **Persona Spectrum:**")
            lines.append(f"  - Permanent: {rem['persona_spectrum']['permanent']}")
            lines.append(f"  - Temporary: {rem['persona_spectrum']['temporary']}")
            lines.append(f"  - Situational: {rem['persona_spectrum']['situational']}")
            if rem["notes"]:
                lines.append(f"- **Notes:** {rem['notes']}")
            lines.append("")

    with open(path, "w") as f:
        f.write("\n".join(lines))
    print(f"  Report exported to: {path}")


def main():
    parser = argparse.ArgumentParser(
        description="Interactive Inclusive Design Audit"
    )
    parser.add_argument(
        "--output", "-o", metavar="FILE",
        help="Export results as a markdown report"
    )
    args = parser.parse_args()

    responses = run_audit()
    print_audit_report(responses)

    if args.output:
        export_report(responses, args.output)


if __name__ == "__main__":
    main()
