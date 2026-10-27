#!/usr/bin/env python3
"""Heuristic Dark Pattern Analysis Tool.

Analyze UI descriptions for potential dark patterns, sludge, or ethical nudges.
Based on the ethics framework in persuasion_mechanics.md.

Usage:
    Interactive mode:  python3 dark_pattern_detector.py
    Argument mode:     python3 dark_pattern_detector.py --text "Only 2 left! Buy now before it's gone!"
"""

import argparse
import re
import sys

# Pattern definitions: keyword signals mapped to categories
PATTERN_DEFINITIONS = {
    "dark_pattern": {
        "name": "Dark Pattern (Black Hat)",
        "description": "Deception. Tricks user into an action they did not intend.",
        "risk": "HIGH",
        "signals": [
            ("added to cart", "Sneaking items into the user's cart without consent"),
            ("pre-selected", "Pre-checking options the user didn't choose"),
            ("pre-checked", "Pre-checking options the user didn't choose"),
            ("hidden fee", "Concealing costs until late in the process"),
            ("hidden cost", "Concealing costs until late in the process"),
            ("confusing", "Deliberately confusing UI to misdirect"),
            ("opt-out buried", "Making opt-out difficult to find"),
            ("hard to unsubscribe", "Obstructing unsubscription"),
            ("trick", "Deceptive design language"),
            ("misdirect", "Diverting attention from important information"),
            ("forced continuity", "Auto-renewing without clear notice"),
            ("bait and switch", "Advertising one thing, delivering another"),
            ("confirm shaming", "Using guilt to pressure a decision"),
            ("shame", "Using guilt-trip language for opt-out"),
            ("disguised ad", "Ads designed to look like content or navigation"),
        ],
    },
    "sludge": {
        "name": "Sludge (Gray Hat)",
        "description": "High friction to prevent an action the user wants to take.",
        "risk": "MEDIUM",
        "signals": [
            ("multiple steps to cancel", "Excessive steps to complete cancellation"),
            ("hard to find", "Important controls buried or hidden"),
            ("call to cancel", "Requiring phone call to cancel a digital service"),
            ("friction", "Unnecessary friction added to a process"),
            ("complicated process", "Over-complicating simple actions"),
            ("difficult to cancel", "Making cancellation unreasonably hard"),
            ("roach motel", "Easy to get in, hard to get out"),
            ("can't delete account", "Preventing or obstructing account deletion"),
            ("require phone", "Forcing channel switch to complete action"),
            ("maze", "Sending users through unnecessary navigation"),
        ],
    },
    "scarcity": {
        "name": "Scarcity / FOMO",
        "description": "Fear of Missing Out. Ethical only if the scarcity is real.",
        "risk": "MEDIUM",
        "signals": [
            ("only \\d+ left", "Displaying low stock count"),
            ("limited time", "Time-limited availability"),
            ("countdown", "Countdown timer creating urgency"),
            ("hurry", "Urgency language"),
            ("act now", "Urgency language"),
            ("act fast", "Urgency language"),
            ("selling fast", "Implying rapid depletion"),
            ("almost gone", "Scarcity signal"),
            ("while supplies last", "Scarcity signal"),
            ("expires", "Time pressure"),
            ("deal ends", "Time-limited offer"),
        ],
    },
    "anchoring": {
        "name": "Anchoring",
        "description": "First number seen sets baseline value. Ethical if prices are real.",
        "risk": "LOW",
        "signals": [
            ("was \\$\\d+", "Showing original higher price"),
            ("crossed out", "Visually crossing out a higher price"),
            ("original price", "Referencing a higher original price"),
            ("save \\d+%", "Percentage savings claim"),
            ("compare at", "Comparison pricing"),
            ("retail value", "Anchoring to retail/MSRP"),
            ("msrp", "Manufacturer's suggested retail price anchor"),
            ("\\$\\d+.*\\$\\d+", "Multiple price points shown together"),
        ],
    },
    "social_proof": {
        "name": "Social Proof",
        "description": "Others are doing it. Ethical if numbers are real.",
        "risk": "LOW",
        "signals": [
            ("\\d+ people", "Showing number of people who took action"),
            ("most popular", "Labeling an option as most popular"),
            ("trending", "Marking as trending"),
            ("best seller", "Labeling as best-selling"),
            ("bestseller", "Labeling as best-selling"),
            ("others are viewing", "Showing other viewers"),
            ("recently purchased", "Showing recent purchases"),
            ("\\d+ reviews", "Review count display"),
            ("join \\d+", "Showing total users/subscribers"),
            ("as seen on", "Third-party endorsement"),
        ],
    },
    "loss_aversion": {
        "name": "Loss Aversion",
        "description": "Framing as avoiding loss rather than gaining benefit.",
        "risk": "LOW",
        "signals": [
            ("don't lose", "Loss framing"),
            ("miss out", "Fear of missing out"),
            ("expire", "Implying something will be lost"),
            ("last chance", "Final opportunity framing"),
            ("don't miss", "Loss framing"),
            ("lose your", "Direct loss language"),
            ("running out", "Depletion language"),
            ("before it's gone", "Loss framing"),
            ("won't be available", "Future unavailability"),
            ("risk losing", "Explicit loss risk"),
        ],
    },
}


