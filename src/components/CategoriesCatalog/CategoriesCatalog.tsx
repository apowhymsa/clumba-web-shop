import React, {FC, useEffect, useState} from 'react';
import {Category} from "@/types";
import Image from "next/image";
import './CategoriesCatalog.scss';
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {addCategories, setCategories} from "@/utils/store/categoriesSlice";

type Props = {
    categories: {
        categories: Category[], count: number
    }
}

const CategoriesCatalog: FC<Props> = (props) => {
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const {categories} = props;
    const catProducts = useAppSelector(state => state.categoriesReducer).categories;

    useEffect(() => {
        dispatch(setCategories(categories));
    }, []);

    useEffect(() => {
        console.log(catProducts.categories.length, catProducts.count)
    }, [catProducts]);

    const getMoreProductsCategories = async (page: number) => {
        try {
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=3&page=${page}`);
            dispatch(addCategories(response.data));
        } catch (err) {
            console.log(err);
        }
    }
    return (<>
            <div className="product-category-wrapper grid grid-cols-4 gap-x-8 gap-y-10 items-stretch">
                {catProducts.categories.map(category => (
                    <Link href={`/products?limit=15&page=1&sort=1&price=0-10000&category=${category._id}`}
                          key={category._id}
                          className="product-category-item-container flex flex-col">
                        <div className="product-category-image overflow-hidden">
                            <Image
                                // src={
                                //   product.photo_origin
                                //     ? `https://poster-shop.joinposter.com${product.photo_origin}`
                                //     : "/flower_image.jpg"
                                // }
                                src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${category.image}`}
                                alt={category.title}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                    borderRadius: "8px 8px 0px 0px",
                                    objectPosition: "center center",
                                    aspectRatio: "1 / 1",
                                }}
                                placeholder="blur"
                                blurDataURL="/flower_image.jpg"
                                priority
                            />
                        </div>
                        <span
                            className="flex text-center border py-2 rounded-b-[8px] bg-[#e5e7eb] bg-opacity-20 font-semibold flex-1 items-center justify-center">
                    {category.title}
                </span>
                        <span className="product-category-additional text-center">
                        Натисни для перегляду
                    </span>
                    </Link>))}
            </div>
        {catProducts.categories.length < catProducts.count && (
            <div className="more-products-categories flex items-center justify-center my-6 gap-x-3 cursor-pointer"
                 title="Показати більше категорій"
                 onClick={() => {
                     Promise.all([getMoreProductsCategories(page + 1)]).catch(error => console.log(error)).finally(() => {
                         setPage(current => current + 1);
                     });
                 }}
            >
                <ArrowPathIcon className="text-rose-400 w-10 h-10"/>
                <span className="text-[18px] text-rose-400 font-semibold">Показати більше категорій</span>
            </div>
        )}
        </>)
}

export default CategoriesCatalog;