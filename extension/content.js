/**
 * CryptoTrace Guard — content script
 * Detects Ethereum addresses in the DOM and clipboard, queries registry, injects hard warnings.
 * Demo mode uses a local allow/deny list when API is unavailable.
 */

(function () {
  const ADDR_RE = /0x[a-fA-F0-9]{40}/g;
  const HARD_THRESHOLD = 80;

  /** Demo registry (same sample as main product). Replace with live API in production. */
  const DEMO_REGISTRY = {
    '0x742d35cc6634c0532925a3b844bc9e7595f0beb1': {
      risk: 'high',
      score: 91,
      cases: 7,
      types: 'Investment scam, Layering',
      status: 'flagged',
    },
    '0x8ba1f109551bd432803012645ac136ddd64dba72': {
      risk: 'high',
      score: 87,
      cases: 4,
      types: 'Task-based fraud',
      status: 'under_review',
    },
  };

  const checked = new Set();

  function short(a) {
    return a.slice(0, 8) + '…' + a.slice(-6);
  }

  async function lookup(address) {
    const key = address.toLowerCase();
    // Production: return fetch(`https://api.cryptotrace.example/registry/${key}`).then(r => r.json())
    return DEMO_REGISTRY[key] || null;
  }

  function ensureBanner() {
    let el = document.getElementById('cryptotrace-hard-banner');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cryptotrace-hard-banner';
    el.setAttribute('role', 'alert');
    document.documentElement.prepend(el);
    return el;
  }

  function showBanner(hit, address) {
    const el = ensureBanner();
    el.className = 'ct-banner ct-banner-hard';
    el.innerHTML =
      '<div class="ct-banner-inner">' +
      '<strong>⚠ CRYPTOTRACE HARD WARNING — DO NOT SEND FUNDS</strong>' +
      '<div class="ct-mono">' +
      address +
      '</div>' +
      '<div>Risk ' +
      hit.score +
      '/100 · ' +
      hit.cases +
      ' linked cases · ' +
      hit.types +
      '</div>' +
      '</div>';
  }

  function showModal(hit, address) {
    if (document.getElementById('cryptotrace-hard-modal')) return;
    const wrap = document.createElement('div');
    wrap.id = 'cryptotrace-hard-modal';
    wrap.className = 'ct-modal-overlay';
    wrap.innerHTML =
      '<div class="ct-modal">' +
      '<div class="ct-modal-head">⚠ HARD WARNING — DO NOT SEND FUNDS</div>' +
      '<div class="ct-modal-body">' +
      '<p class="ct-mono">' +
      address +
      '</p>' +
      '<p>Risk score: <b>' +
      hit.score +
      '/100</b> (' +
      hit.risk +
      ')</p>' +
      '<p>Linked cases: ' +
      hit.cases +
      '</p>' +
      '<p>Typologies: ' +
      hit.types +
      '</p>' +
      '<p class="ct-hint">This address is in the CryptoTrace fraud registry. Call <b>1930</b> if you already paid.</p>' +
      '<button type="button" class="ct-btn-abort" id="ct-abort">Abort / dismiss</button>' +
      '</div></div>';
    document.body.appendChild(wrap);
    document.getElementById('ct-abort').onclick = function () {
      wrap.remove();
    };
  }

  function highlightInPage(address) {
    // Lightweight: mark first text occurrence via TreeWalker would be better; keep simple for MVP
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue && walker.currentNode.nodeValue.indexOf(address) !== -1) {
        nodes.push(walker.currentNode);
      }
    }
    nodes.slice(0, 5).forEach(function (textNode) {
      const parent = textNode.parentNode;
      if (!parent || parent.closest('#cryptotrace-hard-banner, #cryptotrace-hard-modal')) return;
      const span = document.createElement('span');
      span.className = 'ct-addr-flag';
      span.textContent = address;
      const parts = textNode.nodeValue.split(address);
      const frag = document.createDocumentFragment();
      parts.forEach(function (part, i) {
        frag.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) frag.appendChild(span.cloneNode(true));
      });
      parent.replaceChild(frag, textNode);
    });
  }

  async function handleAddress(address) {
    const key = address.toLowerCase();
    if (checked.has(key)) return;
    checked.add(key);
    const hit = await lookup(address);
    if (!hit) return;
    highlightInPage(address);
    showBanner(hit, address);
    if (hit.score >= HARD_THRESHOLD) showModal(hit, address);
    try {
      chrome.runtime.sendMessage({ type: 'CT_HIT', address, hit });
    } catch (_) {}
  }

  function scanText(text) {
    if (!text) return;
    const matches = text.match(ADDR_RE) || [];
    matches.forEach(handleAddress);
  }

  function scanDom() {
    scanText(document.body && document.body.innerText);
  }

  // Initial + mutations (live chat pages)
  scanDom();
  const obs = new MutationObserver(function () {
    scanDom();
  });
  if (document.body) {
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // Clipboard
  document.addEventListener('copy', function () {
    try {
      const t = window.getSelection && String(window.getSelection());
      scanText(t);
    } catch (_) {}
  });
  document.addEventListener('paste', function (e) {
    try {
      const t = e.clipboardData && e.clipboardData.getData('text');
      scanText(t);
    } catch (_) {}
  });
})();
