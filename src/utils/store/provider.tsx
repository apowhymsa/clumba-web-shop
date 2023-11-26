"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {}, []);
  return <Provider store={store}>{children}</Provider>;
}
