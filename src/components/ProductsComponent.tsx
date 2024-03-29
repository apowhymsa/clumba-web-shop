"use client";

import { FunnelIcon } from "@heroicons/react/24/solid";
import SortSelect from "@/components/Products/SortSelect/SortSelect";
import CategoriesFilter from "@/components/Products/CategoriesFilter/CategoriesFilter";
import Products from "@/components/Products/Products";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/utils/store/hooks";
import { setProducts } from "@/utils/store/productSlice";
import axios from "axios";
import { Category, Product } from "@/types";
import { setCategories } from "@/utils/store/categoriesSlice";
import { SingleValue } from "react-select";
import { useTranslation } from "next-i18next";

type Props = {
  productsData: {
    products: Product[];
    productsCount: number;
  };
  categoriesData: {
    categories: Category[];
    count: number;
  };
};

const ProductsComponent = (props: Props) => {
  const { productsData, categoriesData } = props;
  const [isLoading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [totalCount, setTotalCount] = useState(productsData.productsCount);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const getQueryValue = (key: string) => {
    const params = new URLSearchParams(searchParams);
    return params.get(key);
  };

  const dispatch = useAppDispatch();
  const [filterIsVisible, setFilterVisible] = useState(false);
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>(
    getQueryValue("category")?.split(",") || []
  );
  const [sortFilter, setSortFilter] = useState(getQueryValue("sort") || "1");
  const [priceFilter, setPriceFilter] = useState<string[] | [number, number]>(
    getQueryValue("price")?.split("-") || [0, 10000]
  );

  useEffect(() => {
    dispatch(setProducts(productsData.products));
    dispatch(setCategories(categoriesData));
    setTotalCount(productsData.productsCount);
  }, []);

  const clearAllFilters = () => {
    setSortFilter("1");
    setCategoriesFilter([]);
    setPriceFilter([0, 10000]);
    setFilterVisible(false);
  };

  useEffect(() => {
    const getProductsByFilters = async () => {
      setLoading(true);
      const sort =
        sortFilter === "1"
          ? "asc"
          : sortFilter === "2"
          ? "desc"
          : sortFilter === "3"
          ? "desc"
          : "desc";
      const price = priceFilter.join("-");
      const categories = categoriesFilter.length > 0 ? categoriesFilter : "all";
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=${sort}&price=${price}&categories=${categories}&onlyVisible=true`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      );
      dispatch(setProducts(response.data.products));
      setTotalCount(response.data.productsCount);
    };

    Promise.all([getProductsByFilters()]).then(() => {
      setLoading(false);
    });
  }, [categoriesFilter, sortFilter, priceFilter]);

  useEffect(() => {
    router.replace(
      `${pathname}?${createQueryString(
        "category",
        categoriesFilter.length > 0 ? categoriesFilter.join(",") : "all"
      )}`,
      {
        scroll: false,
      }
    );
  }, [categoriesFilter]);

  useEffect(() => {
    router.replace(`${pathname}?${createQueryString("sort", sortFilter)}`, {
      scroll: false,
    });
  }, [sortFilter]);

  useEffect(() => {
    router.replace(
      `${pathname}?${createQueryString("price", priceFilter.join("-"))}`,
      {
        scroll: false,
      }
    );
  }, [priceFilter]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onChangeSortHandler = (
    newValue: SingleValue<{ value: string; label: string }>
  ) => {
    console.log(newValue?.value);
    setSortFilter(newValue!.value.toString());
  };

  const onChangeFilterCategoriesHandler = (
    e: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const target = e.target as HTMLInputElement;

    if (target.checked) {
      setCategoriesFilter((prev) => [
        ...prev.filter((value) => value !== "all"),
        target.value,
      ]);
    } else {
      const updatedFilter = categoriesFilter.filter(
        (category) => category !== target.value
      );
      setCategoriesFilter(updatedFilter);
    }
  };

  const onChangeFilterPriceHandler = (
    resultValues: [number, number],
    thumbIndex: number
  ) => {
    setPriceFilter(resultValues);
  };

  return (
    <div className="products-page text-dark dark:text-light">
      <div className="page-top">
        <h1 className="font-bold text-xl sm:text-2xl text-white relative z-10">
          {i18n.language === "uk" ? "Квіти" : "Flowers"}
        </h1>
        <h3 className="mt-4 font-normal text-gray-50 relative z-10">
          {i18n.language === "uk"
            ? "Найшвидший спосіб проявити турботу"
            : "The fastest way to show you care"}
        </h3>
      </div>
      <aside className="page-filters xsm:flex-col xsm:gap-y-4">
        <div>
          <div
            className="filters-left flex gap-x-2 items-center"
            role="button"
            onClick={() => setFilterVisible((prev) => !prev)}
          >
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-dark dark:text-light hover:text-rose-400 dark:hover:text-rose-400 transition-colors">
              {i18n.language === "uk" ? "Фільтр" : "Filter"}
            </span>
          </div>
          <span className="filter-divider"></span>
          <span
            className="text-dark dark:text-light hover:text-rose-400 dark:hover:text-rose-400 transition-colors"
            role="button"
            onClick={clearAllFilters}
          >
            {i18n.language === "uk" ? "Очистити все" : "Clear all"}
          </span>
        </div>
        <div>
          <SortSelect
            onChangeHandler={onChangeSortHandler}
            defaultValue={sortFilter}
          />
        </div>
      </aside>
      <CategoriesFilter
        isVisible={filterIsVisible}
        setVisible={setFilterVisible}
        onChangeFilterCategoriesHandler={onChangeFilterCategoriesHandler}
        onChangeFilterPriceHandler={onChangeFilterPriceHandler}
        priceSliderDefaultValue={priceFilter}
        categoriesFilter={categoriesFilter}
      />
      <Products
        isLoading={isLoading}
        totalProductsAmount={totalCount}
        price={priceFilter}
        categories={categoriesFilter}
        sort={sortFilter}
      />
    </div>
  );
};

export default ProductsComponent;
