"""Link-graph analysis of a site's page-structure crawl (NetworkX).
   python3 graph.py <site dir> [<site dir> ...]
Reads <site dir>/structure/structure.json (needs the `linksTo` lists the crawler records) and, for the
goal page, <site dir>/journey.json. Writes <site dir>/structure/graph.json. Counts are measured from
the crawl: a link graph of at most the crawled pages plus the pages they point to, not the whole site."""
import json, math, os, re, sys
import networkx as nx

FILE = re.compile(r"\.(zip|mp4|mov|mp3|docx?|xlsx?|pptx?|csv|json|txt|xhtml|xml|pdf|png|jpe?g|svg|webp|gif)$", re.I)  # downloads, not pages

def norm(u):
    return u.rstrip("/") or u

def analyse(site):
    sf = os.path.join(site, "structure", "structure.json")
    if not os.path.exists(sf):
        return None
    st = json.load(open(sf))
    pages = st.get("pages", [])
    if not pages or not any("linksTo" in p for p in pages):
        print(f"{os.path.basename(site)}: no link data (re-run `studio structure` to record it)", file=sys.stderr)
        return None
    crawled = {norm(p["url"]) for p in pages}
    title = {norm(p["url"]): p.get("title") for p in pages}
    G = nx.DiGraph()
    for p in pages:
        a = norm(p["url"]); G.add_node(a)
        for t in p.get("linksTo", []):
            b = norm(t)
            if b != a and not FILE.search(b): G.add_edge(a, b)
    start = norm(pages[0]["url"])

    # Pages linked from nearly every crawled page are the global navigation and footer. They make
    # every page one click from every other, which hides the real structure, so hubs and communities
    # are measured on the "local" graph: the same links without the edges that point at them.
    n_crawled = max(len(crawled), 1)
    global_links = sorted(n for n in G if G.in_degree(n) / n_crawled >= 0.8)
    L = nx.DiGraph(); L.add_nodes_from(G)
    L.add_edges_from((a, b) for a, b in G.edges if b not in global_links)
    LU = L.to_undirected()

    depth = nx.single_source_shortest_path_length(G, start)
    depth_local = nx.single_source_shortest_path_length(L, start)
    pr = nx.pagerank(L) if L.number_of_edges() else {n: 1 / len(L) for n in L}
    btw = nx.betweenness_centrality(L) if len(L) > 2 else {n: 0 for n in L}
    comms = [sorted(c) for c in nx.community.louvain_communities(LU, seed=1) if len(c) > 1] if LU.number_of_edges() else []
    comms.sort(key=len, reverse=True)
    comm_of = {n: i for i, c in enumerate(comms) for n in c}

    dead_ends = sorted(n for n in crawled if G.out_degree(n) == 0)
    unreachable = sorted(n for n in crawled if n not in depth)
    menu_only = sorted(n for n in crawled if n in depth and n not in depth_local)  # reachable only through global links

    goal = None
    jf = os.path.join(site, "journey.json")
    if os.path.exists(jf):
        j = json.load(open(jf)); gs = j.get("goalStep") or 0
        steps = j.get("steps", [])
        if 0 < gs <= len(steps):
            g = norm(steps[gs - 1]["url"]).split("#")[0]
            goal = {"url": g, "inGraph": g in G, "linkDepth": depth.get(g), "localDepth": depth_local.get(g)}

    top = lambda d, k=5: [{"url": n, "title": title.get(n), "score": round(v, 4)} for n, v in sorted(d.items(), key=lambda x: -x[1])[:k]]
    # Layout: pages joined by local links in the middle, everything else (reachable only through the
    # menu) evenly on an outer ring, so the picture isn't a scatter of unconnected dots.
    linked = [n for n in LU if LU.degree(n) > 0]
    loose = [n for n in LU if LU.degree(n) == 0]
    pos = {}
    if len(linked) > 1:
        pos.update(nx.spring_layout(LU.subgraph(linked), seed=7, k=0.9 / len(linked) ** 0.5, iterations=200))
    else:
        pos.update({n: (0.0, 0.0) for n in linked})
    for i, n in enumerate(loose):
        a = 2 * math.pi * i / max(len(loose), 1)
        pos[n] = (1.45 * math.cos(a), 1.45 * math.sin(a))
    depths = [depth[n] for n in crawled if n in depth]
    ldepths = [depth_local[n] for n in crawled if n in depth_local]
    out = {
        "site": os.path.basename(os.path.normpath(site)), "start": start,
        "pages": len(G), "crawled": len(crawled), "links": G.number_of_edges(),
        "maxDepth": max(depths) if depths else None,
        "meanDepth": round(sum(depths) / len(depths), 2) if depths else None,
        "depthCounts": {str(d): sum(1 for v in depths if v == d) for d in sorted(set(depths))},
        "localMaxDepth": max(ldepths) if ldepths else None,
        "localMeanDepth": round(sum(ldepths) / len(ldepths), 2) if ldepths else None,
        "localDepthCounts": {str(d): sum(1 for v in ldepths if v == d) for d in sorted(set(ldepths))},
        "goal": goal, "globalLinks": global_links, "menuOnly": menu_only, "deadEnds": dead_ends, "unreachable": unreachable,
        "hubsByPageRank": top(pr), "bridgesByBetweenness": top(btw),
        "communities": [{"size": len(c), "pages": c} for c in comms],
        "nodes": [{"url": n, "title": title.get(n), "crawled": n in crawled, "depth": depth.get(n), "pagerank": round(pr[n], 5), "menuOnly": n in menu_only,
                   "community": comm_of.get(n, -1), "x": round(float(pos[n][0]), 4), "y": round(float(pos[n][1]), 4)} for n in G],
        "edges": [[a, b] for a, b in L.edges],  # local links only; the global ones are listed in globalLinks
    }
    json.dump(out, open(os.path.join(site, "structure", "graph.json"), "w"), indent=1)
    gd = goal["linkDepth"] if goal else None
    print(f"{out['site']}: {out['pages']} pages ({out['crawled']} crawled), {out['links']} links, max depth {out['maxDepth']} "
          f"(without menu links: {out['localMaxDepth']}), goal depth {gd if gd is not None else '—'}, "
          f"menu-only pages {len(menu_only)}, dead ends {len(dead_ends)}, communities {len(comms)}")
    return out

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for s in sys.argv[1:]:
        analyse(s)
