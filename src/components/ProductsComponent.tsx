'use client';

import {FunnelIcon} from "@heroicons/react/24/solid";
import SortSelect from "@/components/Products/SortSelect/SortSelect";
import CategoriesFilter from "@/components/Products/CategoriesFilter/CategoriesFilter";
import Products from "@/components/Products/Products";
import React, {useCallback, useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {setProducts} from "@/utils/store/productSlice";
import axios from "axios";
import {Category, Product} from "@/types";
import {setCategories} from "@/utils/store/categoriesSlice";
import {SingleValue} from "react-select";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import Loader from "@/components/Loader/Loader";

type Props = {
    isLoadingData: boolean;
    productsData: {
        products: Product[],
        productsCount: number
    };
    categoriesData: {
        categories: Category[];
        count: number;
    };
}

const ProductsComponent = (props: Props) => {
    const {productsData, categoriesData, isLoadingData} = props;
    const [isLoading, setLoading] = useState(isLoadingData);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(productsData.productsCount);
    const [isClear, setClear] = useState(false);
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
        getQueryValue("category")?.split(",") || [],
    );
    const [sortFilter, setSortFilter] = useState(getQueryValue("sort") || "1");
    const [priceFilter, setPriceFilter] = useState<string[] | [number, number]>(
        getQueryValue("price")?.split("-") || [0, 10000],
    );
    const products = useAppSelector(state => state.productsReducer).products;

    useEffect(() => {
        dispatch(setProducts(productsData.products));
        dispatch(setCategories(categoriesData));
        setTotalCount(productsData.productsCount);
    }, []);

    useEffect(() => {
        if (isClear) {
            setSortFilter("1");
            setCategoriesFilter([]);
            setPriceFilter([0, 10000])
            setFilterVisible(false);
            setClear(false);
        }
    }, [isClear]);

    useEffect(() => {
        const getProductsByFilters = async () => {
            const sort = sortFilter === '1' ? 'asc' : sortFilter === '2' ? 'desc' : sortFilter === '3' ? 'desc' : 'desc';
            const price = priceFilter.join('-');
            const categories = categoriesFilter.length > 0 ? categoriesFilter : 'all';
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products?limit=15&page=1&sort=${sort}&price=${price}&categories=${categories}&onlyVisible=true`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*'
                }, withCredentials: true
            })

            console.log('FILTER SENT');
            dispatch(setProducts(response.data.products));
            setTotalCount(response.data.productsCount);
        }

        Promise.all([getProductsByFilters()]).then(() => {
            setLoading(false)
        })
    }, [categoriesFilter, sortFilter, priceFilter]);

    useEffect(() => {
        console.log("pathname changed");
    }, [pathname]);

    useEffect(() => {
        router.replace(
            `${pathname}?${createQueryString(
                "category",
                categoriesFilter.length > 0 ? categoriesFilter.join(",") : 'all',
            )}`,
            {
                scroll: false,
            },
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
            },
        );
    }, [priceFilter]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams],
    );

    const onChangeSortHandler = (
        newValue: SingleValue<{ value: string; label: string }>,
    ) => {
        console.log(newValue?.value);
        setSortFilter(newValue!.value.toString());
    };

    const onChangeFilterCategoriesHandler = (
        e: React.SyntheticEvent<HTMLInputElement>,
    ) => {
        const target = e.target as HTMLInputElement;

        if (target.checked) {
            setCategoriesFilter((prev) => [...prev.filter(value => value !== 'all'), target.value]);
        } else {
            const updatedFilter = categoriesFilter.filter(
                (category) => category !== target.value,
            );
            setCategoriesFilter(updatedFilter);
        }

        console.log("CHECKED:", target.checked, target.value);
    };

    const onChangeFilterPriceHandler = (
        resultValues: [number, number],
        thumbIndex: number,
    ) => {
        setPriceFilter(resultValues);
    };

    return <div className="products-page">
        <div className="page-top">
            <h1 className="font-bold text-4xl text-white relative z-10">Цветы</h1>
            <h3 className="mt-4 font-normal text-gray-50 relative z-10">
                Самый быстрый способ проявить заботу
            </h3>
        </div>
        <aside className="page-filters">
            <div>
                <div
                    className="filters-left flex gap-x-2 items-center"
                    role="button"
                    onClick={() => setFilterVisible((prev) => !prev)}
                >
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <span>Фильтр</span>
                </div>
                <span className="filter-divider"></span>
                <span
                    className="text-gray-500 transition-colors hover:text-rose-400"
                    role="button"
                    onClick={() => {
                        setClear(true);
                    }}
                >
            Очистить всё
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
        <Products isLoading={isLoading} totalProductsAmount={totalCount} price={priceFilter} categories={categoriesFilter} sort={sortFilter}/>
    </div>
}

export default ProductsComponent;