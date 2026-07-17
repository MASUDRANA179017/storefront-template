const queryParams = new URLSearchParams(window.location.search);

// ?shop=slug lets you preview any shop against this same build without rebuilding
// (used by the shop-owner dashboard's live preview iframe). Falls back to the
// build-time env var used by the downloadable, shop-specific production package.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SHOP_SLUG = queryParams.get('shop') || import.meta.env.VITE_SHOP_SLUG;

function errorMessage(data, res) {
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  return data?.message || `Request failed: ${res.status} ${res.statusText}`;
}

async function request(url, { method = 'GET', body, token } = {}) {
  // Without this, Laravel treats the request as a browser page load on
  // validation failure and responds with a redirect instead of JSON.
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(errorMessage(data, res));
  }

  return data;
}

function shopUrl(path) {
  return `${API_BASE_URL}/storefront/${SHOP_SLUG}${path}`;
}

function authUrl(path) {
  return `${API_BASE_URL}/auth${path}`;
}

export const api = {
  getShop: () => request(shopUrl('/')),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(shopUrl(`/products${query ? `?${query}` : ''}`));
  },
  getProduct: (slug) => request(shopUrl(`/products/${slug}`)),
  getCategories: () => request(shopUrl('/categories')),
  getBanners: () => request(shopUrl('/banners')),
  getFlashSale: () => request(shopUrl('/flash-sale')),
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(shopUrl(`/reviews${query ? `?${query}` : ''}`));
  },
  getFaqs: () => request(shopUrl('/faqs')),
  getCoupons: () => request(shopUrl('/coupons')),
  subscribeNewsletter: (email) => request(shopUrl('/newsletter/subscribe'), { method: 'POST', body: { email } }),
  sendChatMessage: (payload, token) => request(shopUrl('/chat'), { method: 'POST', body: payload, token }),
  getChatMessages: (conversationId, guestToken, token) =>
    request(shopUrl(`/chat/${conversationId}${!token && guestToken ? `?guest_token=${guestToken}` : ''}`), { token }),

  getWishlist: (token) => request(shopUrl('/wishlist'), { token }),
  toggleWishlist: (productSlug, token) => request(shopUrl(`/wishlist/${productSlug}`), { method: 'POST', token }),

  getNotifications: (token) => request(shopUrl('/notifications'), { token }),
  markNotificationRead: (id, token) => request(shopUrl(`/notifications/${id}/read`), { method: 'POST', token }),
  markAllNotificationsRead: (token) => request(shopUrl('/notifications/read-all'), { method: 'POST', token }),
  checkout: (payload, token) => request(shopUrl('/checkout'), { method: 'POST', body: payload, token }),
  getOrder: (orderNumber) => request(shopUrl(`/orders/${orderNumber}`)),
  getMyOrders: (token) => request(shopUrl('/account/orders'), { token }),

  register: (payload) => request(authUrl('/register'), { method: 'POST', body: payload }),
  login: (payload) => request(authUrl('/login'), { method: 'POST', body: payload }),
  logout: (token) => request(authUrl('/logout'), { method: 'POST', token }),
  me: (token) => request(authUrl('/me'), { token }),
};
