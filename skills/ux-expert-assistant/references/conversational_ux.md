# Conversational UX & Sentiment Strategy

## 1. Natural Conversation Framework (Moore/Arar)
Stop designing "Trees"; design "Sequences."
* **Expandable Sequences:**
    * *Base Pair:* A: "Coffee?" B: "Yes."
    * *Expansion:* A: "Coffee?" B: "Decaf?" A: "Sure." B: "Yes."
* **Repair Mechanisms:**
    * *Self-Initiated:* User corrects themselves ("No, wait, I meant...").
    * *Other-Initiated:* System asks for clarification ("Did you mean X?").

## 2. Conversational Maxims (Grice/Hall)
* **Quantity:** Say exactly as much as needed, no more.
* **Quality:** Do not say what you believe to be false.
* **Relation:** Be relevant.
* **Manner:** Avoid ambiguity.

## 3. Personality & Tone (Hall)
* **The System Persona:** If you don't define a personality, the user will invent one (usually a rude one).
* **Sentiment Analysis (Liu):**
    * *Polarity:* Positive/Negative/Neutral.
    * *Strategy:* If User Sentiment = Negative, System Tone must shift to **High Empathy/Low Latency**. Do not use "Cheery" stock responses with an angry user.