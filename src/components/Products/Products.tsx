import "./Products.scss";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/Products/ProductItem/ProductItem";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import Skeleton from "react-loading-skeleton";
import ProductItemSkeleton from "@/components/Products/ProductItem/ProductItemSkeleton";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/utils/firebase/firebase";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { addProducts, setProducts } from "@/utils/store/productSlice";
import Loader from "@/components/Loader/Loader";
import { clsx } from "clsx";
import { useSearchParams } from "next/navigation";
import { current } from "immer";
import { useTranslation } from "next-i18next";

type Props = {
  isLoading: boolean;
  totalProductsAmount: number;
  price: any;
  sort: any;
  categories: any;
};
const Products = (props: Props) => {
  const searchParams = useSearchParams()!;
  const products = useAppSelector((state) => state.productsReducer).products;
  const { isLoading, totalProductsAmount, sort, price, categories } = props;
  const skeletonArray = useMemo(() => [0, 0, 0, 0, 0, 0, 0, 0], []);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();
  const [isLoadingNextProductsPage, setLoadingNextProductsPage] =
    useState(false);

  const getMoreProducts = async (page: number) => {
    setLoadingNextProductsPage(true);
    const sortF =
      sort === "1"
        ? "asc"
        : sort === "2"
        ? "desc"
        : sort === "3"
        ? "desc"
        : "desc";
    const priceF = price.join("-");
    const categoriesF = categories.length > 0 ? categories : "all";
    const response = await axios.get(
      `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=${page}&sort=${sortF}&price=${priceF}&categories=${categoriesF}&onlyVisible=true`,
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      }
    );

    dispatch(addProducts(response.data.products));
  };

  useEffect(() => {
    console.log(searchParams);
    setPage(1);
  }, [searchParams]);

  return (
    <section>
      {isLoading ? (
        skeletonArray.map(() => (
          <>
            <ProductItemSkeleton />
          </>
        ))
      ) : products.length <= 0 ? (
        <div>
          {i18n.language === "uk"
            ? "Немає товарів, що відповідають заданим фільтрам"
            : "No products matching the specified filters"}
        </div>
      ) : (
        <>
          <div
            className={clsx(
              "products-container",
              products.length === totalProductsAmount && "pb-12"
            )}
          >
            {products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
          {products.length < totalProductsAmount &&
            (isLoadingNextProductsPage ? (
              <div className="my-6">
                <Loader />
              </div>
            ) : (
              <div
                className="flex items-center justify-center my-6 gap-x-3 cursor-pointer more-products"
                title={
                  i18n.language === "uk"
                    ? "Показати більше товарів"
                    : "Show more products"
                }
                onClick={() => {
                  Promise.all([getMoreProducts(page + 1)])
                    .catch((error) => console.log(error))
                    .finally(() => {
                      setLoadingNextProductsPage(false);
                      setPage((current) => current + 1);
                    });
                }}
              >
                <ArrowPathIcon className="text-rose-400 w-6 h-6" />
                <span className="text-[16px] text-rose-400 font-medium">
                  {i18n.language === "uk" ? "Показати більше" : "Show more"}
                </span>
              </div>
            ))}
        </>
      )}
    </section>
  );
};
export default Products;
