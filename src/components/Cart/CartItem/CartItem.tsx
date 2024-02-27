import Image from "next/image";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { memo, useEffect, useState } from "react";
import { Product } from "@/types";
import {
  Cart,
  deleteItem,
  updateQuantity,
  updateUserCart,
} from "@/utils/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import QuantityItemButton from "@/components/UI/QuantityItemButton/QuantityItemButton";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";

type Props = {
  cartItem: Cart;
  quantityItem: number;
  inCheckout?: boolean;
};

const CartItem = ({ quantityItem, cartItem, inCheckout = false }: Props) => {
  const [canIncrement, setCanIncrement] = useState(false);
  const [quantity, setQuantity] = useState(quantityItem);
  const debouncedQuantity = useDebounce<number>(quantity, 500);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cartReducer).cart;

  // useEffect(() => {
  //     console.log('quantity', cartItem.quantity);
  // }, []);

  useEffect(() => {
    console.log("quantity", quantity);
    const setMaxCount = () => {
      let max = 0;
      const itemQuantity = cartItem.quantity;
      const itemVariantID = cartItem.variant._id;

      const cartItemVariant = cartItem.product.variants.find(
        (variant: any) => variant._id === itemVariantID
      );

      if (cartItemVariant) {
        console.log(
          !!cartItemVariant.ingredients.findIndex(
            (ing: any) =>
              Number(ing.ingredient.variantID.count) <
              Number(ing.count) * Number(Number(quantity) + 1)
          )
        );
        setCanIncrement(
          !!cartItemVariant.ingredients.findIndex(
            (ing: any) =>
              Number(ing.ingredient.variantID.count) <
              Number(ing.count) * Number(Number(quantity) + 1)
          )
        );
      }
    };

    setMaxCount();
  }, [quantity]);

  console.log("cart item render");

  useEffect(() => {
    if (quantityItem !== debouncedQuantity) {
      console.log("debounce update!");
      dispatch(
        updateQuantity({
          ...cartItem,
          quantity: quantity,
        })
      );

      const userID = localStorage.getItem("authUserId");

      userID && dispatch(updateUserCart(userID));
    }
  }, [debouncedQuantity]);

  return (
    <div
      key={cartItem.product._id}
      className="relative cart-item flex gap-x-2 text-dark dark:text-light"
    >
      {/*<span className="absolute top-0 right-0 w-5 h-5 cursor-pointer" title="Удалить товар" onClick={() => {*/}
      {/*    dispatch(deleteItem(cartItem));*/}
      {/*}}>*/}
      {/*  <TrashIcon className="h-5 w-5 text-black transition-colors hover:text-rose-400 "/>*/}
      {/*</span>*/}

      {/*<Image src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${cartItem.product.image}`}*/}
      {/*       alt="Product Image"*/}
      {/*       width={0}*/}
      {/*       height={0}*/}
      {/*       sizes="100vw"*/}
      {/*       style={{*/}
      {/*           width: "100px",*/}
      {/*           height: "auto",*/}
      {/*           objectFit: "cover",*/}
      {/*           borderRadius: "8px",*/}
      {/*           objectPosition: "center center",*/}
      {/*           aspectRatio: "1 / 1",*/}
      {/*       }}*/}
      {/*       priority*/}
      {/*/>*/}
      <div className="w-[100px] h-[100px]">
        <img
          src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/m_${cartItem.product.image}`}
          alt="Image"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "8px",
            objectPosition: "center center",
            aspectRatio: "1 / 1",
            margin: 0,
          }}
        />
      </div>
      <div className="flex flex-col flex-1 justify-between gap-y-2">
        <div className="item-description flex justify-between items-center">
          <span
            className="text-[15px] overflow-ellipsis max-w-[175px] overflow-hidden whitespace-nowrap"
            title={`${cartItem.product.title} - ${cartItem.variant.title}`}
          >
            {cartItem.product.title} - {cartItem.variant.title}
          </span>
          <span
            className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700"
            title="Видалити товар з кошику"
            onClick={() => {
              dispatch(deleteItem(cartItem));
              const userID = localStorage.getItem("authUserId");

              userID && dispatch(updateUserCart(userID));
            }}
          >
            <TrashIcon className="w-5 h-5 text-white" />
          </span>
        </div>
        <div className="flex justify-end">
          {!inCheckout &&
            (cartItem.variant.discount.state ? (
              <span className="flex gap-x-2 items-center">
                <span className="line-through text-[14px] text-gray-500">
                  &#8372; {cartItem.variant.price}
                </span>
                <span className="font-semibold">
                  &#8372;{" "}
                  {Number(cartItem.variant.price) -
                    (Number(cartItem.variant.price) *
                      Number(cartItem.variant.discount.percent)) /
                      100}
                </span>
              </span>
            ) : (
              <span>&#8372; {cartItem.variant.price} </span>
            ))}
        </div>
        {inCheckout ? (
          <div>
            <span>
              Цена:{" "}
              {`${cartItem.quantity} ед. x ${
                !cartItem.variant.discount.state
                  ? cartItem.variant.price
                  : Number(cartItem.variant.price) -
                    (Number(cartItem.variant.price) *
                      Number(cartItem.variant.discount.percent)) /
                      100
              } грн = ${
                !cartItem.variant.discount.state
                  ? cartItem.quantity * Number(cartItem.variant.price)
                  : cartItem.quantity *
                    (Number(cartItem.variant.price) -
                      (Number(cartItem.variant.price) *
                        Number(cartItem.variant.discount.percent)) /
                        100)
              }`}{" "}
              грн
            </span>
          </div>
        ) : (
          <div className="item-quantity-edit flex gap-x-4 w-fit items-center">
            <button
              className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-7 h-7 rounded"
              onClick={() => {
                quantity > 1 && setQuantity((prev) => prev - 1);
              }}
            >
              <MinusIcon className="h-6 w-6 text-white" />
            </button>
            <span className="text-[14px] leading-none w-[20px] text-center">
              {quantity}
            </span>
            {/*<input*/}
            {/*    value={quantity}*/}
            {/*    onChange={(event) => Number(event.target.value) > 100 ? setQuantity(100) : Number(event.target.value) < 1 ? setQuantity(1) : setQuantity(Number(event.target.value))}*/}
            {/*    min={1}*/}
            {/*    max={100}*/}
            {/*    type="number"*/}
            {/*    className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-rose-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 h-7 text-sm"*/}
            {/*/>*/}
            <button
              disabled={!canIncrement}
              className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-7 h-7 rounded disabled:bg-rose-300 disabled:text-white disabled:border-none disabled:cursor-not-allowed"
              onClick={() => {
                quantity < 100 && setQuantity((prev) => prev + 1);
              }}
            >
              <PlusIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CartItem);
