"use client";

import React, { useEffect, useState } from "react";
import { NavigationContext } from "@/contexts/NavigationContext/NavigationContext";
import { usePathname } from "next/navigation";

const NavigationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [navigation, setNavigation] = useState([false, false, false]);
  const route = usePathname();

  useEffect(() => {
    document.querySelector(".product-cart")?.classList.remove("cart_active");

    switch (route) {
      case "/": {
        setNavigation([true, false, false]);
        break;
      }
      case "/products": {
        setNavigation([false, true, false]);
        break;
      }
      case "/about-us": {
        setNavigation([false, false, true]);
        break;
      }
      default: {
        setNavigation([false, false, false]);
        break;
      }
    }
  }, [route]);

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
