#!/usr/bin/env python3
"""Structured UX Research Plan Generator.

Generate research plans using the Detective Framework (Travis/Hodgson)
and Tinbergen's Four Questions.

Usage:
    Interactive mode:  python3 research_plan_generator.py
    Export to file:    python3 research_plan_generator.py --output plan.md
"""

import argparse
import sys
from datetime import datetime

# Tinbergen's Four Questions
TINBERGEN = {
    "function": {
        "label": "Function (Why?)",
        "description": "Ultimate cause / survival value. Why does this behavior exist?",
        "example_question": "Why do users need this feature? What problem does it solve?",
    },
    "mechanism": {
        "label": "Mechanism (What triggers it?)",
        "description": "Proximate trigger. What causes this behavior right now?",
        "example_question": "What triggers the user to perform this action? What cues do they respond to?",
    },
    "ontogeny": {
        "label": "Ontogeny (How was it learned?)",
        "description": "Developmental history. How did users learn this behavior?",
        "example_question": "How did users learn to do this? What mental models did they bring from elsewhere?",
    },
    "phylogeny": {
        "label": "Phylogeny (What's the legacy?)",
        "description": "Evolutionary history. Organizational or industry legacy shaping behavior.",
        "example_question": "What organizational or industry conventions shaped the current design?",
    },
}

# TEDW question starters
TEDW_STARTERS = {
    "T": "Tell me about",
    "E": "Explain how",
    "D": "Describe",
    "W": "Walk me through",
}

# Methodology options
METHODOLOGIES = {
    "safari": {
        "label": "Safari (Field Observation)",
        "description": "Observation in context. For Discovery.",
        "best_for": "Understanding natural behavior, discovering unmet needs",
        "locard": "Look for physical traces: sticky notes, workarounds, hacks, worn buttons.",
    },
    "zoo": {
        "label": "Zoo (Controlled Testing)",
        "description": "Controlled usability testing. For Validation.",
        "best_for": "Validating specific hypotheses, measuring task completion",
        "locard": "Every interaction leaves a trace in the data: clicks, hesitations, errors.",
    },
}


def gather_inputs():
    """Interactive prompts for research plan inputs."""
    print()
    print("  UX Research Plan Generator")
    print("  ==========================")
    print("  Based on the Detective Framework (Travis/Hodgson)")
    print("  and Tinbergen's Four Questions")
    print()

    # Primary research question
    research_question = input("  Primary research question:\n  > ").strip()
    if not research_question:
        research_question = "What are the key user needs and pain points?"
    print()

    # Project context
    project_name = input("  Project/product name (optional): ").strip() or "Untitled Project"
    print()

    # Tinbergen scope
    print("  Tinbergen's Four Questions — select which to investigate:")
    print("  (Enter letters separated by commas, or 'all')")
    for key, q in TINBERGEN.items():
        print(f"    [{key[0].upper()}] {q['label']}: {q['description']}")
    scope_input = input("  Scope (F/M/O/P or 'all'): ").strip().lower()
    if scope_input == "all":
        selected_tinbergen = list(TINBERGEN.keys())
    else:
        key_map = {"f": "function", "m": "mechanism", "o": "ontogeny", "p": "phylogeny"}
        selected_tinbergen = []
        for ch in scope_input.replace(",", "").replace(" ", ""):
            if ch in key_map:
                selected_tinbergen.append(key_map[ch])
    if not selected_tinbergen:
        selected_tinbergen = ["function"]
    print()

    # Methodology
    print("  Methodology:")
    print(f"    [S] {METHODOLOGIES['safari']['label']}: {METHODOLOGIES['safari']['best_for']}")
    print(f"    [Z] {METHODOLOGIES['zoo']['label']}: {METHODOLOGIES['zoo']['best_for']}")
    print(f"    [B] Both")
    method_input = input("  Method (S/Z/B): ").strip().lower()
    if method_input == "b":
        selected_methods = ["safari", "zoo"]
    elif method_input == "z":
        selected_methods = ["zoo"]
    else:
        selected_methods = ["safari"]
    print()

    # Evidence types
    print("  What types of evidence are you seeking? (comma-separated)")
    print("  Examples: behavioral observations, task completion rates, verbal feedback,")
    print("           error patterns, time-on-task, satisfaction scores, workarounds")
    evidence_input = input("  Evidence types: ").strip()
    evidence_types = [e.strip() for e in evidence_input.split(",") if e.strip()]
    if not evidence_types:
        evidence_types = ["behavioral observations", "verbal feedback"]
    print()

    # TEDW questions
    print("  How many TEDW interview questions to generate? (1-12, default 4)")
    try:
        num_tedw = int(input("  Number: ").strip())
        num_tedw = max(1, min(12, num_tedw))
    except ValueError:
        num_tedw = 4
    print()

    return {
        "research_question": research_question,
        "project_name": project_name,
        "tinbergen_scope": selected_tinbergen,
        "methods": selected_methods,
        "evidence_types": evidence_types,
        "num_tedw": num_tedw,
    }


