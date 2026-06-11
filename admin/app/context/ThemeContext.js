"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("adminTheme");
    const preferredDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      ?.matches;

    setTheme(storedTheme || (preferredDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === "dark" ? "light" : "dark",
        ),
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within ThemeProvider");
  }
  return context;
};
