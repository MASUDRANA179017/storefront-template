import { createContext, useContext, useState } from 'react';

const MobileMenuContext = createContext(null);

// Lets the bottom tab bar's "Menu" button open the exact same drawer as
// Header's hamburger icon — they're separate component instances, so the
// open/close state has to live above both of them.
export function MobileMenuProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ mobileOpen, setMobileOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
