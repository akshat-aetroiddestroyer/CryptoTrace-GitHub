# CryptoTrace

**AI-Powered Crypto Fraud Tracing & Prevention Platform**  
Smart India Hackathon 2026 · Real-Time Crypto Fraud Attribution System

CryptoTrace helps investigators and victims close the gap between a crypto fraud and a successful freeze: wallet tracing, explainable risk scoring, live fund-flow graphs, golden-hour alerts, suspect registry, voice complaint intake, evidence vault, and a browser extension that hard-warns on flagged addresses.

---

## Quick start (demo site — no build)

The full interactive demo is a single HTML file:

```bash
# Option A: open directly
open index.html

# Option B: local server
python3 -m http.server 8080
# then visit http://localhost:8080
```

### Demo sections

| Section | What it shows |
|--------|----------------|
| Problem & cybercrime | Threat surface, pipeline, LEA outcomes |
| Trace & live graph | Risk score, animated DAG, full tx history, 1930 + email drafts |
| Golden-hour alerts | Freeze action cards + reporting channels |
| Suspect & case-law registry | Flagged wallets + judgments |
| Pre-tx safety check | Registry lookup before send |
| Browser extension | Install guide + **hard live-screen warning** demo |
| Voice intake | Multilingual complaint → structured record |
| Evidence vault | Hash / testnet anchor concept |
| Safety library | Fraud typology guidance |
| AI chatbot (FAB) | Floating assistant for cyber-fraud Q&A |

---

## Browser extension (MVP skeleton)

Folder: `extension/`

### Load unpacked (Chrome / Edge)

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder
4. Pin **CryptoTrace Guard**
5. Open any page with a `0x…` address — content script scans DOM + clipboard

### Architecture (Manifest V3)

```
SCAN (MutationObserver + clipboard)
  → NORMALIZE (lowercase address)
  → LOOKUP (GET registry API)
  → CACHE (chrome.storage, TTL)
  → RENDER (banner / hard modal / badge)
```

Hard warning (risk ≥ threshold): full-width red banner + center modal **DO NOT SEND FUNDS**.

---

## React app source (optional)

`web-app/` contains the enhanced React/Vite source (pages, components) used in the product build. It depends on a monorepo-style API client in the original Replit workspace; the **standalone demo** judges should open is `index.html`.

---

## Reporting channels (India)

- Helpline: **1930** (Citizen Financial Cyber Fraud Reporting)
- Portal: [cybercrime.gov.in](https://www.cybercrime.gov.in) (NCRP)
- After a high-risk trace, use **Report & freeze** drafts for helpline + exchange compliance email

---

## Project brief alignment

- Ingest reported wallets → automatic tracing  
- Identify nearest exchange / VASP  
- Detect layering / fund-movement patterns  
- Actionable intelligence + risk categorization  
- Live fund-flow visualization  
- Prevention (safety check + extension) and evidence integrity (vault)

---

## Team / license

Prepared for **Smart India Hackathon 2026**.  
License: MIT (see `LICENSE`).
