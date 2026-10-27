#!/usr/bin/env python3
"""Fitts's Law Movement Time Predictor.

Predict cursor movement time to a target using Fitts's Law:
    MT = a + b * log2(D/W + 1)

Usage:
    Interactive mode:  python3 fitts_law_calculator.py
    Argument mode:     python3 fitts_law_calculator.py --distance 500 --width 50
    Comparison mode:   python3 fitts_law_calculator.py --compare 500:50 300:100 200:200
"""

import argparse
import math
import sys


# Default Fitts's Law constants
DEFAULT_A = 0.0     # intercept (seconds)
DEFAULT_B = 0.155   # slope (seconds/bit)


def index_of_difficulty(distance, width):
    """Calculate the Index of Difficulty: log2(D/W + 1)."""
    if width <= 0:
        raise ValueError("Width must be positive.")
    return math.log2(distance / width + 1)


def calculate_mt(distance, width, a=DEFAULT_A, b=DEFAULT_B):
    """Calculate movement time using Fitts's Law: MT = a + b * log2(D/W + 1)."""
    iod = index_of_difficulty(distance, width)
    return a + b * iod


def recommend(distance, width):
    """Generate design suggestions based on Index of Difficulty."""
    iod = index_of_difficulty(distance, width)
    suggestions = []

    if iod > 5:
        suggestions.append("HIGH difficulty. Consider making the target larger or moving it closer.")
    elif iod > 3:
        suggestions.append("MODERATE difficulty. Increasing target width would improve acquisition time.")
    else:
        suggestions.append("LOW difficulty. Target is well-sized for its distance.")

    if width >= 10000:
        suggestions.append(
            "Infinite-width edge target detected. Screen edges are the fastest targets "
            "(impossible to overshoot). Good placement."
        )

    if distance > 500:
        suggestions.append(
            "Long distance. Consider placing this target closer to the user's likely "
            "cursor position (e.g., near the content they just interacted with)."
        )

    if width < 20:
        suggestions.append(
            f"Target width ({width}px) is very small. WCAG recommends minimum 44px touch "
            f"targets. Even for mouse, consider at least 24px."
        )

    return suggestions


def compare_targets(targets, a=DEFAULT_A, b=DEFAULT_B):
    """Compare multiple target configurations."""
    results = []
    for d, w in targets:
        mt = calculate_mt(d, w, a, b)
        iod = index_of_difficulty(d, w)
        results.append({"distance": d, "width": w, "mt": mt, "id": iod})
    return results


def print_single_result(distance, width, a, b):
    """Print results for a single D/W calculation."""
    mt = calculate_mt(distance, width, a, b)
    iod = index_of_difficulty(distance, width)
    suggestions = recommend(distance, width)

    print()
    print("  Fitts's Law Analysis")
    print("  ====================")
    print(f"  Distance (D):         {distance} px")
    print(f"  Width (W):            {width} px")
    print(f"  Constants:            a={a}, b={b}")
    print(f"  Index of Difficulty:  {iod:.2f} bits")
    print(f"  Movement Time (MT):   {mt:.3f} seconds")
    print()
    print("  Design Recommendations:")
    for s in suggestions:
        print(f"    - {s}")
    print()


def print_comparison(results, a, b):
    """Print comparison table for multiple targets."""
    print()
    print("  Fitts's Law Comparison")
    print(f"  Constants: a={a}, b={b}")
    print(f"  {'=' * 60}")
    print(f"  {'#':<4} {'Distance':<12} {'Width':<12} {'ID (bits)':<12} {'MT (sec)':<12}")
    print(f"  {'-' * 4} {'-' * 12} {'-' * 12} {'-' * 12} {'-' * 12}")

    for i, r in enumerate(results, 1):
        print(f"  {i:<4} {r['distance']:<12} {r['width']:<12} {r['id']:<12.2f} {r['mt']:<12.3f}")

    print(f"  {'-' * 4} {'-' * 12} {'-' * 12} {'-' * 12} {'-' * 12}")

    fastest = min(results, key=lambda r: r["mt"])
    slowest = max(results, key=lambda r: r["mt"])
    diff = slowest["mt"] - fastest["mt"]

    print()
    print(f"  Fastest: #{results.index(fastest) + 1} (D={fastest['distance']}, W={fastest['width']}) at {fastest['mt']:.3f}s")
    print(f"  Slowest: #{results.index(slowest) + 1} (D={slowest['distance']}, W={slowest['width']}) at {slowest['mt']:.3f}s")
    print(f"  Difference: {diff:.3f}s ({diff / slowest['mt'] * 100:.0f}% improvement possible)")
    print()


def interactive_mode():
    """Run interactive mode."""
    print()
    print("  Fitts's Law Calculator")
    print("  ======================")
    print("  Formula: MT = a + b * log2(D/W + 1)")
    print()

    mode = input("  Compare multiple targets? (y/n): ").strip().lower()

    a_str = input(f"  Intercept 'a' (default {DEFAULT_A}): ").strip()
    a = float(a_str) if a_str else DEFAULT_A
    b_str = input(f"  Slope 'b' (default {DEFAULT_B}): ").strip()
    b = float(b_str) if b_str else DEFAULT_B

    if mode == "y":
        targets = []
        print("  Enter D:W pairs. Type 'done' to finish.")
        while True:
            pair = input("  Distance Width (space-separated, or 'done'): ").strip()
            if pair.lower() == "done":
                break
            parts = pair.split()
            if len(parts) != 2:
                print("  Please enter two numbers separated by space.")
                continue
            try:
                d, w = float(parts[0]), float(parts[1])
                targets.append((d, w))
            except ValueError:
                print("  Invalid numbers.")
        if targets:
            results = compare_targets(targets, a, b)
            print_comparison(results, a, b)
    else:
        try:
            distance = float(input("  Distance to target (px): ").strip())
            width = float(input("  Width of target (px): ").strip())
        except ValueError:
            print("  Invalid input.")
            return
        print_single_result(distance, width, a, b)


def main():
    parser = argparse.ArgumentParser(
        description="Fitts's Law Movement Time Predictor"
    )
    parser.add_argument("--distance", "-d", type=float, help="Distance to target (px)")
    parser.add_argument("--width", "-w", type=float, help="Width of target (px)")
    parser.add_argument("--a", type=float, default=DEFAULT_A, help=f"Intercept constant (default: {DEFAULT_A})")
    parser.add_argument("--b", type=float, default=DEFAULT_B, help=f"Slope constant (default: {DEFAULT_B})")
    parser.add_argument(
        "--compare", nargs="+", metavar="D:W",
        help="Compare multiple D:W pairs (e.g., 500:50 300:100)"
    )
    args = parser.parse_args()

    if args.compare:
        targets = []
        for pair in args.compare:
            parts = pair.split(":")
            if len(parts) != 2:
                print(f"  Invalid pair format: '{pair}'. Use D:W (e.g., 500:50).")
                sys.exit(1)
            try:
                targets.append((float(parts[0]), float(parts[1])))
            except ValueError:
                print(f"  Invalid numbers in pair: '{pair}'.")
                sys.exit(1)
        results = compare_targets(targets, args.a, args.b)
        print_comparison(results, args.a, args.b)
    elif args.distance is not None and args.width is not None:
        print_single_result(args.distance, args.width, args.a, args.b)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
