"use client";

import { FC, Profiler, ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavMenu from "@/components/admin/NavMenu/NavMenu";
import {
  Comfortaa,
  Open_Sans,
  Poppins,
  Raleway,
  Roboto,
  Rubik,
  Inter,
} from "next/font/google";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import socket from "@/utils/socket";
import useToast from "@/hooks/useToast";
import NavSideBar from "@/components/admin/NavSideBar/NavSideBar";

type Props = {
  children?: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const inter = Inter({ subsets: ["cyrillic"] });

const Layout: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const { info } = useToast();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Real-time connected");
      // Handle the update as needed
    });

    socket.on("update", (data) => {
      console.log("Real-time update received:", data);
      // Handle the update as needed
      info("Надійшло нове замовлення 😀");
    });

    return () => {
      console.log("socket disconnected");
      socket.disconnect();
    };
  }, []);

  return (
    <div className={clsx("bg-[#f1f1f1] min-h-screen", inter.className)}>
      <QueryClientProvider client={queryClient}>
        <div className={clsx("flex")}>
          <NavMenu />
          <div className="w-full pl-[260px]">
            <div className="flex gap-x-2 text-[16px] shadow p-4 bg-[#f5f5f5] w-full">
              <span>Робоча область: </span>
              {pathname.startsWith("/admin/ingCategories") && (
                <h2 className="font-semibold">Категорії інгредієнтів</h2>
              )}
              {pathname.startsWith("/admin/ingredients") && (
                <h2 className="font-semibold">Інгредієнти</h2>
              )}
              {pathname.startsWith("/admin/productCategories") && (
                <h2 className="font-semibold">Категорії товарів</h2>
              )}
              {pathname.startsWith("/admin/products") && (
                <h2 className="font-semibold">Товари</h2>
              )}
              {pathname.startsWith("/admin/orders") && (
                <h2 className="font-semibold">Замовлення</h2>
              )}
              {pathname.startsWith("/admin/mailing") && (
                <h2 className="font-semibold">Розсилка</h2>
              )}
              {pathname.startsWith("/admin/users") && (
                <h2 className="font-semibold">Користувачі</h2>
              )}
            </div>
            <div>{children}</div>
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
};

export default Layout;
