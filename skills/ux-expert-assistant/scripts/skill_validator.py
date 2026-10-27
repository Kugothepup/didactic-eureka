#!/usr/bin/env python3
"""Skill Project Structure & Integrity Validator.

Validates that all files listed in structure.md exist, all file references
in SKILL.md resolve, markdown files have content, and the OAA CSV is parseable.

Usage:
    python3 scripts/skill_validator.py
"""

import csv
import os
import re
import sys


def find_project_root():
    """Find the project root by looking for SKILL.md."""
    # Try current directory first, then walk up
    check = os.getcwd()
    for _ in range(5):
        if os.path.isfile(os.path.join(check, "SKILL.md")):
            return check
        check = os.path.dirname(check)
    # Also try relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent = os.path.dirname(script_dir)
    if os.path.isfile(os.path.join(parent, "SKILL.md")):
        return parent
    return os.getcwd()


def parse_structure_md(path):
    """Extract expected file list from structure.md.

    Parses lines like:
        ├── SKILL.md
        │   ├── psychology_models.md
    And reconstructs paths from the tree structure.
    """
    files = []
    if not os.path.isfile(path):
        return files

    with open(path, "r") as f:
        lines = f.readlines()

    # Track directory context: list of (depth, dir_name)
    dir_stack = []

    for line in lines:
        stripped = line.rstrip()
        if not stripped:
            continue

        # Extract the file/dir name from tree drawing characters
        # Match patterns like: ├── name, └── name, │   ├── name
        match = re.search(r'[├└]── (.+?)(?:\s+#.*)?$', stripped)
        if not match:
            # Check for root directory line (e.g., "ux-expert-assistant/")
            root_match = re.match(r'^(\S+)/$', stripped)
            if root_match:
                dir_stack = []
                continue
            continue

        name = match.group(1).strip()

        # Determine depth by character position of the connector (├ or └)
        # Each nesting level is 4 characters wide (│   or    )
        connector_pos = match.start()
        depth = connector_pos // 4

        if name.endswith('/'):
            # It's a directory
            dir_name = name.rstrip('/')
            # Trim stack to current depth, then push
            dir_stack = [d for d in dir_stack if d[0] < depth]
            dir_stack.append((depth, dir_name))
        else:
            # It's a file — build path from all dirs with depth < this item's depth
            parent_dirs = [d[1] for d in dir_stack if d[0] < depth]
            if parent_dirs:
                files.append('/'.join(parent_dirs) + '/' + name)
            else:
                files.append(name)

    return files


def parse_skill_references(path):
    """Extract file references from SKILL.md.

    Looks for patterns like:
        `references/quantitative_ux.md`
        `assets/goms_calculator_template.md`
    """
    refs = []
    if not os.path.isfile(path):
        return refs

    with open(path, "r") as f:
        content = f.read()

    # Match backtick-quoted file paths
    backtick_refs = re.findall(r'`([a-zA-Z_/]+\.\w+)`', content)
    refs.extend(backtick_refs)

    return list(set(refs))


def validate_files(expected, base_dir):
    """Check existence of expected files."""
    found = []
    missing = []
    for filepath in expected:
        full_path = os.path.join(base_dir, filepath)
        if os.path.isfile(full_path):
            found.append(filepath)
        else:
            missing.append(filepath)
    return found, missing


def validate_markdown_content(base_dir, files):
    """Check that markdown files have content (not empty)."""
    empty = []
    for filepath in files:
        if not filepath.endswith('.md'):
            continue
        full_path = os.path.join(base_dir, filepath)
        if not os.path.isfile(full_path):
            continue
        size = os.path.getsize(full_path)
        if size == 0:
            empty.append(filepath)
    return empty


def validate_csv(path):
    """Check CSV structure and parseability."""
    issues = []
    if not os.path.isfile(path):
        issues.append(f"CSV file not found: {path}")
        return issues

    try:
        with open(path, "r", newline="") as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames
            if headers is None:
                issues.append("CSV has no headers")
                return issues

            expected_cols = ["Object (Noun)", "Attribute (Adjective/State)", "Action (Verb)"]
            for col in expected_cols:
                if col not in headers:
                    issues.append(f"Missing expected column: '{col}'")

            row_count = 0
            for row in reader:
                row_count += 1
            if row_count == 0:
                issues.append("CSV has headers but no data rows")

    except csv.Error as e:
        issues.append(f"CSV parse error: {e}")
    except Exception as e:
        issues.append(f"Error reading CSV: {e}")

    return issues


def print_report(results):
    """Print formatted validation report."""
    print()
    print("  Skill Project Validator")
    print(f"  {'=' * 50}")
    print()

    # Structure.md files
    print(f"  Files from structure.md:")
    print(f"    Found:   {len(results['structure_found'])}")
    print(f"    Missing: {len(results['structure_missing'])}")
    if results['structure_missing']:
        for f in results['structure_missing']:
            print(f"      - {f}")
    print()

    # SKILL.md references
    print(f"  File references from SKILL.md:")
    print(f"    Resolved: {len(results['refs_found'])}")
    print(f"    Broken:   {len(results['refs_missing'])}")
    if results['refs_missing']:
        for f in results['refs_missing']:
            print(f"      - {f}")
    print()

    # Empty markdown files
    if results['empty_md']:
        print(f"  Empty markdown files: {len(results['empty_md'])}")
        for f in results['empty_md']:
            print(f"      - {f}")
    else:
        print("  All markdown files have content.")
    print()

    # CSV validation
    if results['csv_issues']:
        print(f"  OAA CSV issues: {len(results['csv_issues'])}")
        for issue in results['csv_issues']:
            print(f"      - {issue}")
    else:
        print("  OAA CSV is valid and parseable.")
    print()

    # Overall
    total_issues = (
        len(results['structure_missing'])
        + len(results['refs_missing'])
        + len(results['empty_md'])
        + len(results['csv_issues'])
    )
    total_files = len(results['structure_found']) + len(results['structure_missing'])

    print(f"  {'-' * 50}")
    print(f"  Total files checked: {total_files}")
    print(f"  Total issues:        {total_issues}")
    if total_issues == 0:
        print("  Result:              PASS")
    else:
        print("  Result:              FAIL")
    print()

    return total_issues == 0


def main():
    base_dir = find_project_root()
    structure_path = os.path.join(base_dir, "structure.md")
    skill_path = os.path.join(base_dir, "SKILL.md")
    csv_path = os.path.join(base_dir, "assets", "oaa_matrix.csv")

    # Parse expected files
    structure_files = parse_structure_md(structure_path)
    skill_refs = parse_skill_references(skill_path)

    # Validate
    structure_found, structure_missing = validate_files(structure_files, base_dir)
    refs_found, refs_missing = validate_files(skill_refs, base_dir)

    # Check markdown content
    all_files = list(set(structure_files + skill_refs))
    empty_md = validate_markdown_content(base_dir, all_files)

    # Check CSV
    csv_issues = validate_csv(csv_path)

    results = {
        "structure_found": structure_found,
        "structure_missing": structure_missing,
        "refs_found": refs_found,
        "refs_missing": refs_missing,
        "empty_md": empty_md,
        "csv_issues": csv_issues,
    }

    passed = print_report(results)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
