"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import ModalCreateIC from "@/components/admin/ModalCreateIC/ModalCreateIC";
import ModalUpdateIC from "@/components/admin/ModalUpdateIC/ModalUpdateIC";
import { AnimatePresence } from "framer-motion";
import useToast from "@/hooks/useToast";
import ModalCreateUser from "@/components/admin/ModalCreateUser/ModalCreateUser";
import ModalUpdateUser from "@/components/admin/ModalUpdateUser/ModalUpdateUser";
import { useUsersStore } from "@/utils/zustand-store/users";

type UserPersonals = {
  fullName: string;
  phoneNumber: string;
};

type UserPromo = {
  ordersSummary: string | number;
  bonuses: string | number;
  bonusesPercent: string | number;
};

type User = {
  _id: string;
  email: string;
  personals: UserPersonals;
  promo: UserPromo;
};

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("_id", {
    header: "№",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (data) => data.getValue(),
  }),
  columnHelper.accessor("personals.fullName", {
    header: "Ім`я та прізвище",
    cell: (data) => data.getValue(),
  }),
  columnHelper.accessor("personals.phoneNumber", {
    header: "Номер телефону",
    cell: (data) => data.getValue(),
  }),
  columnHelper.accessor("promo.ordersSummary", {
    header: "Сума покупок",
    cell: (data) => <span>{data.getValue()}₴</span>,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor("promo.bonuses", {
    header: "Бонуси",
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
];

export const dynamic = "force-dynamic";
const Page = () => {
  const queryClient = useQueryClient();
  const { addUser, users, deleteUser } = useUsersStore();
  const [isLoading, setLoading] = useState(true);
  const [isOpenCreateModal, setOpenCreateModal] = useState(false);
  const [isOpenUpdateModal, setOpenUpdateModal] = useState(false);
  const [updatingID, setUpdatingID] = useState("");
  const { error, info } = useToast();

  useEffect(() => {
    async function getUsers() {
      setLoading(true);
      const response = await fetch(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/users`,
        {
          method: "GET",
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
      addUser(data);
    }

    Promise.all([getUsers()]).finally(() => setLoading(false));
  }, []);

  async function onDelete(id: string) {
    const confirmDelete = confirm(
      "Ви дійсно хочете видалити запис з бази даних? Замволення користувача також будуть видалені"
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
          `${process.env.ADMIN_ENDPOINT_BACKEND}/users/${id}`,
          requestConfig
        );
        deleteUser(id);
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
  }
  function onUpdate(id: string) {
    setUpdatingID(id);
    setOpenUpdateModal(true);
  }

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
          data={users}
          columns={columns}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </div>
      <AnimatePresence
        onExitComplete={() => (document.body.style.overflow = "visible")}
      >
        {isOpenCreateModal && (
          <ModalContainer
            containerWidthClass="w-[700px]"
            onClose={() => setOpenCreateModal(false)}
            isOpen={isOpenCreateModal}
          >
            <ModalCreateUser
              isOpen={isOpenCreateModal}
              onClose={() => setOpenCreateModal(false)}
            />
          </ModalContainer>
        )}
        {isOpenUpdateModal && (
          <ModalContainer
            containerWidthClass="w-[700px]"
            onClose={() => setOpenUpdateModal(false)}
            isOpen={isOpenUpdateModal}
          >
            <ModalUpdateUser
              isOpen={isOpenUpdateModal}
              onClose={() => setOpenUpdateModal(false)}
              id={updatingID}
            />
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Page;
