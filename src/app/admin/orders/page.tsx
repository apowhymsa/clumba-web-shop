"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatDate";
import { useOrdersStore } from "@/utils/zustand-store/orders";
import socket from "@/utils/socket";
import { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import clsx from "clsx";

type Order = {
  _id: string;
  userID: string;
  description: string;
  phoneNumber: string;
  userFullName: string;
  shippingAddress: string;
  products: [
    {
      product_id: any;
      productVariant: {
        title: string;
        id: any;
      };
      count: number;
    }
  ];
  payment: {
    status: boolean;
    amount: string;
    liqpayPaymentID: string;
  };
  status: string;
  createdAt: string;
  isViewed: boolean;
};

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor("_id", {
    header: "№ товару",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("isViewed", {
    header: "",
    cell: (data) => {
      return (
        <div>
          {data.getValue() !== true ? (
            <span className="text-green-400 font-semibold">
              Не переглянутий
            </span>
          ) : (
            "Переглянутий"
          )}
        </div>
      );
    },
    enableSorting: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("payment", {
    header: "№ замовлення",
    cell: (data) => {
      return data.getValue()?.liqpayPaymentID;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Дата створення",
    cell: (data) => {
      return formatDate(data.getValue());
    },
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("userFullName", {
    header: "Ім'я та прізвище",
    cell: (data) => data.getValue(),
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Номер телефону",
    cell: (data) => data.getValue(),
  }),
];

const Page = () => {
  const { orders, setOrders, addOrder, setNotViewOrders, notViewedOrders } =
    useOrdersStore();
  const [checked, setChecked] = useState(0);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["orders", checked],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/orders?filter=${queryKey[1]}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );

      setOrders(data.orders);
      setNotViewOrders(data.nowViewedOrders);

      return data;
    },
  });
  useEffect(() => {
    socket.on("update", async (data) => {
      console.log("Real-time update received:", data);
    });
  }, []);

  useEffect(() => {
    console.log("checked", checked);
    queryClient.invalidateQueries({ queryKey: ["orders", checked] });
  }, [checked]);

  const onClickDetails = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  return (
    <div className="flex-1 p-6 text-[14px]">
      <div role="tablist" className="tabs tabs-boxed flex flex-wrap gap-x-3">
        <span
          onClick={() => setChecked(0)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 0 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Усі замовлення
        </span>
        <span
          onClick={() => setChecked(1)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 1 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Нові
        </span>
        <span
          onClick={() => setChecked(2)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 2 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Пакуються
        </span>
        <span
          onClick={() => setChecked(3)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 3 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Доставляються
        </span>
        <span
          onClick={() => setChecked(4)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 4 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Чекають в магазині
        </span>
        <span
          onClick={() => setChecked(5)}
          role="tab"
          className={clsx(
            "tab flex-1 whitespace-nowrap",
            checked === 5 ? "bg-rose-400 text-white" : "bg-white text-[#515762]"
          )}
        >
          Завершені
        </span>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <BasicTable
          onClickDetails={onClickDetails}
          data={orders}
          columns={columns}
          isOrders={true}
        />
      )}
    </div>
  );
};

export default Page;
