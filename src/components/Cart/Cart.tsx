import "./Cart.scss";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import QuantityItemButton from "@/components/UI/QuantityItemButton/QuantityItemButton";
import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import CartItem from "@/components/Cart/CartItem/CartItem";
import cartItem from "@/components/Cart/CartItem/CartItem";
import {
  clearCart,
  setCart,
  setCartItem,
  updateUserCart,
} from "@/utils/store/cartSlice";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "@firebase/firestore";
import { auth, db } from "@/utils/firebase/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import Button from "@/components/UI/Button/Button";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "next-i18next";

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};
const Cart = (props: Props) => {
  const { setOpen } = props;
  const { t, i18n } = useTranslation();
  const cart = useAppSelector((state) => state.cartReducer).cart;
  const cartPrice = useAppSelector((state) => state.cartReducer).cartPrice;
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b dark:border-[#1f2937] dark:bg-dark text-dark dark:text-light">
        <div className="font-semibold text-lg">
          {i18n.language === "uk" ? "Кошик" : "Cart"}{" "}
          {cart.length > 0 ? `(${cart.length})` : null}
        </div>
        <div
          className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-6 w-6 text-black dark:text-gray-300" />
        </div>
      </div>
      {cart.length <= 0 ? (
        <p className="px-6 py-4 text-center text-dark dark:text-light">
          {i18n.language === "uk"
            ? "У кошику немає товарів 😔"
            : "No products in the cart 😔"}
        </p>
      ) : (
        <>
          <div className="flex flex-col px-6 py-2 max-h-[300px] overflow-y-auto dark:border-[#1f2937] dark:bg-dark text-dark dark:text-light">
            <div className="flex justify-end">
              <p
                className="w-fit font-medium text-[15px] mb-2 cursor-pointer leading-4 transition-all hover:text-rose-400"
                onClick={() => {
                  dispatch(clearCart());

                  const userID = localStorage.getItem("authUserId");
                  userID && dispatch(updateUserCart(userID));
                }}
              >
                {i18n.language === "uk" ? "Очистити кошик" : "Clear the cart"}
              </p>
            </div>
            {cart.map((cartItem, index) => (
              <div key={index}>
                {cartItem.product && (
                  <>
                    <CartItem
                      cartItem={cartItem}
                      quantityItem={cartItem.quantity}
                    />
                    {index < cart.length - 1 ? (
                      <hr className="my-4 dark:border-dark" />
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-x-10 px-6 py-3 border-t dark:border-[#1f2937] dark:bg-dark text-dark dark:text-light">
            <p className="flex-2">
              {i18n.language === "uk" ? "Всього:" : "Total:"}{" "}
              <span className="font-bold">{cartPrice} ₴</span>
            </p>
            <div className="w-fit">
              <Button
                type="button"
                variant="primary"
                content={i18n.language === "uk" ? "Продовжити" : "Continue"}
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
