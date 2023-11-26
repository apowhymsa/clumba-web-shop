import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {FormEvent, FormEventHandler, SyntheticEvent, useEffect, useRef, useState} from "react";
import useDebounce from "@/hooks/useDebounce";
import {useAppDispatch, useAppSelector} from "@/utils/store/hooks";
import {Product} from "@/types";
import {FindProductItem} from "@/components/SearchModal/FindProductItem";
import {collection, onSnapshot} from "@firebase/firestore";
import {db} from "@/utils/firebase/firebase";
import {setComments} from "@/utils/store/commentsSlice";

type Props = {
    onClose: () => void;
    isOpen: boolean;
}

const SearchModal = (props: Props) => {
    const {onClose, isOpen} = props;
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, 300);

    const products = useAppSelector(state => state.productsReducer.products);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'visible';
    }, [isOpen]);

    useEffect(() => {

        if (debouncedSearchValue.trim().length <= 0) {
            setFilteredProducts([]);
            console.log('here')
        } else {
            const filtered = products.filter(product => product.product_name.toLowerCase().trim().includes(debouncedSearchValue.toLowerCase().trim()));
            setFilteredProducts(filtered);
        }
    }, [debouncedSearchValue]);

    if (!isOpen) {
        return null;
    }

    return <div className="absolute w-screen h-screen bg-black bg-opacity-50 top-0 left-0 z-50 backdrop-blur-sm"
                onClick={() => {
                    setSearchValue('');
                    onClose();
                }}>
        <div onClick={(e) => e.stopPropagation()} className="bg-white py-6 px-20">
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
                    setSearchValue('');
                    onClose();
                }} className="transition-colors hover:text-rose-400 cursor-pointer">Отмена</span>
            </div>
            <div>
                <h2 className="text-lg font-medium leading-10">Результаты
                    поиска {filteredProducts.length > 0 && `(${filteredProducts.length})`}</h2>
                <div className="grid grid-cols-2 max-h-[300px] overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                        <span>Товаров не найдено</span>
                    ) : (
                        filteredProducts.map(findProduct => (
                            <FindProductItem key={findProduct.product_id} product={findProduct} onClose={onClose}/>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
}

export {SearchModal};