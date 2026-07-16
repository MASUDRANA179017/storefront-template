export function ContactSection({ shop, className = '' }) {
  if (!shop) return null;

  const { phone, email, address } = shop.branding ?? {};
  if (!phone && !email && !address) return null;

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-3xl mx-auto text-center ${className}`}>
      <h2 className="text-lg sm:text-xl font-bold mb-6">Get in Touch</h2>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {phone && (
          <div className="px-6 py-4 rounded-2xl border border-current/10 min-w-[10rem]">
            <p className="opacity-50 mb-1">Phone</p>
            <a href={`tel:${phone}`} className="font-semibold hover:opacity-70 transition-opacity">
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div className="px-6 py-4 rounded-2xl border border-current/10 min-w-[10rem]">
            <p className="opacity-50 mb-1">Email</p>
            <a href={`mailto:${email}`} className="font-semibold hover:opacity-70 transition-opacity">
              {email}
            </a>
          </div>
        )}
        {address && (
          <div className="px-6 py-4 rounded-2xl border border-current/10 min-w-[10rem]">
            <p className="opacity-50 mb-1">Address</p>
            <p className="font-semibold">{address}</p>
          </div>
        )}
      </div>
    </section>
  );
}
