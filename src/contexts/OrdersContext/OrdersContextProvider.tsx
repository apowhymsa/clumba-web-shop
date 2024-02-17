"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OrdersContext } from "@/contexts/OrdersContext/OrdersContext";
import { useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios from "axios";
import { useOrdersStore } from "@/utils/zustand-store/orders";

const OrderContextProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { info } = useToast();
  const {
    orders,
    setOrders,
    addOrder,
    setNotViewOrders,
    notViewedOrders,
    updateNotViewOrders,
  } = useOrdersStore();

  return (
    <OrdersContext.Provider value={null}>{children}</OrdersContext.Provider>
  );
};

export default OrderContextProvider;
