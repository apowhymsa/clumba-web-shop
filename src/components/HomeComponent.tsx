"use client";

import {
  BuildingStorefrontIcon,
  CreditCardIcon,
  FaceSmileIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import SwiperProducts from "@/components/SwiperProducts/SwiperProducts";
import React, { useEffect } from "react";
// import CategoriesCatalog from "@/components/CategoriesCatalog/CategoriesCatalog";
const CategoriesCatalog = dynamic(
  () => import("@/components/CategoriesCatalog/CategoriesCatalog")
);
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import PopularProducts from "./Home/PopularProducts";

type Props = {
  productsData: any;
  productsCategories: any;
};

const animateIcon = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
};

const HomeComponent = (props: Props) => {
  const { t, i18n } = useTranslation();
  const { productsData, productsCategories } = props;

  return (
    <motion.div>
      <div className="page-top">
        <h3 className="my-[24px] font-semibold text-gray-50 text-xl relative z-10 sm:text-2xl">
          {t("HomeBanner")}
        </h3>
      </div>
      <PopularProducts products={productsData.popularProducts.products} />
      <div className="text-[14px] md:text-[16px] flex flex-col sm:flex-row items-center gap-y-2 gap-x-16 px-5 md:px-10 justify-center bg-[#e5e7eb] dark:bg-[#1f2937] py-4 sm:py-8 bg-opacity-50">
        <motion.div
          initial="initial"
          animate="initial"
          whileHover="animate"
          className="flex gap-x-3 items-center cursor-default"
        >
          <motion.span
            transition={{ type: "spring", stiffness: 50 }}
            variants={animateIcon}
          >
            <RocketLaunchIcon className="w-6 h-6 text-dark dark:text-light" />
          </motion.span>
          <span className="text-dark dark:text-light">
            {i18n.language === "uk"
              ? "Швидка доставка квітів"
              : "Fast flower delivery"}
          </span>
        </motion.div>
        <motion.div
          initial="initial"
          animate="initial"
          whileHover="animate"
          className="flex gap-x-3 items-center cursor-default"
        >
          <motion.span
            transition={{ type: "spring", stiffness: 50 }}
            variants={animateIcon}
          >
            <BuildingStorefrontIcon className="w-6 h-6 text-dark dark:text-light" />
          </motion.span>
          <span className="text-dark dark:text-light">
            {i18n.language === "uk"
              ? "Широкий асортимент свіжих і красивих квітів"
              : "Wide range of fresh and beautiful flowers"}
          </span>
        </motion.div>
      </div>
      <div className="px-5 md:px-10 my-7">
        <div className="mb-7 flex justify-between">
          <h2 className="text-xl lg:text-2xl font-medium text-dark dark:text-light">
            {t("CategoriesCatalog")}
          </h2>
        </div>
        <CategoriesCatalog categories={productsCategories} />
      </div>
      <div className="text-[14px] md:text-[16px] flex flex-col sm:flex-row items-center gap-y-2 gap-x-16 px-5 md:px-10 justify-center bg-[#e5e7eb] dark:bg-[#1f2937] py-4 sm:py-8 bg-opacity-50">
        <motion.div
          initial="initial"
          animate="initial"
          whileHover="animate"
          className="flex gap-x-3 items-center cursor-default"
        >
          <motion.span
            transition={{ type: "spring", stiffness: 50 }}
            variants={animateIcon}
          >
            <CreditCardIcon className="w-6 h-6 text-dark dark:text-light" />
          </motion.span>
          <span className="text-dark dark:text-light">
            {i18n.language === "uk"
              ? "Зручні способи оплати"
              : "Convenient payment options"}
          </span>
        </motion.div>
        <motion.div
          initial="initial"
          animate="initial"
          whileHover="animate"
          className="flex gap-x-3 items-center cursor-default"
        >
          <motion.span
            transition={{ type: "spring", stiffness: 50 }}
            variants={animateIcon}
          >
            <FaceSmileIcon className="w-6 h-6 text-dark dark:text-light" />
          </motion.span>
          <span className="text-dark dark:text-light">
            {i18n.language === "uk"
              ? "Креативні та доброзичливі флористи"
              : "Creative and friendly florists"}
          </span>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="products-new px-5 md:px-10 my-7 items-center text-dark dark:text-light"
      >
        <SwiperProducts
          headerText={(t("NewProducts", { returnObjects: true }) as any).header}
          headerLinkText={
            (t("NewProducts", { returnObjects: true }) as any).next
          }
          headerLinkHref={
            "/products?limit=15&page=1&sort=2&price=0-10000&category=all"
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
          products={productsData.newProducts.products}
        />
      </motion.div>
    </motion.div>
  );
};

export default HomeComponent;
