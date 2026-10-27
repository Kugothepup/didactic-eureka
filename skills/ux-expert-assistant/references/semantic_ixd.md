# Semantic Interaction Design (IxD)

**Core Principle:** Define the *Grammar* (Meaning) before the *Syntax* (Screens).

## The 4 Layers
1. **Grammar:** The Conceptual Model (Objects, Actions, Attributes).
2. **Visualization:** Mapping grammar to UI patterns.
3. **Flow:** Task sequencing.
4. **Game:** Motivation/Feedback.

## Conceptual Models
*Source: Norman / Johnson-Laird*
The user's mental model of how a system works. Misalignment between the designer's model and the user's model is the root cause of most usability failures.
* **Good Model:** A thermostat controls temperature. User sets 72°F, system targets 72°F. Mental model matches mechanism.
* **Bad Model:** User sets thermostat to 90°F hoping it heats *faster*. Mental model (valve) doesn't match mechanism (switch).
* **Design Rule:** Make the conceptual model visible. If the user can't infer how it works from the interface, the model is hidden.

## Mappings (Norman)
The relationship between controls and their effects.
* **Natural Mapping:** Spatial correspondence. A row of light switches that mirrors the physical layout of lights. Requires zero learning.
* **Arbitrary Mapping:** No correspondence. A single dropdown to control font, size, and color. Requires memorization.
* **Goal:** Maximize natural mappings. When arbitrary mapping is unavoidable, use consistent conventions and labels.

## Object-Action-Attribute (OAA) Logic
* **Objects:** Nouns. Avoid implementation terms (e.g., use "Cart" not "Array").
* **Actions:** Verbs. Check for polymorphism (Does "Delete" work the same on all objects?).
* **Complexity Formula:** `(Objects x Actions) + Unique Attribute States`.
* **Goal:** Reduce complexity by merging objects or standardizing actions.

### Worked Example: Project Management Tool
| Object | Actions | Key Attributes |
| :--- | :--- | :--- |
| Project | Create, Archive, Share | Name, Status, Owner |
| Task | Create, Assign, Complete, Delete | Title, Due Date, Priority, Assignee |
| Comment | Add, Edit, Delete | Body, Author, Timestamp |

**Complexity:** `(3 objects × 4 avg actions) + 11 attributes = 23`
**Reduction opportunity:** "Create" works identically on all three objects (polymorphic). "Delete" on Project could mean Archive — if so, split it or rename to avoid conceptual mismatch.