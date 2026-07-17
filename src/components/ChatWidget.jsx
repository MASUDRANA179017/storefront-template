import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import { useDarkMode } from '../lib/DarkModeContext';
import { loadChatThread, saveChatThread } from '../lib/chatStorage';

function ChatBubbleIcon({ className = 'w-7 h-7' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.42 1.09 4.61 2.86 6.24-.14 1.4-.68 2.6-1.65 3.55a.5.5 0 00.4.84c1.98-.15 3.6-.83 4.86-1.71A11.6 11.6 0 0012 20c5.52 0 10-4.03 10-9s-4.48-9-10-9z" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

// Floating WhatsApp-style widget so a customer can message the shop owner
// directly. Mounted once at the App root (a sibling of Routes, not nested in
// Header's backdrop-blur) so its fixed positioning is never clipped. Guests
// get a name/phone gate before their first message; the resulting
// conversation id + guest_token are cached per-shop in localStorage so a
// returning guest continues the same thread instead of starting a new one.
export function ChatWidget() {
  const { isAuthenticated, token } = useAuth();
  const { dark } = useDarkMode();
  const [shopName, setShopName] = useState('');
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState(() => loadChatThread());
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [text, setText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    api.getShop().then((res) => setShopName((res.data ?? res)?.name ?? '')).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open || !thread?.conversationId) return;

    setLoading(true);
    setError(null);
    api
      .getChatMessages(thread.conversationId, thread?.guestToken, token)
      .then((res) => setMessages(res.messages ?? []))
      .catch(() => setError('Could not load your conversation.'))
      .finally(() => setLoading(false));
  }, [open, thread?.conversationId, thread?.guestToken, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;

    if (!isAuthenticated && !thread?.conversationId && (!guestName.trim() || !guestPhone.trim())) {
      setError('Please add your name and phone number so the shop can reply.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await api.sendChatMessage(
        {
          message: body,
          conversation_id: thread?.conversationId,
          guest_token: thread?.guestToken,
          name: guestName.trim() || undefined,
          phone: guestPhone.trim() || undefined,
        },
        token
      );

      setMessages(res.messages ?? []);
      setText('');

      if (!isAuthenticated) {
        const nextThread = { conversationId: res.conversation_id, guestToken: res.guest_token };
        setThread(nextThread);
        saveChatThread(nextThread);
      } else if (!thread?.conversationId) {
        setThread({ conversationId: res.conversation_id });
      }
    } catch (err) {
      setError(err.message || 'Could not send your message.');
    } finally {
      setSending(false);
    }
  }

  const panelBg = dark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900';
  const panelBorder = dark ? 'border-white/10' : 'border-gray-200';
  const inputStyle = dark
    ? 'border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-white/40'
    : 'border-gray-200 bg-transparent focus:border-gray-400';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with us'}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-[80] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lifted hover:brightness-105 active:scale-95 transition-all"
      >
        {open ? <CloseIcon className="w-6 h-6" /> : <ChatBubbleIcon />}
      </button>

      {open && (
        <div
          className={`fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-[80] w-[calc(100vw-2rem)] max-w-sm h-[28rem] max-h-[70vh] rounded-2xl shadow-lifted border flex flex-col overflow-hidden ${panelBg} ${panelBorder}`}
        >
          <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#25D366] text-white flex-shrink-0">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ChatBubbleIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{shopName || 'Chat with us'}</p>
              <p className="text-[11px] opacity-90">Usually replies within a day</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5">
            {loading && <p className="text-center text-xs opacity-50 py-4">Loading…</p>}

            {!loading && messages.length === 0 && (
              <p className="text-center text-xs opacity-50 py-4">
                Send a message and the shop owner will reply here.
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.sender_type === 'customer'
                      ? 'bg-[#25D366] text-white'
                      : dark
                      ? 'bg-white/10'
                      : 'bg-gray-100'
                  }`}
                >
                  {m.body}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className={`flex-shrink-0 border-t px-3 py-3 space-y-2 ${panelBorder}`}>
            {error && <p className="text-xs text-red-500">{error}</p>}

            {!isAuthenticated && !thread?.conversationId && (
              <div className="flex gap-2">
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className={`w-1/2 px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${inputStyle}`}
                />
                <input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Phone number"
                  className={`w-1/2 px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${inputStyle}`}
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message…"
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${inputStyle}`}
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                aria-label="Send"
                className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-opacity"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
