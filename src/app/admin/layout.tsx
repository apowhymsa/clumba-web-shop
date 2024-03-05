"use client";

import { FC, Profiler, ReactNode, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import NavMenu from "@/components/admin/NavMenu/NavMenu";
import { Inter } from "next/font/google";
import { clsx } from "clsx";
import { usePathname, useRouter } from "next/navigation";
import OrderContextProvider from "@/contexts/OrdersContext/OrdersContextProvider";
import socket from "@/utils/socket";
import { useOrdersStore } from "@/utils/zustand-store/orders";
import useToast from "@/hooks/useToast";
import AdminAuth from "@/components/admin/AdminAuth/AdminAuth";
import Loader from "@/components/Loader/Loader";
import axios from "axios";

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
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
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
    // if (pathname.startsWith("/admin") && !isAuth) router.replace("/admin");

    if (pathname === "/admin" && isAuth) router.replace("/admin/orders");
  }, [pathname, isAuth]);

  useEffect(() => {
    socket.on("connect", async () => {
      console.log("Real-time connected");
    });

    const getAuthenticationStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/admin/isLogged`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 202) {
          setAuth(true);
        }
        console.log(response.status);
      } catch (error) {
        console.log("error", error);
      }
    };

    getAuthenticationStatus().finally(() => setLoading(false));

    return () => {
      console.log("socket disconnected");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function getOrdersChanges(d: any) {
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

      console.log(data);

      addOrder(data);
      updateNotViewOrders();

      info("Надійшло нове замовлення 😀");
    }
    if (isAuth) {
      socket.on("update", getOrdersChanges);

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
    } else {
      socket.off("update");
    }
  }, [isAuth]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className={clsx("bg-[#f1f1f1] min-h-screen", inter.className)}>
      <QueryClientProvider client={queryClient}>
        {isAuth ? (
          <OrderContextProvider>
            <div className={clsx("flex")}>
              <NavMenu setAuth={setAuth} />
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
        ) : (
          <AdminAuth setAuth={setAuth} />
        )}
      </QueryClientProvider>
    </div>
  );
};

export default Layout;
