import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext(null);
const STORAGE_KEY = 'storefrontDarkOverride';

// Lets a customer override the header/nav/dropdown chrome's light-or-dark
// look via a toggle in Header, independent of the shop's own template
// branding (e.g. bold-boutique is always-dark by design). The override only
// affects the chrome built in this pass (Header, CartDrawer, ChatWidget,
// BottomTabBar) — each template's own page body keeps its fixed styling.
export function DarkModeProvider({ templateDefault, children }) {
  const [override, setOverride] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? null : stored === '1';
  });

  useEffect(() => {
    if (override === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, override ? '1' : '0');
    }
  }, [override]);

  const dark = override ?? templateDefault;

  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setOverride(!dark) }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
