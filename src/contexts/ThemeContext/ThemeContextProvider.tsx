"use client";

import React, { useEffect, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext/ThemeContext";
import { usePathname } from "next/navigation";

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme") || "light";
    document.documentElement.className = localTheme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