def detect_patterns(text):
    """Run keyword/phrase matching against all pattern categories."""
    text_lower = text.lower()
    findings = []

    for category_key, category in PATTERN_DEFINITIONS.items():
        for signal, explanation in category["signals"]:
            if re.search(signal, text_lower):
                findings.append({
                    "category": category_key,
                    "name": category["name"],
                    "risk": category["risk"],
                    "signal": signal,
                    "explanation": explanation,
                    "description": category["description"],
                })

    return findings


def classify_pattern(pattern):
    """Classify pattern as white/gray/black hat with recommendation."""
    category = pattern["category"]

    if category == "dark_pattern":
        return {
            "hat": "BLACK HAT",
            "recommendation": (
                "This is a deceptive pattern. Remove or redesign. "
                "Ask: 'If the user knew how we designed this, would they feel manipulated?'"
            ),
        }
    elif category == "sludge":
        return {
            "hat": "GRAY HAT",
            "recommendation": (
                "This creates unnecessary friction. Simplify the process. "
                "Users should be able to leave as easily as they arrived."
            ),
        }
    elif category == "scarcity":
        return {
            "hat": "GRAY HAT",
            "recommendation": (
                "Acceptable ONLY if the scarcity is genuine. "
                "Artificial scarcity destroys trust. Verify the data is real."
            ),
        }
    elif category == "anchoring":
        return {
            "hat": "WHITE HAT (if truthful)",
            "recommendation": (
                "Anchoring is ethical when prices are real and not inflated. "
                "Verify the 'original' price was actually charged."
            ),
        }
    elif category == "social_proof":
        return {
            "hat": "WHITE HAT (if truthful)",
            "recommendation": (
                "Social proof is ethical when numbers are accurate and current. "
                "Never fabricate or inflate social proof numbers."
            ),
        }
    elif category == "loss_aversion":
        return {
            "hat": "WHITE HAT (if aligned with user goals)",
            "recommendation": (
                "Loss framing is ethical when it aligns with the user's own goals "
                "(e.g., 'Don't lose your progress'). Manipulative when creating false urgency."
            ),
        }
    return {"hat": "UNKNOWN", "recommendation": "Review manually."}


def analyze(description):
    """Run all heuristic checks on a UI description."""
    findings = detect_patterns(description)
    results = []
    for f in findings:
        classification = classify_pattern(f)
        results.append({**f, **classification})
    return results


def generate_report(findings, description):
    """Print formatted output with recommendations."""
    print()
    print("  Dark Pattern Analysis")
    print(f"  {'=' * 60}")
    print()
    print(f"  Input: \"{description[:80]}{'...' if len(description) > 80 else ''}\"")
    print()

    if not findings:
        print("  No concerning patterns detected.")
        print()
        print("  Note: This tool uses keyword heuristics and may miss patterns")
        print("  expressed in unusual ways. Manual review is always recommended.")
        print()
        return

    print(f"  Found {len(findings)} pattern signal(s):")
    print()

    # Group by category
    seen_categories = {}
    for f in findings:
        cat = f["category"]
        if cat not in seen_categories:
            seen_categories[cat] = []
        seen_categories[cat].append(f)

    for cat, items in seen_categories.items():
        first = items[0]
        risk_marker = {"HIGH": "!!!", "MEDIUM": "!!", "LOW": "!"}[first["risk"]]
        print(f"  {risk_marker} {first['name']} [{first['risk']} RISK]")
        print(f"     {first['description']}")
        print(f"     Classification: {first['hat']}")
        print()
        for item in items:
            print(f"     - Signal: \"{item['signal']}\"")
            print(f"       {item['explanation']}")
        print()
        print(f"     Recommendation: {first['recommendation']}")
        print()

    # Audit question
    print(f"  {'-' * 60}")
    print("  Ethics Audit Question (Thaler & Sunstein):")
    print("  \"If the user knew exactly how we designed this,")
    print("   would they feel helped or manipulated?\"")
    print()


def interactive_mode():
    """Run interactive analysis mode."""
    print()
    print("  Dark Pattern Detector")
    print("  =====================")
    print("  Describe a UI element or flow, and this tool will scan")
    print("  for potential dark patterns, sludge, and ethical concerns.")
    print()
    print("  Type 'quit' to exit.")
    print()

    while True:
        print(f"  {'-' * 40}")
        description = input("  Describe the UI: ").strip()
        if description.lower() == "quit":
            break
        if not description:
            print("  Please enter a description.")
            continue
        findings = analyze(description)
        generate_report(findings, description)


def main():
    parser = argparse.ArgumentParser(
        description="Heuristic Dark Pattern Detector"
    )
    parser.add_argument(
        "--text", "-t",
        help="UI description to analyze"
    )
    args = parser.parse_args()

    if args.text:
        findings = analyze(args.text)
        generate_report(findings, args.text)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
