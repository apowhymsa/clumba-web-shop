'use client';

import {PlusIcon} from "@heroicons/react/24/outline";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import ModalCreateIC from "@/components/admin/ModalCreateIC/ModalCreateIC";
import ModalUpdateIC from "@/components/admin/ModalUpdateIC/ModalUpdateIC";
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {createColumnHelper} from "@tanstack/react-table";
import {useRouter} from "next/navigation";
import {useProductsStore} from "@/utils/zustand-store/products";

interface IIngredient {
    id: string;
    variantID: string;
}

interface IVariant {
    title: string;
    price: string;
    discount: {
        state: boolean, percent: string
    };
    ingredients: Array<{
        ingredient: IIngredient; count: string;
    }>;
}

interface Product {
    _id: string;
    image: any;
    title: string;
    categoryID: any;
    price: string;
    variants: IVariant[];
}

const columnHelper = createColumnHelper<Product>();

const columns = [columnHelper.accessor('_id', {
    header: '№ товару', cell: (data) => data.getValue()
}), columnHelper.accessor('image', {
    header: 'Зображення', cell: (data) => {
        return <div className="h-[60px] w-full flex justify-center">
            <img src={(data.getValue()).data} alt="Image" className="object-cover"/>
        </div>
    },
    meta: {
        col: 'image'
    }
}), columnHelper.accessor('title', {
    header: 'Назва', cell: (data) => data.getValue()
}), columnHelper.accessor('categoryID', {
    header: 'Категорія', cell: (data) => data.getValue()?.title
}), columnHelper.accessor('variants', {
        header: 'Ціна та знижка', cell: (data) => data.getValue()
})
//     columnHelper.accessor('discount', {
//     header: 'Знижка', cell: (data) => {
//         if (data.getValue().state) {
//             return <span>Активна - <span>{data.getValue().percent}%</span></span>
//         } else {
//             return <span>Неактивна</span>
//         }
//     }
// })
]

// columnHelper.accessor('price', {
//     header: 'Ціна', cell: (data) => data.getValue()
// }),

const Page = () => {
    const {addProduct, products, deleteProduct} = useProductsStore();
    const queryClient = useQueryClient()
    const router = useRouter();
    const {error, info} = useToast();

    const {data, isLoading} = useQuery({
        queryKey: ['products'], queryFn: async () => {
            const {data} = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/products`, {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            })
            addProduct(data);

            return data;
        }
    });

    console.log(data);

    const onDelete = async (id: string) => {
        const confirmDelete = confirm('Ви дійсно хочете видалити запис з бази даних?');

        if (confirmDelete) {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }

            try {
                await axios.delete(`${process.env.ADMIN_ENDPOINT_BACKEND}/product/${id}`, requestConfig);
                deleteProduct(id);
                info('Запис було успішно видалено');
            } catch (err: unknown) {
                const errorObject = err as AxiosError;

                switch (errorObject.response?.status) {
                    case 403: {
                        error('Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу');
                        break;
                    }
                    default:
                        error(`${errorObject.message} - ${errorObject.name}`)
                }
            }
        }
    }

    const onUpdate = (id: string) => {
        router.push(`/admin/products/update?id=${id}`);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (<div className="flex-1 p-6 text-[14px]">
        <div className="border-b pb-4">
            <button
                onClick={() => router.push('/admin/products/create')}
                className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors">
                <span>Додати новий запис</span>
                <PlusIcon className="w-5 h-5 text-white"/>
            </button>
        </div>
        <BasicTable isProducts={true} data={products} columns={columns} onDelete={onDelete} onUpdate={onUpdate}/>
    </div>)
}

export default Page;