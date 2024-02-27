"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import ModalCreateIC from "@/components/admin/ModalCreateIC/ModalCreateIC";
import ModalUpdateIC from "@/components/admin/ModalUpdateIC/ModalUpdateIC";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useProductsStore } from "@/utils/zustand-store/products";
import Loader from "@/components/Loader/Loader";

interface IIngredient {
  id: string;
  variantID: string;
}

interface IVariant {
  title: string;
  price: string;
  discount: {
    state: boolean;
    percent: string;
  };
  ingredients: Array<{
    ingredient: IIngredient;
    count: string;
  }>;
}

interface Product {
  _id: string;
  image: string;
  title: string;
  categoryID: any;
  price: string;
  variants: IVariant[];
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("_id", {
    header: "№ товару",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("image", {
    header: "",
    cell: (data) => {
      return (
        <div className="h-[50px] w-full flex justify-center">
          <img
            src={`${
              process.env.ADMIN_ENDPOINT_BACKEND
            }/images/m_${data.getValue()}`}
            // src={`http://185.69.155.96:3001/images/${data.getValue()}`}
            alt="Image"
            className="object-cover"
          />
        </div>
      );
    },
    size: 80,
    enableSorting: false,
  }),
  columnHelper.accessor("title", {
    header: "Назва",
    cell: (data) => data.getValue(),
  }),
  columnHelper.accessor("categoryID", {
    header: "Категорія",
    cell: (data) => data.getValue()?.title,
  }),
  columnHelper.accessor("variants", {
    header: "Ціна та знижка",
    cell: (data) => data.getValue(),
    enableSorting: false,
    enableGlobalFilter: false,
  }),
  //     columnHelper.accessor('discount', {
  //     header: 'Знижка', cell: (data) => {
  //         if (data.getValue().state) {
  //             return <span>Активна - <span>{data.getValue().percent}%</span></span>
  //         } else {
  //             return <span>Неактивна</span>
  //         }
  //     }
  // })
];

// columnHelper.accessor('price', {
//     header: 'Ціна', cell: (data) => data.getValue()
// }),

const Page = () => {
  const { addProduct, products, deleteProduct } = useProductsStore();
  const router = useRouter();
  const { error, info } = useToast();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getPData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=1000&page=1&sort=asc&price=0-10000&categories=all`,
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
        addProduct(data.products);
      } catch {
        error("Помилка завантаження дани, оновіть сторінку");
      }
    };

    Promise.all([getPData()]).finally(() => setLoading(false));
  }, []);

  const onDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Ви дійсно хочете видалити запис з бази даних?"
    );

    if (confirmDelete) {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };

      try {
        await axios.delete(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/product/${id}`,
          requestConfig
        );
        deleteProduct(id);
        info("Запис було успішно видалено");
      } catch (err: unknown) {
        const errorObject = err as AxiosError;

        switch (errorObject.response?.status) {
          case 403: {
            error(
              "Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу"
            );
            break;
          }
          default:
            error(`${errorObject.message} - ${errorObject.name}`);
        }
      }
    }
  };

  const onUpdate = (id: string) => {
    router.push(`/admin/products/update?id=${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 p-6 text-[14px]">
      <div className="border-b pb-4">
        <button
          onClick={() => router.push("/admin/products/create")}
          className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors"
        >
          <span>Додати новий запис</span>
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      <div>
        <BasicTable
          isProducts={true}
          data={products}
          columns={columns}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};

export default Page;
