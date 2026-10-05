# Smart Escape

Frontend-only evacuation route simulator implementing the attached practice challenge.

## Identity and submission

- Full name: fill in your name before competition submission.
- Registration number: fill in your registration number.
- Public GitHub repository: create `devfest-<registration-number>` and push this source.
- Live website: https://smart-escape-simulator.itachii9908578.chatgpt.site
- Final commit: run `git rev-parse HEAD` in your submission repository.

This is a practice solution. It does not certify compliance with the 90-minute event window, public GitHub submission, the current external rulebook, or timed competition commit requirements. Do not backdate commits. Commit at least once every 30 minutes during the actual event and include the AI prompt used or `Manual edit` in each message.

## Run

No dependencies, install step, external API, backend or build step required.

```sh
npm start
```

Open http://localhost:8080 in your browser. JavaScript modules need an HTTP server; opening index.html as a file is insufficient. Alternatively deploy the contents of `dist/` to any static HTTPS host (GitHub Pages, Netlify, Vercel or Cloudflare Pages). Firebase Hosting configuration is included in `firebase.json`. See `SETUP_VSCODE.md` for local use, GitHub publishing and Firebase deployment.

Tests require Node.js 18+:

```sh
npm test
```

## Use

1. The supplied official `building.json` loads automatically. Import another file at any time.
2. Select an unblocked room or junction with the start selector or the map.
3. Switch to Edit hazards to toggle rooms/junctions and exits. Clicking a corridor toggles only that edge in either mode. The side panel provides keyboard-accessible controls for every element.
4. Routes recalculate immediately. Reset hazards restores exactly the imported initial_state while retaining the selected start. If the start is blocked after reset, that status is shown.
5. Use English/Bangla at any time. Dataset names and labels remain unchanged.
6. Zoom, drag to pan, or Fit map for larger imported graphs.

`dist/building.json` is the supplied official public sample, “East Annex - Practice Building,” containing 8 nodes and 9 undirected corridors. `dist/sample.js` embeds the identical data for immediate startup; a test checks consistency with the downloadable JSON. `README_START_HERE.txt` preserves the supplied participant instructions. All routes are calculated from data and hazards, including for unseen imported files.

## Implemented features

- Schema, range, type, duplicate ID/pair, reference, self-loop and initial hazard category validation.
- SVG map drawn at normalized supplied coordinates, distinct node types, readable labels and edge costs.
- Undirected weighted routing, immediate rerouting, original-state reset and explicit failure states.
- Exclusion of blocked nodes, incident edges, blocked corridors and closed exits, including exits used as intermediate nodes.
- Exact exit-ID and node-sequence tie breaking using case-sensitive code-unit lexical comparison, independent of edge input order.
- English and Bangla for principal instructions, actions, statuses and validation errors.
- Brief transitions and route animation; reduced-motion support.
- Responsive layout, keyboard-accessible controls, zoom/pan and downloadable official sample JSON.
- Feature-detected browser WebMCP simulation configuration action; unsupported browsers use the normal interface.
- All imports stay in browser memory. No persistent remote storage, telemetry, secrets or external routing APIs.

## Algorithm

`dist/core.js` contains a deterministic Dijkstra implementation. Build adjacency excluding blocked endpoints, closed exits and blocked edges. Start distance is zero; all other distances are unknown. Repeatedly settle the unvisited node with the lowest distance, using node-ID sequence comparison for equal distance. Relax each usable edge; replace an existing best path on a lower total or an equal total with a lexically smaller sequence. Positive edge costs ensure every predecessor has a lower distance, so equal-cost alternatives are accounted for before a node is settled.

After all reachable nodes are settled, compare reachable open exits by (total cost, exit ID). The selected exit's path already has the smallest node sequence for that exit. Coordinates never affect routing. Costs use BigInt for summed totals; JSON numbers are interpreted as parsed by JavaScript. For exact individual integer input values above JavaScript's safe-integer range, JSON numeric precision is a limitation.

Time: O(V^2 + E*V) with at most V node IDs compared per tie. Space: O(V^2 + E) for adjacency and saved path sequences. Within 60 nodes and 150 edges.

## Verification

Eight test groups cover the five sample scenarios, tie priority, input order independence, closed-exit intermediates, edge blocking, disconnected graphs, reset and missing start, large cost sums, malformed data, and 500 deterministic random graphs checked against an independent exhaustive simple-path oracle.

## Screenshots and known limitations

Browser screenshot capture was unavailable in this environment for this buildless project. Before formal submission, add actual browser captures as `screenshots/baseline.png` (R1 to E1, cost 7) and `screenshots/rerouting-C2.png` (C2 blocked; R1 to E2, cost 11). Do not substitute illustrations for browser screenshots.

Coincident coordinates and very dense graphs may overlap labels; zoom, full-label hover titles and the location/corridor lists help inspection. Finite numeric coordinates and positive integer costs are required. Imports over 5 MB are rejected with a translated error. Native Bangla typography depends on fonts installed on the viewing device. The optional WebMCP API was not validated in a supported live context; ordinary controls do not depend on it. A latest-Chrome visual/manual review remains recommended before formal submission.

## AI tools and most useful prompt

AI tool: OpenAI Codex / ChatGPT.

User prompt: `solve that` with Smart_Escape_Problem_Statement.pdf attached. Dataset update: `here is data set add on it` with building.json and README_START_HERE.txt attached.

Useful implementation prompt: Build a frontend-only English/Bangla evacuation route simulator from the supplied JSON schema. Validate all IDs and hazard categories. Use weighted Dijkstra with exact minimum cost, then lexical exit ID, then lexical node-sequence ties. Exclude closed exits even as intermediate nodes. Recalculate after every hazard/start change and reset to the imported initial state. Verify against an exhaustive simple-path oracle.

## License

MIT. Educational simulation only; not a certified real-world evacuation planning tool.
