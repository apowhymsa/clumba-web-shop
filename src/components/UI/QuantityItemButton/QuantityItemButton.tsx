"use client";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "next-i18next";

type Props = {
  setQuantity: Dispatch<SetStateAction<number>>;
  quantity: number;
  onClick: () => void;
  isDisabled?: boolean;
};
const QuantityItemButton = (props: Props) => {
  const { quantity, setQuantity, isDisabled, onClick } = props;
  const { t, i18n } = useTranslation();
  return (
    <div className="product-quantity-container flex flex-col gap-y-4 max-w-fit min-w-[220px]">
      <button
        title={
          isDisabled
            ? i18n.language === "uk"
              ? "Ви не можете додати цей варіант товару до кошику, тому що, він відсутній на складі"
              : "You cannot add this product to your cart because it is out of stock"
            : i18n.language === "uk"
            ? "Додати товар до кошику"
            : "Add product to cart"
        }
        disabled={isDisabled}
        className="bg-rose-400 text-white px-4 py-2 text-[14px] rounded transition-colors hover:bg-rose-500 disabled:bg-rose-300 disabled:text-white disabled:border-none disabled:cursor-not-allowed"
        onClick={onClick}
      >
        {i18n.language === "uk" ? "Додати в кошик" : "Add to cart"}
      </button>
    </div>
  );
};

export default QuantityItemButton;
