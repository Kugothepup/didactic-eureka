#!/usr/bin/env python3
"""KLM-GOMS Task Efficiency Calculator.

Calculate expert task execution time using Keystroke-Level Model operators.
Uses standard operator times from Card, Moran & Newell.

Usage:
    Interactive mode:  python3 goms_calculator.py
    JSON file mode:    python3 goms_calculator.py --json steps.json
"""

import argparse
import json
import math
import sys

# Standard KLM operator times (seconds)
OPERATORS = {
    "K": {"name": "Keystroke", "expert": 0.20, "average": 0.28},
    "P": {"name": "Pointing", "expert": 1.10, "average": 1.10},
    "H": {"name": "Homing", "expert": 0.40, "average": 0.40},
    "M": {"name": "Mental", "expert": 1.20, "average": 1.20},
    "R": {"name": "Response", "expert": None, "average": None},
}

VALID_OPERATORS = set(OPERATORS.keys())


def add_step(steps, description, operator, custom_time=None):
    """Add a step to the task sequence."""
    operator = operator.upper()
    if operator not in VALID_OPERATORS:
        print(f"  Warning: Unknown operator '{operator}'. Valid: {', '.join(sorted(VALID_OPERATORS))}")
        return
    if operator == "R" and custom_time is None:
        print("  Operator R (Response) requires a custom time. Skipping.")
        return
    time_val = custom_time if custom_time is not None else OPERATORS[operator]["expert"]
    steps.append({
        "description": description,
        "operator": operator,
        "code": operator,
        "time": time_val,
    })


def calculate_total(steps):
    """Sum all operator times."""
    return sum(s["time"] for s in steps)


def suggest_optimizations(steps):
    """Heuristic analysis for optimization opportunities."""
    suggestions = []

    # Flag M operators as biggest optimization targets
    m_indices = [i for i, s in enumerate(steps) if s["operator"] == "M"]
    for idx in m_indices:
        desc = steps[idx]["description"]
        suggestions.append(
            f"  Step {idx + 1} '{desc}' is a Mental operator (1.20s). "
            f"Can you reduce cognitive load here? (e.g., better labels, visual distinction)"
        )

    # Detect sequential H+P+K patterns (hotkey replacement candidates)
    for i in range(len(steps) - 2):
        ops = [steps[i]["operator"], steps[i + 1]["operator"], steps[i + 2]["operator"]]
        if ops == ["H", "P", "K"]:
            total_hpk = steps[i]["time"] + steps[i + 1]["time"] + steps[i + 2]["time"]
            hotkey_time = OPERATORS["K"]["expert"] + OPERATORS["M"]["expert"]  # M + K for hotkey
            savings = total_hpk - hotkey_time
            suggestions.append(
                f"  Steps {i + 1}-{i + 3} form an H+P+K sequence ({total_hpk:.2f}s). "
                f"A keyboard shortcut could replace this with M+K ({hotkey_time:.2f}s), "
                f"saving {savings:.2f}s."
            )

    return suggestions


def print_report(steps, task_name="Unnamed Task"):
    """Print formatted table output."""
    if not steps:
        print("No steps recorded.")
        return

    total = calculate_total(steps)

    # Header
    print()
    print(f"  KLM-GOMS Analysis: {task_name}")
    print(f"  {'=' * 70}")
    print(f"  {'#':<4} {'Description':<30} {'Operator':<12} {'Code':<6} {'Time (s)':<10}")
    print(f"  {'-' * 4} {'-' * 30} {'-' * 12} {'-' * 6} {'-' * 10}")

    for i, step in enumerate(steps, 1):
        op_name = OPERATORS[step["operator"]]["name"]
        print(f"  {i:<4} {step['description']:<30} {op_name:<12} {step['code']:<6} {step['time']:<10.2f}")

    print(f"  {'-' * 4} {'-' * 30} {'-' * 12} {'-' * 6} {'-' * 10}")
    print(f"  {'':4} {'TOTAL':<30} {'':12} {'':6} {total:<10.2f}")
    print()

    # Operator breakdown
    op_counts = {}
    op_times = {}
    for s in steps:
        op = s["operator"]
        op_counts[op] = op_counts.get(op, 0) + 1
        op_times[op] = op_times.get(op, 0.0) + s["time"]

    print("  Operator Breakdown:")
    for op in sorted(op_counts.keys()):
        name = OPERATORS[op]["name"]
        pct = (op_times[op] / total * 100) if total > 0 else 0
        print(f"    {op} ({name}): {op_counts[op]}x = {op_times[op]:.2f}s ({pct:.0f}%)")
    print()

    # Optimizations
    suggestions = suggest_optimizations(steps)
    if suggestions:
        print("  Optimization Opportunities:")
        for s in suggestions:
            print(s)
        print()


def load_from_json(path):
    """Load steps from a JSON file.

    Expected format:
    {
        "task_name": "Delete a file",
        "steps": [
            {"description": "Hand to Mouse", "operator": "H"},
            {"description": "Move to File Icon", "operator": "P"},
            {"description": "System Wait", "operator": "R", "time": 0.5}
        ]
    }
    """
    with open(path, "r") as f:
        data = json.load(f)
    task_name = data.get("task_name", "Unnamed Task")
    steps = []
    for entry in data.get("steps", []):
        add_step(steps, entry["description"], entry["operator"], entry.get("time"))
    return task_name, steps


def interactive_mode():
    """Run interactive step-by-step input."""
    print()
    print("  KLM-GOMS Efficiency Calculator")
    print("  ================================")
    print()
    task_name = input("  Task name: ").strip() or "Unnamed Task"
    print()
    print("  Available operators:")
    for code, info in OPERATORS.items():
        time_str = f"{info['expert']:.2f}s" if info["expert"] is not None else "variable"
        print(f"    {code} = {info['name']} ({time_str})")
    print()
    print("  Enter steps one at a time. Type 'done' to finish.")
    print()

    steps = []
    step_num = 1
    while True:
        desc = input(f"  Step {step_num} description (or 'done'): ").strip()
        if desc.lower() == "done":
            break
        op = input(f"  Step {step_num} operator ({'/'.join(sorted(VALID_OPERATORS))}): ").strip().upper()
        custom_time = None
        if op == "R":
            try:
                custom_time = float(input("  Response time (seconds): ").strip())
            except ValueError:
                print("  Invalid time. Skipping step.")
                continue
        add_step(steps, desc, op, custom_time)
        step_num += 1

    print_report(steps, task_name)


def main():
    parser = argparse.ArgumentParser(
        description="KLM-GOMS Task Efficiency Calculator"
    )
    parser.add_argument(
        "--json", metavar="FILE",
        help="Path to a JSON file with pre-defined steps"
    )
    args = parser.parse_args()

    if args.json:
        task_name, steps = load_from_json(args.json)
        print_report(steps, task_name)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
