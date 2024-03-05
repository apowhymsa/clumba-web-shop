import "./NavMenu.scss";
import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { FaListUl } from "react-icons/fa6";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineDeliveryDining,
  MdOutlineExitToApp,
  MdOutlineMailOutline,
} from "react-icons/md";
import { TbCheckupList } from "react-icons/tb";
import Link from "next/link";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import Button from "@/components/UI/Button/Button";
import ModalDeliveryPrice from "@/components/admin/ModalDeliveryPrice/ModalDeliveryPrice";
import { AnimatePresence } from "framer-motion";
import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  ListBulletIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useOrdersStore } from "@/utils/zustand-store/orders";
import axios from "axios";

type Props = {
  setAuth: Dispatch<SetStateAction<boolean>>;
};
const NavMenu: FC<Props> = (props) => {
  const { setAuth } = props;
  const [isOpenDeliveryModal, setOpenDeliveryModal] = useState(false);
  const { notViewedOrders } = useOrdersStore();
  const ref = useRef<HTMLLIElement>(null);

  async function logout() {
    try {
      const response = await axios.post(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/admin/logout`,
        null,
        {
          withCredentials: true,
        }
      );
      setAuth(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ul className="fixed h-screen flex flex-col gap-y-2 p-6 bg-[#383f51] gap-x-4 w-[260px] text-[13px]">
        <li
          ref={ref}
          className="flex flex-col rounded active-nav-item gap-x-4 bg-white transition-colors cursor-pointer"
        >
          <div
            className="flex gap-x-4 items-center flex-1 px-4 justify-between py-2 transition-colors hover:bg-rose-200 rounded"
            onClick={() => {
              ref.current?.classList.toggle("active-nav-item");
            }}
          >
            <div className="flex gap-x-4 items-center">
              <ListBulletIcon className="h-4 w-4 text-black" />
              <span>Каталог</span>
            </div>
            <span className="nav-menu-state-icon">
              <MdKeyboardArrowDown />
            </span>
          </div>
          <ul className="submenu flex-col flex px-4">
            <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
              <Link
                prefetch={false}
                href="/admin/ingCategories"
                className="px-4 flex-1 h-10 grid items-center"
              >
                Категорії інгредієнтів
              </Link>
            </li>
            <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
              <Link
                prefetch={false}
                href="/admin/ingredients"
                className="px-4 flex-1 h-10 grid items-center"
              >
                Інгредієнти
              </Link>
            </li>
            <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
              <Link
                prefetch={false}
                href="/admin/productCategories"
                className="px-4 flex-1 h-10 grid items-center"
              >
                Категорії товарів
              </Link>
            </li>
            <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
              <Link
                prefetch={false}
                href="/admin/products"
                className="px-4 flex-1 h-10 grid items-center"
              >
                Товари
              </Link>
            </li>
          </ul>
        </li>
        <li className="relative flex items-center justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200">
          <Link
            prefetch={false}
            href="/admin/orders"
            className="flex gap-x-4 px-4 flex-1 h-10 items-center"
          >
            <span>
              <ClipboardDocumentListIcon className="h-4 w-4 text-black" />
            </span>
            <span>Замовлення</span>
            <span className="text-white pointer-events-none text-[10px] absolute -top-1 -right-2 bg-rose-400 h-7 w-7 rounded-full flex justify-center items-center">
              {notViewedOrders}
            </span>
          </Link>
        </li>
        <li className="flex items-center justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200">
          <Link
            prefetch={false}
            href="/admin/mailing"
            className="flex gap-x-4 px-4 flex-1 h-10 items-center"
          >
            <span>
              <EnvelopeIcon className="h-4 w-4 text-black" />
            </span>
            <span>Розсилка</span>
          </Link>
        </li>
        <li className="flex items-center justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200">
          <Link
            prefetch={false}
            href="/admin/users"
            className="flex gap-x-4 px-4 flex-1 h-10 items-center"
          >
            <span>
              <UserGroupIcon className="h-4 w-4 text-black" />
            </span>
            <span>Користувачі</span>
          </Link>
        </li>
        <li
          onClick={() => setOpenDeliveryModal(true)}
          className="flex items-center justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200"
        >
          <div className="flex gap-x-4 px-4 flex-1 h-10 items-center">
            <span>
              <TruckIcon className="h-4 w-4 text-black" />
            </span>
            <span>Ціна доставки</span>
          </div>
        </li>
        <li
          onClick={logout}
          className="flex mt-auto items-center justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200"
        >
          <div className="flex gap-x-4 px-4 flex-1 h-10 items-center">
            <span>
              <ArrowRightOnRectangleIcon className="h-4 w-4 text-black" />
            </span>
            <span>Вийти з аккаунту</span>
          </div>
        </li>
      </ul>
      <AnimatePresence
        onExitComplete={() => (document.body.style.overflow = "visible")}
      >
        {isOpenDeliveryModal && (
          <ModalContainer
            onClose={() => setOpenDeliveryModal(false)}
            isOpen={isOpenDeliveryModal}
          >
            <ModalDeliveryPrice
              onClose={() => setOpenDeliveryModal(false)}
              isOpen={isOpenDeliveryModal}
            />
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavMenu;
