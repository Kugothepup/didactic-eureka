"""Themes across sites: clusters the pluses and deltas in reviews.json (NetworkX).
   python3 themes.py <reviews.json> <out themes.json> [--min-sim 0.2]
Each site's pluses and deltas are nodes; two findings are joined when their wording overlaps
(TF-IDF cosine, standard library only, no model to install); Louvain communities become themes.
Synthesis findings are left out (they are derived from the sites, so counting them would be circular).
This is lexical similarity: a first grouping to read and correct, not a judgement of meaning."""
import json, math, re, sys
from collections import Counter
import networkx as nx

STOP = set("""a an the and or but if of to in on at by for with from as is are was were be been being it its this that these those
there their them they we our you your he she his her not no do does did done can could should would will may might must have has had
into onto over under about than then so such more most less least very also just only any all each both other another which who whom
what when where why how up out off per via vs one two three site sites page pages user users visitor visitors""".split())

def stem(w):
    for suf in ("ations", "ation", "ings", "ing", "ies", "ied", "ed", "es", "s"):
        if w.endswith(suf) and len(w) - len(suf) >= 4:
            return w[: -len(suf)] + ("y" if suf in ("ies", "ied") else "")
    return w

def tokens(text):
    return [stem(w) for w in re.findall(r"[a-z][a-z'-]+", text.lower()) if w not in STOP and len(w) > 2]

def main(reviews_file, out_file, min_sim):
    rv = json.load(open(reviews_file))
    items = []
    for slug, r in (rv.get("sites") or {}).items():
        for kind, key in (("plus", "pluses"), ("delta", "deltas")):
            for f in r.get(key, []) or []:
                f = {"title": f} if isinstance(f, str) else f
                items.append({"id": len(items), "site": slug, "kind": kind, "title": f.get("title", ""), "why": f.get("why", "")})
    if len(items) < 2:
        sys.exit("Need at least two findings in reviews.json (sites.<slug>.pluses / deltas).")

    docs = [Counter(tokens(i["title"] + " " + i["title"] + " " + i["why"])) for i in items]  # title counts double
    df = Counter(t for d in docs for t in d)
    n = len(docs)
    idf = {t: math.log((1 + n) / (1 + c)) + 1 for t, c in df.items()}
    vec = [{t: c * idf[t] for t, c in d.items()} for d in docs]
    norm = [math.sqrt(sum(v * v for v in x.values())) or 1 for x in vec]
    cos = lambda a, b: sum(v * vec[b].get(t, 0) for t, v in vec[a].items()) / (norm[a] * norm[b])

    G = nx.Graph()
    G.add_nodes_from(i["id"] for i in items)
    for a in range(n):
        for b in range(a + 1, n):
            s = cos(a, b)
            if s >= min_sim:
                G.add_edge(a, b, weight=round(s, 3))
    comms = [sorted(c) for c in nx.community.louvain_communities(G, weight="weight", seed=1)] if G.number_of_edges() else []
    comms = [c for c in comms if len(c) > 1]
    comms.sort(key=lambda c: (-len({items[i]["site"] for i in c}), -len(c)))
    inside = {i for c in comms for i in c}

    def shape(ids):
        sites = sorted({items[i]["site"] for i in ids})
        plus = sorted({items[i]["site"] for i in ids if items[i]["kind"] == "plus"})
        delta = sorted({items[i]["site"] for i in ids if items[i]["kind"] == "delta"})
        wdeg = {i: G.degree(i, weight="weight") for i in ids}
        good = [i for i in ids if items[i]["kind"] == "plus"] if (plus and delta) else ids
        rep = max(good, key=lambda i: wdeg[i])  # a borrowable theme is headed by what works
        term = Counter()
        for i in ids:
            for t, w in vec[i].items():
                term[t] += w
        return {
            "size": len(ids), "sites": sites, "siteCount": len(sites), "plusSites": plus, "deltaSites": delta,
            # a plus on one site and a delta on another about the same thing: something to borrow
            "transferable": bool(plus and delta and set(plus) != set(delta)),
            "terms": [t for t, _ in term.most_common(4)],
            "representative": items[rep]["id"],
            "findings": [items[i] for i in sorted(ids, key=lambda i: -wdeg[i])],
        }

    themes = [shape(c) for c in comms]
    one_offs = [items[i] for i in range(n) if i not in inside]
    # How many themes each pair of sites shares: a rough "these two sites are doing the same thing" map.
    pair = Counter()
    for t in themes:
        for a in range(len(t["sites"])):
            for b in range(a + 1, len(t["sites"])):
                pair[(t["sites"][a], t["sites"][b])] += 1
    out = {"minSimilarity": min_sim, "findings": n, "themes": themes, "oneOffs": one_offs,
           "sitePairs": [{"a": a, "b": b, "sharedThemes": c} for (a, b), c in pair.most_common()],
           "note": "Grouped by overlapping wording, not meaning. Read each theme and correct it."}
    json.dump(out, open(out_file, "w"), indent=1)
    print(f"{n} findings -> {len(themes)} themes ({sum(t['transferable'] for t in themes)} transferable), {len(one_offs)} one-offs")

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    ms = float(a[a.index("--min-sim") + 1]) if "--min-sim" in a else 0.2
    main(a[0], a[1], ms)