def generate_tedw_questions(topic, num_questions=4):
    """Create TEDW interview questions for the given topic."""
    templates = [
        ("T", f"Tell me about the last time you {topic.lower()}."),
        ("E", f"Explain how you currently handle {topic.lower()}."),
        ("D", f"Describe what happens when {topic.lower()} goes wrong."),
        ("W", f"Walk me through your typical process for {topic.lower()}."),
        ("T", f"Tell me about a time when {topic.lower()} was frustrating."),
        ("E", f"Explain how you learned to {topic.lower()}."),
        ("D", f"Describe what an ideal experience with {topic.lower()} would look like."),
        ("W", f"Walk me through how you decide when to {topic.lower()}."),
        ("T", f"Tell me about any workarounds you use for {topic.lower()}."),
        ("E", f"Explain how {topic.lower()} fits into your larger workflow."),
        ("D", f"Describe the biggest challenge you face with {topic.lower()}."),
        ("W", f"Walk me through what you do before and after {topic.lower()}."),
    ]
    return templates[:num_questions]


def build_plan(inputs):
    """Assemble structured research plan."""
    now = datetime.now().strftime("%Y-%m-%d")
    lines = []

    lines.append(f"# UX Research Plan: {inputs['project_name']}")
    lines.append(f"*Generated: {now}*")
    lines.append("")

    # Research question
    lines.append("## Primary Research Question")
    lines.append(f"> {inputs['research_question']}")
    lines.append("")

    # Tinbergen scope
    lines.append("## Tinbergen's Four Questions — Scope")
    lines.append("")
    for key in inputs["tinbergen_scope"]:
        q = TINBERGEN[key]
        lines.append(f"### {q['label']}")
        lines.append(f"*{q['description']}*")
        lines.append(f"- Key question: {q['example_question']}")
        lines.append("")

    # Methodology
    lines.append("## Methodology")
    lines.append("")
    for method_key in inputs["methods"]:
        method = METHODOLOGIES[method_key]
        lines.append(f"### {method['label']}")
        lines.append(f"- **Description:** {method['description']}")
        lines.append(f"- **Best for:** {method['best_for']}")
        lines.append(f"- **Locard's Principle:** {method['locard']}")
        lines.append("")

    # Evidence types
    lines.append("## Evidence Types Sought")
    lines.append("")
    for ev in inputs["evidence_types"]:
        lines.append(f"- {ev}")
    lines.append("")

    # TEDW interview questions
    topic = inputs["research_question"]
    tedw_questions = generate_tedw_questions(topic, inputs["num_tedw"])
    lines.append("## Interview Questions (TEDW Framework)")
    lines.append("*Never ask Yes/No questions. Use commands to elicit stories.*")
    lines.append("")
    for i, (letter, question) in enumerate(tedw_questions, 1):
        starter = TEDW_STARTERS[letter]
        lines.append(f"{i}. **[{letter}]** {question}")
    lines.append("")

    # Participants
    lines.append("## Participants")
    lines.append("")
    lines.append("| # | Role/Segment | Recruit Criteria | Status |")
    lines.append("|---|-------------|-----------------|--------|")
    for i in range(1, 6):
        lines.append(f"| {i} | _TBD_ | _TBD_ | Pending |")
    lines.append("")

    # Timeline
    lines.append("## Research Activities")
    lines.append("")
    lines.append("| Phase | Activity | Deliverable |")
    lines.append("|-------|----------|-------------|")
    lines.append("| 1. Plan | Define questions & recruit | This document |")
    lines.append("| 2. Collect | Conduct sessions | Raw notes & recordings |")
    lines.append("| 3. Analyze | Code & synthesize findings | Affinity map |")
    lines.append("| 4. Report | Present insights & recommendations | Research report |")
    lines.append("")

    # Locard reminder
    lines.append("---")
    lines.append("*Locard's Exchange Principle: \"Every contact leaves a trace.\"*")
    lines.append("*Look for physical wear, sticky notes, hacks, and workarounds to find unmet needs.*")

    return "\n".join(lines)


def export_plan(plan, path):
    """Write markdown output to file."""
    with open(path, "w") as f:
        f.write(plan)
    print(f"  Research plan exported to: {path}")


def main():
    parser = argparse.ArgumentParser(
        description="Structured UX Research Plan Generator"
    )
    parser.add_argument(
        "--output", "-o", metavar="FILE",
        help="Export plan as a markdown file"
    )
    args = parser.parse_args()

    inputs = gather_inputs()
    plan = build_plan(inputs)

    print()
    print(plan)
    print()

    if args.output:
        export_plan(plan, args.output)


if __name__ == "__main__":
    main()
