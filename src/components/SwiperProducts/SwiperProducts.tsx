// Import Swiper React components
import {Swiper, SwiperRef, SwiperSlide, useSwiper} from "swiper/react";
import "./SwiperProduct.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import {Product} from "@/types";
import ProductItem from "@/components/Products/ProductItem/ProductItem";
import {SwiperOptions} from "swiper/types";
import {
    ArrowSmallLeftIcon, ArrowSmallRightIcon,
} from "@heroicons/react/24/outline";
import {useEffect, useRef, useState} from "react";
import type {Swiper as SwiperType} from "swiper";
import ProductItemSkeleton from "@/components/Products/ProductItem/ProductItemSkeleton";

type Props = {
    products: Product[]; breakpoints: { [p: number]: SwiperOptions; [p: string]: SwiperOptions }; isLoading: boolean;
};
const SwiperProducts = (props: Props) => {
    const {products, breakpoints, isLoading} = props;
    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    return (<div className="relative">
            <Swiper
                // style={{
                //     position: "relative",
                // }}
                spaceBetween={25}
                slidesPerView={4}
                resistanceRatio={0}

                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => setSwiper(swiper)}
                breakpoints={breakpoints}
                navigation={{
                    nextEl: products.length > 4 ? '.swiper-button-next' : null, prevEl: products.length > 4 ? '.swiper-button-prev' : null
                }}
            >
                {isLoading ? [1, 2, 3, 4, 5, 6].map((value) => (<SwiperSlide
                        key={value}
                        style={{
                            height: "auto",
                        }}
                    >
                        <ProductItemSkeleton/>
                    </SwiperSlide>)) : products.map((product) => (<SwiperSlide
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
                    </SwiperSlide>))}
                {/*{!isLoading && (*/}
                {/*    products.length > 4 ? (*/}
                {/*        <span*/}
                {/*            onClick={() => swiper?.slideNext()}*/}
                {/*            className="cursor-pointer swiper-button-prev flex justify-center items-center rounded absolute w-12 h-12 bg-rose-400 transition-colors hover:bg-rose-500 right-0 top-2/4 z-20 -translate-y-2/4"*/}
                {/*        >*/}
                {/*            <ArrowSmallRightIcon className="h-6 w-6 text-white"/>*/}
                {/*        </span>*/}
                {/*    ) : null*/}
                {/*)}*/}
            </Swiper>
            {/*{!isLoading && (products.length > 4 ? (*/}
            {/*    */}
            {/*) : null)}*/}
        <>
                    <span
                        onClick={() => swiper?.slidePrev()}
                        className="cursor-pointer top-1/2 -left-[30px] z-20 swiper-button-prev flex justify-center items-center rounded absolute w-10 h-10 bg-rose-400 transition-colors hover:bg-rose-500"
                    >
                        <ArrowSmallLeftIcon className="h-6 w-6 text-white"/>
                    </span>
            <span
                onClick={() => swiper?.slideNext()}
                className="cursor-pointer swiper-button-next flex justify-center items-center rounded absolute w-10 h-10 bg-rose-400 transition-colors hover:bg-rose-500 top-1/2 -right-[30px] z-20"
            >
                        <ArrowSmallRightIcon className="h-6 w-6 text-white"/>
                    </span>
        </>
        </div>);
};

export default SwiperProducts;
