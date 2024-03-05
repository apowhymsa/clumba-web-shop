import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import "../Products.scss";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

type Props = {
  product: Product;
  isButtonVisible?: boolean;
};

const ProductItem = ({ product, isButtonVisible = true }: Props) => {
  const [variant, setVariant] = useState(0);
  const { t, i18n } = useTranslation();
  const [isNotAvailableProduct, setNotAvailableProduct] = useState<any[]>([]);
  const [variantsOptions, setVariantsOptions] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("product", product);
    setLoading(true);
    product.variants.map((variant, index) => {
      setVariantsOptions((currentState) => [
        ...currentState,
        {
          value: index,
          label: variant.title,
        },
      ]);

      setNotAvailableProduct((current) => [
        ...current,
        {
          variantID: index,
          value: !!variant.ingredients.find(
            (ing) => Number(ing.ingredient.variantID.count) < Number(ing.count)
          ),
        },
      ]);
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("isNotAvailableProduct", isNotAvailableProduct);
  }, [isNotAvailableProduct]);

  useEffect(() => {
    const currentState = [...isNotAvailableProduct];
    currentState[variant] = {
      variantID: variant,
      value: !!product?.variants[variant].ingredients.find(
        (ing) => Number(ing.ingredient.variantID.count) < Number(ing.count)
      ),
    };
    setNotAvailableProduct([...currentState]);
  }, [variant]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="relative product-item">
      {product.variants[variant].discount.state && (
        <div className="absolute z-10 top-[5px] left-[5px] h-12 w-12 bg-rose-400 flex items-center justify-center rounded-full">
          <span className="text-white text-[14px]">
            -{product.variants[variant].discount.percent} %
          </span>
        </div>
      )}
      <Link
        prefetch={false}
        className="product-image"
        href={`/products/${product._id}`}
      >
        <Image
          src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/m_${product.image}`}
          alt={product.title}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "8px",
            objectPosition: "center center",
            aspectRatio: "1 / 1",
          }}
        />
      </Link>
      <div className="product-description">
        <Link
          prefetch={false}
          href={`/products/${product._id}`}
          className="product-name text-[14px] md:text-[16px]"
          title={product.title}
        >
          {product.title}
        </Link>
      </div>
      <div className="prod-test flex flex-col w-full self-end mt-auto">
        <span
          className={clsx(
            "text-center",
            isNotAvailableProduct[variant]?.value
              ? "text-[14px] text-[#f87171] font-semibold"
              : "text-[#2fb168] text-[14px] font-semibold"
          )}
        >
          {isNotAvailableProduct[variant]?.value
            ? i18n.language === "uk"
              ? "Немає в наявності"
              : "Out of stock"
            : i18n.language === "uk"
            ? "В наявності"
            : "Available"}
        </span>
        <hr className="my-2 w-full dark:border-[#1f2937]" />
        <div className="flex gap-x-2 flex-wrap gap-y-2 justify-center">
          {product?.variants.map((pVariant, index) => (
            <>
              <span
                key={index}
                className={clsx(
                  "text-[12px]",
                  variant === index
                    ? isNotAvailableProduct[index]?.value
                      ? " bg-rose-300 text-white"
                      : " bg-rose-400 text-white"
                    : "text-dark bg-gray-200 dark:bg-gray-300",
                  "flex items-center justify-center px-2 py-2 leading-none rounded cursor-pointer text-[14px]",
                  isNotAvailableProduct[index]?.value && "line-through"
                )}
                onClick={() => setVariant(index)}
              >
                {pVariant.title}
              </span>
            </>
          ))}
        </div>
        <hr className="my-2 w-full dark:border-[#1f2937]" />
        <span className="product-price w-full inline-block text-center">
          {product.variants[variant].discount.state ? (
            <span className="flex gap-x-4 items-center justify-center">
              <span className="line-through text-[14px] text-gray-500">
                &#8372; {product.variants[variant].price}
              </span>
              <span className="font-semibold">
                &#8372;{" "}
                {Number(product.variants[variant].price) -
                  (Number(product.variants[variant].price) *
                    Number(product.variants[variant].discount.percent)) /
                    100}
              </span>
            </span>
          ) : (
            <span>&#8372; {product.variants[variant].price} </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProductItem;
