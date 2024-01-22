import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {FormEvent, FormEventHandler, SyntheticEvent, useEffect, useRef, useState} from "react";
import useDebounce from "@/hooks/useDebounce";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {Product} from "@/types";
import {FindProductItem} from "@/components/SearchModal/FindProductItem";
import {motion} from 'framer-motion'
import clsx from "clsx";

type Props = {
    onClose: () => void; isOpen: boolean;
}

const SearchModal = (props: Props) => {
    const {onClose, isOpen} = props;
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, 300);

    const products = useAppSelector(state => state.productsReducer.products);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        const searchProducts = async (searchValue: string) => {
            const response = await fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/products-includes?includes=${searchValue}&onlyVisible=true`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*',
                    credentials: 'include'
                }, cache: 'no-store'
            });

            const foundProducts = await response.json();
            setFilteredProducts(foundProducts);
        }
        if (debouncedSearchValue.trim().length <= 0) {
            setFilteredProducts([]);
        } else {
            searchProducts(debouncedSearchValue);
        }
    }, [debouncedSearchValue]);

    if (!isOpen) {
        return null;
    }

    return (<div className="px-6 py-4">
            <div className="relative flex items-center gap-x-6">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500"/>
                </div>
                <input type="text" id="search"
                       className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                       placeholder="Поиск товара..."
                       value={searchValue}
                       onChange={(event) => setSearchValue(event.target.value)}
                />
                <span onClick={() => {
                    onClose();
                }} className="transition-colors hover:text-rose-400 cursor-pointer">Закрити</span>
            </div>
            <div>
                <h2 className="text-lg font-medium leading-10">Результати
                    пошуку {filteredProducts.length > 0 && `(${filteredProducts.length})`}</h2>
                <div className="grid grid-cols-2 max-h-[300px] overflow-y-auto gap-x-4">
                    {filteredProducts.length === 0 ? (
                        <span>Товарів не знайдено</span>) : (filteredProducts.map(findProduct => (
                        <FindProductItem key={findProduct._id} product={findProduct} onClose={onClose}/>)))}
                </div>
            </div>
        </div>)
}

export {SearchModal};