import { useState } from 'react';

export function FaqSection({ faqs = [], className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (faqs.length === 0) return null;

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-3xl mx-auto ${className}`}>
      <h2 className="text-lg sm:text-xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-2.5">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-2xl border border-current/10 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-current/[0.03] transition-colors"
            >
              <span>{faq.question}</span>
              <span className={`flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {openIndex === i && <p className="px-5 pb-4 text-sm opacity-70 whitespace-pre-line slide-fade-enter">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
