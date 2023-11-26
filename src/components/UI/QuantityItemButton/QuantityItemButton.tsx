"use client";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setQuantity: Dispatch<SetStateAction<number>>;
  quantity: number;
  onClick: () => void;
};
const QuantityItemButton = (props: Props) => {
  const { quantity, setQuantity, onClick } = props;
  return (
    <div className="product-quantity-container flex flex-col gap-y-4 max-w-fit min-w-[220px]">
      <div className="flex gap-x-4">
        <button
          className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-10 h-10 rounded"
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
          className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-rose-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
        />
        <button
          className="flex items-center justify-center bg-rose-400 transition-colors hover:bg-rose-500 w-10 h-10 rounded"
          onClick={() => {
            quantity < 100 && setQuantity((prev) => prev + 1);
          }}
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      <button
        className="bg-rose-400 text-white px-4 py-2 rounded transition-colors hover:bg-rose-500"
        onClick={onClick}
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default QuantityItemButton;
