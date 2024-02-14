"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useToast from "@/hooks/useToast";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "@/utils/formatDate";
import Loader from "@/components/Loader/Loader";
import { useTranslation } from "next-i18next";

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
};

const columnHelper = createColumnHelper<Order>();

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { error } = useToast();
  const { t, i18n } = useTranslation();

  const columns = [
    columnHelper.accessor("_id", {
      header: i18n.language === "uk" ? "№ товару" : "Product №",
      cell: (data) => data.getValue(),
    }),
    columnHelper.accessor("payment", {
      header: i18n.language === "uk" ? "№ замовлення" : "Order №",
      cell: (data) => {
        return data.getValue()?.liqpayPaymentID;
      },
    }),
    columnHelper.accessor("createdAt", {
      header: i18n.language === "uk" ? "Дата створення" : "Date of creation",
      cell: (data) => {
        return formatDate(data.getValue());
      },
    }),
    columnHelper.accessor("description", {
      header: i18n.language === "uk" ? "Опис" : "Description",
      cell: (data) => data.getValue().split(":")[1],
    }),
    columnHelper.accessor("status", {
      header: i18n.language === "uk" ? "Статус замовлення" : "Order status",
      cell: (data) => {
        switch (data.getValue()) {
          case "processing": {
            return (
              <div className="flex justify-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                  {i18n.language === "uk" ? "В обробці" : "In processing"}
                </span>
              </div>
            );
          }
          case "packing": {
            return (
              <div className="flex justify-center">
                <span className="bg-[#d3e5ef] px-2 py-1 rounded text-[#183347]">
                  {i18n.language === "uk" ? "Комплектується" : "Packing"}
                </span>
              </div>
            );
          }
          case "shipping": {
            return (
              <div className="flex justify-center">
                <span className="bg-[#fdecc8] px-2 py-1 rounded text-[#574430]">
                  {i18n.language === "uk" ? "Доставляється" : "Shipping"}
                </span>
              </div>
            );
          }
          case "waiting": {
            return (
              <div className="flex justify-center">
                <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                  {i18n.language === "uk"
                    ? "Очікує в магазині"
                    : "Waiting in shop"}
                </span>
              </div>
            );
          }
          case "complete": {
            return (
              <div className="flex justify-center">
                <span className="bg-[#dbeddb] px-2 py-1 rounded text-[#3f5a49]">
                  {i18n.language === "uk" ? "Завершено" : "Completed"}
                </span>
              </div>
            );
          }
        }
      },
    }),
  ];

  useEffect(() => {
    const getUserOrders = async () => {
      setLoading(true);
      const userID = localStorage.getItem("authUserId");

      if (userID) {
        try {
          const response = await axios.get(
            `${process.env.ADMIN_ENDPOINT_BACKEND}/userOrders/${userID}`,
            {
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                "Access-Control-Allow-Origin": "*",
              },
              withCredentials: true,
            }
          );
          setOrders(response.data);
        } catch (err) {
          console.log(err);
          error(
            i18n.language === "uk"
              ? "Помилка завантаження історії замовлень"
              : "Error loading order history"
          );
        }
      }
    };

    Promise.all([getUserOrders()]).finally(() => setLoading(false));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {orders.length <= 0 ? (
        <div className="flex justify-center">
          {i18n.language === "uk"
            ? "Історія замовлень порожня"
            : "Order history is empty"}
        </div>
      ) : (
        <BasicTable isOrderHistory={true} data={orders} columns={columns} />
      )}
    </div>
  );
};
export default OrderHistory;
