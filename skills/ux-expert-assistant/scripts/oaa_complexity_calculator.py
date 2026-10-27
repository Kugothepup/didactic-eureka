#!/usr/bin/env python3
"""Object-Action-Attribute Complexity Calculator.

Calculate design complexity from Objects, Actions, and Attributes.
Formula: (Objects x Actions) + Unique Attribute States

Usage:
    Interactive mode:  python3 oaa_complexity_calculator.py
    CSV file mode:     python3 oaa_complexity_calculator.py --csv assets/oaa_matrix.csv
"""

import argparse
import csv
import sys


def load_from_csv(path):
    """Parse OAA matrix CSV into structured objects.

    Expected columns: Object (Noun), Attribute (Adjective/State), Action (Verb),
                      Cardinality, Priority, Visualization Hint
    """
    objects = {}
    with open(path, "r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            obj_name = row.get("Object (Noun)", "").strip().strip('"')
            action = row.get("Action (Verb)", "").strip().strip('"')
            attribute = row.get("Attribute (Adjective/State)", "").strip().strip('"')
            priority = row.get("Priority", "").strip().strip('"')
            viz = row.get("Visualization Hint", "").strip().strip('"')

            if obj_name not in objects:
                objects[obj_name] = {"actions": set(), "attributes": set(), "rows": []}
            if action:
                objects[obj_name]["actions"].add(action)
            if attribute:
                # Count individual states within an attribute (e.g., "Status: Draft/Paid" = 2 states)
                states = _parse_attribute_states(attribute)
                for state in states:
                    objects[obj_name]["attributes"].add(state)
            objects[obj_name]["rows"].append({
                "action": action,
                "attribute": attribute,
                "priority": priority,
                "visualization": viz,
            })
    return objects


def _parse_attribute_states(attribute):
    """Parse attribute string into individual states.

    "Status: Draft/Paid" -> ["Status: Draft", "Status: Paid"]
    "Date Due" -> ["Date Due"]
    """
    if ":" in attribute:
        prefix, values = attribute.split(":", 1)
        prefix = prefix.strip()
        parts = [v.strip() for v in values.split("/")]
        return [f"{prefix}: {p}" for p in parts]
    return [attribute]


def calculate_complexity(objects):
    """Calculate complexity score: (Objects x Actions) + Unique Attribute States."""
    num_objects = len(objects)
    all_actions = set()
    all_attributes = set()

    for obj_name, obj_data in objects.items():
        all_actions.update(obj_data["actions"])
        all_attributes.update(obj_data["attributes"])

    num_unique_actions = len(all_actions)
    num_unique_attributes = len(all_attributes)

    interaction_complexity = num_objects * num_unique_actions
    total_complexity = interaction_complexity + num_unique_attributes

    return {
        "num_objects": num_objects,
        "num_actions": num_unique_actions,
        "num_attributes": num_unique_attributes,
        "interaction_complexity": interaction_complexity,
        "total_complexity": total_complexity,
        "all_actions": sorted(all_actions),
        "all_attributes": sorted(all_attributes),
    }


def find_polymorphic_actions(objects):
    """Identify actions shared across multiple objects (reduction opportunities)."""
    action_to_objects = {}
    for obj_name, obj_data in objects.items():
        for action in obj_data["actions"]:
            if action not in action_to_objects:
                action_to_objects[action] = []
            action_to_objects[action].append(obj_name)

    polymorphic = {
        action: objs for action, objs in action_to_objects.items() if len(objs) > 1
    }
    return polymorphic


def suggest_reductions(objects):
    """Output simplification opportunities."""
    suggestions = []
    poly = find_polymorphic_actions(objects)

    if poly:
        for action, objs in poly.items():
            suggestions.append(
                f"  '{action}' is used across {len(objs)} objects ({', '.join(objs)}). "
                f"Consider a unified '{action}' pattern/component to reduce learning cost."
            )

    # Check for objects with many actions
    for obj_name, obj_data in objects.items():
        num_actions = len(obj_data["actions"])
        if num_actions > 5:
            suggestions.append(
                f"  '{obj_name}' has {num_actions} actions. Consider progressive disclosure "
                f"or grouping related actions."
            )

    # Check for objects with many attribute states
    for obj_name, obj_data in objects.items():
        num_attrs = len(obj_data["attributes"])
        if num_attrs > 4:
            suggestions.append(
                f"  '{obj_name}' has {num_attrs} attribute states. Consider reducing visible "
                f"states or using filters."
            )

    return suggestions


def print_report(objects):
    """Print formatted complexity report."""
    if not objects:
        print("  No objects loaded.")
        return

    complexity = calculate_complexity(objects)

    print()
    print("  OAA Complexity Analysis")
    print(f"  {'=' * 60}")
    print()

    # Per-object breakdown
    print(f"  {'Object':<20} {'Actions':<10} {'Attributes':<12}")
    print(f"  {'-' * 20} {'-' * 10} {'-' * 12}")
    for obj_name, obj_data in objects.items():
        print(f"  {obj_name:<20} {len(obj_data['actions']):<10} {len(obj_data['attributes']):<12}")
    print()

    # Summary
    print("  Complexity Formula: (Objects x Actions) + Unique Attribute States")
    print(f"  Objects:              {complexity['num_objects']}")
    print(f"  Unique Actions:       {complexity['num_actions']} ({', '.join(complexity['all_actions'])})")
    print(f"  Unique Attr States:   {complexity['num_attributes']}")
    print(f"  Interaction Score:    {complexity['num_objects']} x {complexity['num_actions']} = {complexity['interaction_complexity']}")
    print(f"  Total Complexity:     {complexity['interaction_complexity']} + {complexity['num_attributes']} = {complexity['total_complexity']}")
    print()

    # Rating
    score = complexity["total_complexity"]
    if score <= 10:
        rating = "LOW - Simple interface, manageable"
    elif score <= 25:
        rating = "MODERATE - Consider progressive disclosure"
    else:
        rating = "HIGH - Needs information architecture review"
    print(f"  Rating: {rating}")
    print()

    # Polymorphic actions
    poly = find_polymorphic_actions(objects)
    if poly:
        print("  Polymorphic Actions (shared across objects):")
        for action, objs in poly.items():
            print(f"    '{action}' -> {', '.join(objs)}")
        print()

    # Reduction suggestions
    suggestions = suggest_reductions(objects)
    if suggestions:
        print("  Reduction Suggestions:")
        for s in suggestions:
            print(s)
        print()


def interactive_mode():
    """Run interactive input mode."""
    print()
    print("  OAA Complexity Calculator")
    print("  =========================")
    print("  Enter objects, their actions, and attributes.")
    print("  Type 'done' when finished adding objects.")
    print()

    objects = {}
    while True:
        obj_name = input("  Object name (or 'done'): ").strip()
        if obj_name.lower() == "done":
            break

        objects[obj_name] = {"actions": set(), "attributes": set(), "rows": []}

        print(f"  Enter actions for '{obj_name}' (comma-separated):")
        actions_str = input("    Actions: ").strip()
        for a in actions_str.split(","):
            a = a.strip()
            if a:
                objects[obj_name]["actions"].add(a)

        print(f"  Enter attributes/states for '{obj_name}' (comma-separated):")
        print("    Use 'Status: Draft/Paid' format for multi-state attributes.")
        attrs_str = input("    Attributes: ").strip()
        for attr in attrs_str.split(","):
            attr = attr.strip()
            if attr:
                states = _parse_attribute_states(attr)
                for state in states:
                    objects[obj_name]["attributes"].add(state)
        print()

    print_report(objects)


def main():
    parser = argparse.ArgumentParser(
        description="OAA Complexity Calculator"
    )
    parser.add_argument(
        "--csv", metavar="FILE",
        help="Path to OAA matrix CSV file"
    )
    args = parser.parse_args()

    if args.csv:
        objects = load_from_csv(args.csv)
        print_report(objects)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
