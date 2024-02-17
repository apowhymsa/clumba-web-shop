"use client";

import { FC, Profiler, ReactNode, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
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
import OrderContextProvider from "@/contexts/OrdersContext/OrdersContextProvider";
import socket from "@/utils/socket";
import { useOrdersStore } from "@/utils/zustand-store/orders";
import useToast from "@/hooks/useToast";

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
  const { error, info } = useToast();
  const {
    orders,
    setOrders,
    addOrder,
    setNotViewOrders,
    notViewedOrders,
    updateNotViewOrders,
  } = useOrdersStore();

  useEffect(() => {
    const getNotViewedOrders = async () => {
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/orders?filter=0`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
            credentials: "include",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      setOrders(data.orders);
      setNotViewOrders(data.nowViewedOrders);
    };

    getNotViewedOrders();

    socket.on("connect", async () => {
      console.log("Real-time connected");
    });

    socket.on("update", async (d: any) => {
      console.log("Real-time update received:", d);
      // Handle the update as needed
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/order/${d._id}?ignoreViewed=true`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
            credentials: "include",
          },
          cache: "no-store",
        }
      );

      const data: any = await response.json();

      addOrder(data);
      updateNotViewOrders();

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
        <OrderContextProvider>
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
        </OrderContextProvider>
      </QueryClientProvider>
    </div>
  );
};

export default Layout;
