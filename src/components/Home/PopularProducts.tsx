"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import SwiperProducts from "../SwiperProducts/SwiperProducts";
import { useTranslation } from "next-i18next";
import { Product } from "@/types";

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts: FC<PopularProductsProps> = (props) => {
  const { t, i18n } = useTranslation();
  const { products } = props;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="products-popular px-5 my-7 items-center md:px-10 text-dark dark:text-light"
    >
      <SwiperProducts
        headerText={
          (t("PopularProducts", { returnObjects: true }) as any).header
        }
        headerLinkText={
          (t("PopularProducts", { returnObjects: true }) as any).next
        }
        headerLinkHref={
          "/products?limit=15&page=1&sort=1&price=0-10000&category=all"
        }
        breakpoints={{
          320: {
            slidesPerView: 1.3,
          },
          485: {
            slidesPerView: 1.5,
          },
          600: {
            slidesPerView: 2.3,
          },
          850: {
            slidesPerView: 3.3,
          },
          1100: {
            slidesPerView: 4.3,
          },
        }}
        products={products}
      />
    </motion.div>
  );
};

export default PopularProducts;
