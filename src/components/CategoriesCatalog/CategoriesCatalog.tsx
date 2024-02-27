import React, { FC, useEffect, useState } from "react";
import { Category } from "@/types";
import Image from "next/image";
import "./CategoriesCatalog.scss";
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/utils/store/hooks";
import { addCategories, setCategories } from "@/utils/store/categoriesSlice";
import { useTranslation } from "next-i18next";
import Loader from "../Loader/Loader";

type Props = {
  categories: {
    categories: Category[];
    count: number;
  };
};

const CategoriesCatalog: FC<Props> = (props) => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { i18n, t } = useTranslation();
  const [isLoadingNextCategoriesPage, setLoadingNextCategoriesPage] =
    useState(false);
  const { categories } = props;
  const catProducts = useAppSelector(
    (state) => state.categoriesReducer
  ).categories;

  useEffect(() => {
    dispatch(setCategories(categories));
  }, []);

  useEffect(() => {
    console.log(catProducts.categories.length, catProducts.count);
  }, [catProducts]);

  const getMoreProductsCategories = async (page: number) => {
    try {
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=4&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );
      dispatch(addCategories(response.data));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="product-category-wrapper grid grid-cols-4 gap-x-8 gap-y-10 items-stretch">
        {catProducts.categories.map((category) => (
          <Link
            href={`/products?limit=15&page=1&sort=1&price=0-10000&category=${category._id}`}
            key={category._id}
            className="product-category-item-container flex flex-col"
          >
            <div className="product-category-image overflow-hidden">
              <img
                src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/m_${category.image}`}
                // src="https://placedog.net/500"
                alt="Image"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                  objectPosition: "center center",
                  aspectRatio: "1 / 1",
                }}
              />
            </div>
            <span className="flex text-center border dark:border-[#1f2937] py-2 rounded-b-[8px] text-dark dark:text-light bg-[#e5e7eb] dark:bg-[#1f2937] bg-opacity-20 font-medium flex-1 items-center justify-center">
              {category.title}
            </span>
            <span className="product-category-additional text-center">
              {i18n?.language === "uk"
                ? "Натисни для перегляду"
                : "Click to view"}
            </span>
          </Link>
        ))}
      </div>
      {catProducts.categories.length < catProducts.count &&
        (isLoadingNextCategoriesPage ? (
          <div className="my-6">
            <Loader />
          </div>
        ) : (
          <div
            className="more-products-categories flex items-center justify-center my-6 gap-x-3 cursor-pointer"
            title={
              i18n.language === "uk"
                ? "Показати більше категорій"
                : "Show more categories"
            }
            onClick={() => {
              setLoadingNextCategoriesPage(true);
              Promise.all([getMoreProductsCategories(page + 1)])
                .catch((error) => console.log(error))
                .finally(() => {
                  setPage((current) => current + 1);
                  setLoadingNextCategoriesPage(false);
                });
            }}
          >
            <ArrowPathIcon className="text-rose-400 w-6 h-6" />
            <span className="text-[16px] text-rose-400 font-medium">
              {i18n?.language === "uk" ? "Показати більше" : "Show more"}
            </span>
          </div>
        ))}
    </>
  );
};

export default CategoriesCatalog;
