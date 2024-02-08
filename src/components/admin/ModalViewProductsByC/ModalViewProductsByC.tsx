import {XMarkIcon} from "@heroicons/react/24/outline";
import Button from "@/components/UI/Button/Button";
import React, {FC, useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {Product} from "@/types";
import useToast from "@/hooks/useToast";
import Loader from "@/components/Loader/Loader";
import products from "@/components/Products/Products";
import useDebounce from "@/hooks/useDebounce";
import productItem from "@/components/Products/ProductItem/ProductItem";

type Props = {
    onClose: () => void; isOpen: boolean; id: string; cTitle: string;
}
const ModalViewProductsByC: FC<Props> = (props) => {
    const {isOpen, id, cTitle, onClose} = props;
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 250);
    const [isLoading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
    const {error, info} = useToast();

    useEffect(() => {
        console.log('debouncedSearchValue', debouncedSearchValue)
        const filteredProducts = products?.filter(productItem => productItem.title.toLowerCase().includes(debouncedSearchValue.toLowerCase()));
        console.log('filteredProducts', filteredProducts)
        setFilteredProducts(filteredProducts ? filteredProducts : []);
    }, [debouncedSearchValue]);

    useEffect(() => {
        if (isOpen) {
            const getProductsByCategory = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products-by/${id}?limit=1000`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'Access-Control-Allow-Origin': '*'
                        }, withCredentials: true
                    });
                    setProducts(response.data);
                    setFilteredProducts(response.data);
                    console.log(response.data)
                } catch (err: unknown) {
                    const errorObject = err as AxiosError;

                    switch (errorObject.response?.status) {
                        case 500: {
                            error('Не отриманно необхідних даних для оновлення запису, оновіть сторінку та повторіть спробу');
                            break;
                        }
                        default:
                            error(`${errorObject.message} - ${errorObject.name}`)
                    }
                }
            }

            Promise.all([getProductsByCategory()]).finally(() => setLoading(false));
        }
    }, []);

    return (<>
        <div className="flex items-center justify-between px-6 py-3 border-b">
            <div className="font-bold text-lg">Товари категорії - {cTitle}</div>
            <div
                className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                onClick={onClose}
            >
                <XMarkIcon className="h-6 w-6 text-black"/>
            </div>
        </div>
        <div className="px-6 py-1">
            <label
                htmlFor="categoryName"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700`}
            >
                Назва товару
            </label>
            <div className="relative">
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder='Пошук товару за назвою'
                    className={`block w-full text-sm h-8 rounded-md shadow-sm pl-4 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                />
            </div>
        </div>
        <hr className="my-2"/>
        <div className="px-6 py-4 h-[500px] max-h-[500px] overflow-y-auto">
            {isLoading ? <Loader/> : (filteredProducts && filteredProducts?.length <= 0 ? (
                <div>До цієї категорії немає прив`язаних товарів або шуканих товарів</div>) : (
                <div className="flex flex-col gap-y-4">{filteredProducts?.map(productItem => (<>
                    <div key={productItem._id} className="flex gap-x-4">
                        <div className="h-24 w-24">
                            <img src={`http://185.69.155.96:3001/images/${productItem.image}`} alt="Image"
                                 style={{
                                     width: '100%',
                                     height: 'auto',
                                     objectFit: 'cover',
                                     borderRadius: '8px',
                                     objectPosition: 'center center',
                                     aspectRatio: '1 / 1',
                                 }}/>
                        </div>
                        <div className="flex-1">{productItem.title}</div>
                    </div>
                    <hr/>
                </>))}
                </div>))}
        </div>
    </>)
}

export default ModalViewProductsByC;