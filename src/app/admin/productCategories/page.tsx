"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { PlusIcon } from "@heroicons/react/24/outline";
import ModalCreateIC from "@/components/admin/ModalCreateIC/ModalCreateIC";
import { AxiosError, AxiosRequestConfig } from "axios";
import useToast from "@/hooks/useToast";
import ModalUpdateIC from "@/components/admin/ModalUpdateIC/ModalUpdateIC";
import ModalCreatePC from "@/components/admin/ModalCreatePC/ModalCreatePC";
import ModalUpdatePC from "@/components/admin/ModalUpdatePC/ModalUpdatePC";
import { useProductCategoriesStore } from "@/utils/zustand-store/productCategories";
import Image from "next/image";
import { processImage } from "@/utils/processImage";
import Loader from "@/components/Loader/Loader";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import { AnimatePresence } from "framer-motion";
import ModalViewProductsByC from "@/components/admin/ModalViewProductsByC/ModalViewProductsByC";

type ProductCategory = {
  _id: string;
  title: string;
  image: string;
};

const columnHelper = createColumnHelper<ProductCategory>();

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
        <div className="h-[60px] w-full flex justify-center">
          <img
            src={`${
              process.env.ADMIN_ENDPOINT_BACKEND
            }/images/${data.getValue()}`}
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
];

const Page = () => {
  const { addProductCategory, productCategories, deleteProductCategory } =
    useProductCategoriesStore();
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setOpenUpdateModal] = useState<{
    isOpen: boolean;
    id: string;
  } | null>(null);
  const [isOpenViewProductsModal, setOpenViewProductsModal] = useState<{
    isOpen: boolean;
    id: string;
    cTitle: string;
  } | null>(null);
  const [isLoading, setLoading] = useState(true);
  const { error, info } = useToast();

  useEffect(() => {
    const getPCData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories`,
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
        console.log("data", data.categories);
        addProductCategory(data.categories);
      } catch {
        error("Помилка завантаження дани, оновіть сторінку");
      }
    };

    Promise.all([getPCData()]).finally(() => setLoading(false));
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
          `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategory/${id}`,
          requestConfig
        );

        deleteProductCategory(id);
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
              "Видалення неможливе, тому що, ця категорія вже використовується у створеному товарі"
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
    setOpenUpdateModal({ isOpen: true, id: id });
    // console.log('update', id);
  };

  const onViewProducts = (id: string, cTitle: string) => {
    setOpenViewProductsModal({ isOpen: true, id: id, cTitle: cTitle });
    console.log(cTitle);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex-1 p-6 text-[14px]">
        <div className="border-b pb-4">
          <button
            onClick={() => setOpenCreateModal(!isOpenCreateModal)}
            className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors"
          >
            <span>Додати новий запис</span>
            <PlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        <BasicTable
          data={productCategories}
          columns={columns}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onViewProducts={onViewProducts}
        />
        {/*{isOpenCreateModal ? <ModalCreatePC isOpen={isOpenCreateModal} onClose={() => setOpenCreateModal(false)}/> : null}*/}
        {/*{isOpenUpdateModal?.isOpen ? <ModalUpdatePC isOpen={isOpenUpdateModal?.isOpen} onClose={() => setOpenUpdateModal({isOpen: false, id: ''})} id={isOpenUpdateModal.id}/> : null}*/}
      </div>
      <AnimatePresence
        onExitComplete={() => (document.body.style.overflow = "visible")}
      >
        {isOpenCreateModal && (
          <ModalContainer
            onClose={() => setOpenCreateModal(false)}
            isOpen={isOpenCreateModal}
          >
            <ModalCreatePC
              isOpen={isOpenCreateModal}
              onClose={() => setOpenCreateModal(false)}
            />
          </ModalContainer>
        )}
        {isOpenUpdateModal?.isOpen && (
          <ModalContainer
            onClose={() => setOpenUpdateModal({ isOpen: false, id: "" })}
            isOpen={isOpenUpdateModal?.isOpen}
          >
            <ModalUpdatePC
              isOpen={isOpenUpdateModal?.isOpen}
              onClose={() => setOpenUpdateModal({ isOpen: false, id: "" })}
              id={isOpenUpdateModal.id}
            />
          </ModalContainer>
        )}
        {isOpenViewProductsModal?.isOpen && (
          <ModalContainer
            onClose={() =>
              setOpenViewProductsModal({ isOpen: false, id: "", cTitle: "" })
            }
            isOpen={isOpenViewProductsModal?.isOpen}
          >
            <ModalViewProductsByC
              isOpen={isOpenViewProductsModal?.isOpen}
              onClose={() =>
                setOpenViewProductsModal({ isOpen: false, id: "", cTitle: "" })
              }
              id={isOpenViewProductsModal.id}
              cTitle={isOpenViewProductsModal.cTitle}
            />
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Page;
