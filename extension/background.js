/**
 * CryptoTrace Guard — service worker
 * Tracks last hits for the popup badge/status.
 */

const state = { lastHits: [] };

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'CT_HIT') {
    state.lastHits.unshift({
      address: msg.address,
      hit: msg.hit,
      at: new Date().toISOString(),
    });
    state.lastHits = state.lastHits.slice(0, 20);
    chrome.storage.local.set({ lastHits: state.lastHits });
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
    sendResponse({ ok: true });
  }
  if (msg && msg.type === 'CT_GET_HITS') {
    chrome.storage.local.get(['lastHits'], (data) => {
      sendResponse({ hits: data.lastHits || [] });
    });
    return true; // async
  }
});
