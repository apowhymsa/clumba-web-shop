// Import Swiper React components
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react";
import "./SwiperProduct.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import { Product } from "@/types";
import ProductItem from "@/components/Products/ProductItem/ProductItem";
import { SwiperOptions } from "swiper/types";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import ProductItemSkeleton from "@/components/Products/ProductItem/ProductItemSkeleton";
import Link from "next/link";
import { URL } from "url";

type Props = {
  products: Product[];
  breakpoints: { [p: number]: SwiperOptions; [p: string]: SwiperOptions };
  isLoading: boolean;
  headerText?: string;
  headerLinkText?: string;
  headerLinkHref?: string;
};
const SwiperProducts = (props: Props) => {
  const {
    products,
    breakpoints,
    isLoading,
    headerText,
    headerLinkHref,
    headerLinkText,
  } = props;
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl lg:text-2xl font-medium text-dark dark:text-light">
          {headerText}
        </h2>
        <div className="flex items-center gap-x-10">
          {headerLinkHref && (
            <Link
              href={headerLinkHref}
              className="text-rose-400 flex gap-x-2 text-[14px] lg:text-[16px] hover:underline"
            >
              <span>{headerLinkText}</span>
              {/* <ArrowRightIcon className="h-4 w-4 text-rose-400 hidden sm:block" /> */}
            </Link>
          )}
          {products.length > 4 && (
            <div className="gap-x-2 hidden lg:flex">
              <span
                onClick={() => swiper?.slidePrev()}
                className="cursor-pointer swiper-button-prev flex justify-center items-center rounded w-7 h-7 bg-rose-400 transition-colors hover:bg-rose-500"
              >
                <ChevronLeftIcon className="h-5 w-5 text-white" />
              </span>
              <span
                onClick={() => swiper?.slideNext()}
                className="cursor-pointer swiper-button-next flex justify-center items-center rounded w-7 h-7 bg-rose-400 transition-colors hover:bg-rose-500"
              >
                <ChevronRightIcon className="h-5 w-5 text-white" />
              </span>
            </div>
          )}
        </div>
      </div>
      <Swiper
        spaceBetween={25}
        slidesPerView={4}
        resistanceRatio={0}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => setSwiper(swiper)}
        breakpoints={breakpoints}
        navigation={{
          nextEl: products.length > 4 ? ".swiper-button-next" : null,
          prevEl: products.length > 4 ? ".swiper-button-prev" : null,
        }}
      >
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((value) => (
              <SwiperSlide
                key={value}
                style={{
                  height: "auto",
                }}
              >
                <ProductItemSkeleton />
              </SwiperSlide>
            ))
          : products.map((product) => (
              <SwiperSlide
                key={product._id}
                style={{
                  height: "auto",
                }}
              >
                <ProductItem
                  key={product._id}
                  product={product}
                  isButtonVisible={false}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default SwiperProducts;
