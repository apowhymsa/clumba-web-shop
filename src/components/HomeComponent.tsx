'use client';

import Link from "next/link";
import {ArrowRightIcon, PresentationChartLineIcon, RocketLaunchIcon} from "@heroicons/react/24/outline";
import SwiperProducts from "@/components/SwiperProducts/SwiperProducts";
import React, {useEffect, useState} from "react";
import {Product} from "@/types";
import {setProducts} from "@/utils/store/productSlice";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import CategoriesCatalog from "@/components/CategoriesCatalog/CategoriesCatalog";

type Props = {
    productsData: any;
    isLoadingData: boolean;
    productsCategories: any;
}
const HomeComponent = (props: Props) => {
    const {isLoadingData, productsData, productsCategories} = props;
    const [isLoading, setLoading] = useState(isLoadingData);
    const dispatch = useAppDispatch();
    const products = useAppSelector(state => state.productsReducer.products);

    useEffect(() => {
        // dispatch(setProducts(productsData))
        // console.log('products', products);
        setLoading(false);
    }, []);

    return <div>
        <div className="page-top">
            {/*<h1 className="font-bold text-4xl text-white relative z-10">Цветы</h1>*/}
            <h3 className="my-[24px] font-bold text-gray-50 text-2xl relative z-10">
                Мы не просто создаем букеты — мы создаем эмоции
            </h3>
        </div>
        <div className="products-popular px-10 my-7 items-center">
            <div className="mb-7 flex justify-between">
                <h3 className="text-2xl font-medium">Популярные товары</h3>
                <Link
                    href="/products?limit=15&page=1&sort=1&price=0-10000&category=all"
                    className="underline text-rose-400 flex gap-x-2 items-center"
                    title="Перейти в каталог товаров"
                >
                    <span>Перейти в каталог</span>
                    <ArrowRightIcon className="h-5 w-5 text-rose-400"/>
                </Link>
            </div>
            <SwiperProducts
                isLoading={isLoading}
                breakpoints={{
                    320: {
                        slidesPerView: 1.3,
                    },
                    485: {
                        slidesPerView: 2.3,
                    },
                    700: {
                        slidesPerView: 3.3,
                    },
                    1000: {
                        slidesPerView: 4.5,
                    },
                }}
                products={productsData.popularProducts.products}
            />
        </div>
        <div className="flex gap-x-16 px-10 justify-center bg-[#e5e7eb] py-10 bg-opacity-50">
            <div className="flex gap-x-3 items-center transition-colors hover:text-rose-400">
                <RocketLaunchIcon className="w-8 h-8 text-black"/>
                <span>Швидка доставка квітів</span>
            </div>
            {/*<span className="w-[1px] h-full bg-[#e5e7eb]">123</span>*/}
            <div className="flex gap-x-3 items-center transition-colors hover:text-rose-400">
                <PresentationChartLineIcon className="w-8 h-8 text-black"/>
                <span>Великий вибір свіжих і красивих квітів</span>
            </div>
        </div>
        <div className="px-10 my-7">
            <div className="mb-7 flex justify-between">
                <h3 className="text-2xl font-medium">Каталог категорій</h3>
            </div>
            <CategoriesCatalog categories={productsCategories}/>
        </div>
        <div className="flex gap-x-16 px-10 justify-center bg-[#e5e7eb] py-10 bg-opacity-50">
            <div className="flex gap-x-3 items-center transition-colors hover:text-rose-400">
                <RocketLaunchIcon className="w-8 h-8 text-black"/>
                <span>Зручні способи оплати</span>
            </div>
            {/*<span className="w-[1px] h-full bg-[#e5e7eb]">123</span>*/}
            <div className="flex gap-x-3 items-center transition-colors hover:text-rose-400">
                <PresentationChartLineIcon className="w-8 h-8 text-black"/>
                <span>Креативні та доброзичливі флористи</span>
            </div>
        </div>
        <div className="products-new px-10 my-7 items-center">
            <div className="mb-7 flex justify-between">
                <h3 className="text-2xl font-medium">Новые товары</h3>
                <Link
                    href="/products?limit=15&page=1&sort=2&price=0-10000&category=all"
                    className="underline text-rose-400 flex gap-x-2 items-center"
                    title="Перейти в каталог товаров"
                >
                    <span>Перейти в каталог</span>
                    <ArrowRightIcon className="h-5 w-5 text-rose-400"/>
                </Link>
            </div>
            <SwiperProducts
                isLoading={isLoading}
                breakpoints={{
                    320: {
                        slidesPerView: 1.3,
                    },
                    485: {
                        slidesPerView: 2.3,
                    },
                    700: {
                        slidesPerView: 3.3,
                    },
                    1000: {
                        slidesPerView: 4.5,
                    },
                }}
                products={productsData.newProducts.products}
            />
        </div>
    </div>
}

export default HomeComponent;