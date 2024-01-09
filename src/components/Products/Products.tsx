import "./Products.scss";
import {Product} from "@/types";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Products/ProductItem/ProductItem";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import Skeleton from "react-loading-skeleton";
import ProductItemSkeleton from "@/components/Products/ProductItem/ProductItemSkeleton";
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/utils/firebase/firebase";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import axios from "axios";
import {addProducts, setProducts} from "@/utils/store/productSlice";
import Loader from "@/components/Loader/Loader";
import {clsx} from "clsx";
import {useSearchParams} from "next/navigation";
import {current} from "immer";

type Props = {
    isLoading: boolean; totalProductsAmount: number; price: any; sort: any; categories: any;
};
const Products = (props: Props) => {
    const searchParams = useSearchParams()!;
    const products = useAppSelector((state) => state.productsReducer).products;
    const {isLoading, totalProductsAmount, sort, price, categories} = props;
    const skeletonArray = useMemo(() => [0, 0, 0, 0, 0, 0, 0, 0], []);
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [isLoadingNextProductsPage, setLoadingNextProductsPage] = useState(false);

    const getMoreProducts = async (page: number) => {
        setLoadingNextProductsPage(true);
        const sortF = sort === '1' ? 'asc' : sort === '2' ? 'desc' : sort === '3' ? 'desc' : 'desc';
        const priceF = price.join('-');
        const categoriesF = categories.length > 0 ? categories : 'all';
        const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=${page}&sort=${sortF}&price=${priceF}&categories=${categoriesF}`, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            }, withCredentials: true
        });

        dispatch(addProducts(response.data.products));
    }

    useEffect(() => {
        console.log(searchParams)
        setPage(1);
    }, [searchParams]);

    useEffect(() => {
        console.log('proudcts: ', products)
    }, [products]);

    useEffect(() => {
        console.log( 'total:', totalProductsAmount)
    }, [totalProductsAmount]);

    return (<section>
        {isLoading ? (skeletonArray.map(() => (<>
            <ProductItemSkeleton/>
        </>))) : products.length <= 0 ? (<div>Нет товаров по применённым фильтрам</div>) : (<>
            <div className={clsx("products-container", products.length === totalProductsAmount && "pb-12")}>
                {products.map((product) => (<ProductItem key={product._id} product={product}/>))}
            </div>
            {products.length < totalProductsAmount && (isLoadingNextProductsPage ? (
                <div className="my-6">
                    <Loader/>
                </div>
                ) : (
                    <div className="flex items-center justify-center my-6 gap-x-3 cursor-pointer"
                         title="Показати більше товарів"
                         onClick={() => {
                             Promise.all([getMoreProducts(page + 1)]).catch(error => console.log(error)).finally(() => {
                                 setLoadingNextProductsPage(false)
                                 setPage(current => current + 1);
                             });
                         }}
                    >
                        <ArrowPathIcon className="text-rose-400 w-10 h-10"/>
                        <span className="text-[18px] text-rose-400 font-semibold">Показати ще</span>
                    </div>)

            )}
        </>)}
    </section>);
};
export default Products;
