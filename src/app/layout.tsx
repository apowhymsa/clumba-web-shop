"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Raleway } from "next/font/google";
import Header from "@/components/Header/Header";
import NavigationContextProvider from "@/contexts/NavigationContext/NavigationContextProvider";
import Providers from "@/utils/store/provider";
// import Footer from "@/components/Footer/Footer";
const Footer = dynamic(() => import("@/components/Footer/Footer"));
import AuthContextProvider from "@/contexts/AuthContext/AuthContextProvider";
// import ModalAuth from "@/components/ModalSignUp/ModalAuth";
const ModalAuth = dynamic(() => import("@/components/ModalSignUp/ModalAuth"));
// import ModalContextProvider from "@/contexts/ModalContext/ModalContextProvider";
const ModalContextProvider = dynamic(
  () => import("@/contexts/ModalContext/ModalContextProvider")
);
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import "@/utils/i18n";
import ScrollTopButton from "@/components/ScrollTopButton/ScrollTopButton";
import { useTranslation } from "next-i18next";
import Loader from "@/components/Loader/Loader";
import ThemeContextProvider from "@/contexts/ThemeContext/ThemeContextProvider";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const comfarta = Raleway({
  subsets: ["cyrillic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [isAdminRoute, setAdminRoute] = useState(pathname.startsWith("/admin"));
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const defaultLng = localStorage.getItem("selectedLng");

    if (defaultLng) {
      i18n.changeLanguage(defaultLng);
    } else {
      localStorage.setItem("selectedLng", "uk");
      i18n.changeLanguage("uk");
    }

    console.log(isAdminRoute);

    setLoading(false);
  }, []);

  return (
    <html lang={i18n.language} className="light">
      <body className={[comfarta.className].join(" ")}>
        <Providers>
          {isAdminRoute ? (
            <>
              <main id="main" className="flex-1 light">
                {children}
                <div className="portal-container"></div>
              </main>
              <ToastContainer />
            </>
          ) : isLoading ? (
            <div className="w-full h-screen">
              <Loader />
            </div>
          ) : (
            <QueryClientProvider client={queryClient}>
              <ThemeContextProvider>
                <NavigationContextProvider>
                  <AuthContextProvider>
                    <ModalContextProvider>
                      <Header />
                      <main id="main" className="flex-1 bg-light dark:bg-dark">
                        {children}
                        <div className="portal-container"></div>
                      </main>
                      <Footer />
                      <ModalAuth />
                      <ToastContainer />
                    </ModalContextProvider>
                  </AuthContextProvider>
                </NavigationContextProvider>
              </ThemeContextProvider>
            </QueryClientProvider>
          )}
          <ScrollTopButton />
        </Providers>
      </body>
    </html>
  );
}
