"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Comfortaa, Montserrat, Rubik } from "next/font/google";
import Header from "@/components/Header/Header";
import NavigationContextProvider from "@/contexts/NavigationContext/NavigationContextProvider";
import Providers from "@/utils/store/provider";
import Footer from "@/components/Footer/Footer";
import AuthContextProvider from "@/contexts/AuthContext/AuthContextProvider";
import ModalAuth from "@/components/ModalSignUp/ModalAuth";
import ModalContextProvider from "@/contexts/ModalContext/ModalContextProvider";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import "@/utils/i18n";
import ScrollTopButton from "@/components/ScrollTopButton/ScrollTopButton";
import { useTranslation } from "next-i18next";
import Loader from "@/components/Loader/Loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const comfarta = Comfortaa({ subsets: ["cyrillic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [isAdminRoute, setAdminRoute] = useState(pathname.startsWith("/admin"));
  const [isLoading, setLoading] = useState(true);

  // useLayoutEffect(() => {
  //   console.log(pathname);
  //   pathname.startsWith('/admin') && setAdminRoute(true);
  // }, [pathname]);

  useEffect(() => {
    setLoading(true);

    const defaultLng = localStorage.getItem("selectedLng");

    if (defaultLng) {
      i18n.changeLanguage(defaultLng);
    } else {
      i18n.changeLanguage("uk");
    }

    setLoading(false);
  }, []);

  return (
    <html lang="en">
      <body className={[comfarta.className].join(" ")} data-theme="light">
        <Providers>
          {isAdminRoute ? (
            <>
              <main id="main" className="flex-1">
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
              <NavigationContextProvider>
                <AuthContextProvider>
                  <ModalContextProvider>
                    <Header />
                    <main id="main" className="flex-1">
                      <button
                        onClick={() => {
                          localStorage.setItem("selectedLng", "en");
                          i18n.changeLanguage("en");
                        }}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("selectedLng", "uk");
                          i18n.changeLanguage("uk");
                        }}
                      >
                        UK
                      </button>
                      {children}
                      <div className="portal-container"></div>
                    </main>
                    <Footer />
                    <ModalAuth />
                    <ToastContainer />
                  </ModalContextProvider>
                </AuthContextProvider>
              </NavigationContextProvider>
            </QueryClientProvider>
          )}
          <ScrollTopButton />
        </Providers>
      </body>
    </html>
  );
}
