const queryParams = new URLSearchParams(window.location.search);
const SHOP_SLUG = queryParams.get('shop') || import.meta.env.VITE_SHOP_SLUG;
const STORAGE_KEY = `chat:${SHOP_SLUG}`;

// Guests have no account, so the only way to keep re-opening the same
// conversation (instead of starting a new one every visit) is to remember
// the conversation id + its guest_token locally, scoped per shop.
export function loadChatThread() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function saveChatThread(thread) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thread));
}
