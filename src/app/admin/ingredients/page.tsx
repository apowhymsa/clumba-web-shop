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
import { useIngredientsStore } from "@/utils/zustand-store/ingredients";
import Loader from "@/components/Loader/Loader";

interface IVariants {
  id: {
    vType: string;
    count: string;
  };
}

interface ICategory {
  _id: string;
  title: string;
}

type Ingredient = {
  _id: string;
  title: string;
  categoryID: ICategory;
  variants: IVariants[];
  image: string;
};

const columnHelper = createColumnHelper<Ingredient>();

const columns = [
  columnHelper.accessor("_id", {
    header: "№ товару",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("image", {
    header: "",
    cell: (data) => {
      console.log(data.getValue());
      return (
        <div className="h-[60px] w-full flex justify-center">
          <img
            // src={`${
            //   process.env.ADMIN_ENDPOINT_BACKEND
            // }/images/${data.getValue()}`}
            src={`http://185.69.155.96:3001/images/${data.getValue()}`}
            alt="Image"
            className="object-cover"
          />
        </div>
      );
    },
    size: 80,
    enableSorting: false,
    enableGlobalFilter: false,
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
    header: "Наявна кількість",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
];

const Page = () => {
  const { addIngredient, ingredients, deleteIngredient } =
    useIngredientsStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { error, info } = useToast();

  useEffect(() => {
    const getIngData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredients`,
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
        addIngredient(data);
      } catch {
        error("Помилка завантаження дани, оновіть сторінку");
      }
    };

    Promise.all([getIngData()]).finally(() => setLoading(false));
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
          `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredient/${id}`,
          requestConfig
        );

        deleteIngredient(id);

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
          case 409: {
            error(
              "Видалення неможливе, тому що, цей інгредієнт вже використовується у створеному товарі"
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
    router.push(`/admin/ingredients/update?id=${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 p-6 text-[14px]">
      <div className="border-b pb-4">
        <button
          onClick={() => router.push("/admin/ingredients/create")}
          className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors"
        >
          <span>Додати новий запис</span>
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      <BasicTable
        data={ingredients}
        columns={columns}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default Page;
