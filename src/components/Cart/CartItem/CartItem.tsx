import Image from "next/image";
import {MinusIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import {Cart, deleteItem, updateQuantity} from "@/utils/store/cartSlice";
import { useAppDispatch } from "@/utils/store/hooks";
import QuantityItemButton from "@/components/UI/QuantityItemButton/QuantityItemButton";
import useDebounce from "@/hooks/useDebounce";

type Props = {
  cartItem: Cart;
  quantityItem: number;
  inCheckout?: boolean;
};

const CartItem = ({ quantityItem, cartItem, inCheckout = false }: Props) => {
  const [quantity, setQuantity] = useState(quantityItem);
  const debouncedQuantity = useDebounce<number>(quantity, 500);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setQuantity(quantityItem);
  }, [quantityItem]);

  useEffect(() => {
    console.log('debounce update');

    dispatch(
      updateQuantity({
        product: cartItem.product,
        quantity: quantity,
      }),
    );
  }, [debouncedQuantity]);

  return (
    <div
      key={cartItem.product.product_id}
      className="relative cart-item flex gap-x-2 after:absolute after:-bottom-[10px] after:w-full after:h-[0.5px] after:bg-[#e5e7eb]"
    >
      <span className="absolute top-0 right-0 w-5 h-5 cursor-pointer" title="Удалить товар" onClick={() => {
dispatch(deleteItem(cartItem));
      }}>
        <TrashIcon className="h-5 w-5 text-black transition-colors hover:text-rose-400 "/>
      </span>
      <Image
        src={
          cartItem.product.photo
            ? `https://poster-shop.joinposter.com${cartItem.product.photo}`
            : "/flower_image.jpg"
        }
        alt="Product Image"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "100px",
          height: "auto",
          objectFit: "cover",
          borderRadius: "8px",
          objectPosition: "center center",
          aspectRatio: "1 / 1",
        }}
        priority
      />
      <div className="flex flex-col flex-1 justify-between py-5">
        <div className="item-description flex justify-between items-center">
          <span className="text-[15px] overflow-ellipsis max-w-[175px] overflow-hidden whitespace-nowrap" title={cartItem.product.product_name}>{cartItem.product.product_name}</span>
            {!inCheckout && (
                <span className="text-[15px] font-medium">
            &#8372; {cartItem.product.price["1"].slice(0, -2)}
          </span>
            )}
        </div>
          {inCheckout ? (
              <div>
                  <span>Цена: {`${cartItem.quantity} ед. x ${cartItem.product.price["1"].slice(0, -2)} грн = ${cartItem.quantity * Number(cartItem.product.price["1"].slice(0, -2))}`} грн</span>
              </div>
          ) : (
              <div className="item-quantity-edit flex gap-x-4">
                  <button
                      className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-7 h-7 rounded"
                      onClick={() => {
                          quantity > 1 && setQuantity((prev) => prev - 1);
                      }}
                  >
                      <MinusIcon className="h-6 w-6 text-white" />
                  </button>
                  <input
                      value={quantity}
                      onChange={(event) => Number(event.target.value) > 100 ? setQuantity(100): Number(event.target.value) < 1 ? setQuantity(1) : setQuantity(Number(event.target.value))}
                      min={1}
                      max={100}
                      type="number"
                      className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-rose-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 h-7 text-sm"
                  />
                  <button
                      className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-7 h-7 rounded"
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

export default CartItem;
