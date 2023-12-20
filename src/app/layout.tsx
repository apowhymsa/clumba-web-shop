'use client';

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
import {usePathname} from "next/navigation";
import {useEffect, useLayoutEffect, useState} from "react";
import {QueryClientProvider, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {setProducts} from "@/utils/store/productSlice";
import {useAppDispatch} from "@/utils/store/hooks";
import {QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

const comfarta = Comfortaa({ subsets: ["cyrillic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdminRoute, setAdminRoute] = useState(pathname.startsWith('/admin'));

  // useLayoutEffect(() => {
  //   console.log(pathname);
  //   pathname.startsWith('/admin') && setAdminRoute(true);
  // }, [pathname]);

  return (
    <html lang="en">
      <body className={[comfarta.className].join(" ")} data-theme="light">
        <Providers>
          {isAdminRoute ? (
              <>
                <main id="main" className="flex-1">
                  {children}
                </main>
                <ToastContainer />
              </>
          ) : (
              <QueryClientProvider client={queryClient}>
              <NavigationContextProvider>
                <AuthContextProvider>
                  <ModalContextProvider>
                    <Header />
                    <main id="main" className="flex-1">
                      {children}
                    </main>
                    <Footer />
                    <ModalAuth />
                    <ToastContainer />
                  </ModalContextProvider>
                </AuthContextProvider>
              </NavigationContextProvider>
              </QueryClientProvider>
          )}
        </Providers>
      </body>
    </html>
  );
}
