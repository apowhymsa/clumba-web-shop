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

interface IVariants {
    vType: string;
    price: string;
    count: string;
}

interface ICategory {
    _id: string;
    title: string;
}

type Ingredient = {
    _id: string; title: string; categoryID: ICategory; variants: IVariants[]; image: any;
}

const columnHelper = createColumnHelper<Ingredient>();

const columns = [columnHelper.accessor('_id', {
    header: '№ товару', cell: (data) => data.getValue()
}), columnHelper.accessor('image', {
    header: 'Зображення', cell: (data) => {
        console.log(data.getValue());
        return <div className="h-[60px] w-full flex justify-center">
            <img src={(data.getValue()).data} alt="Image" className="object-cover"/>
        </div>
    }
}), columnHelper.accessor('title', {
    header: 'Найменування інгредієнту', cell: (data) => data.getValue()
}), columnHelper.accessor('categoryID', {
    header: 'Найменування категорії інгредієнту', cell: (data) => data.getValue()?.title
}), columnHelper.accessor('variants', {
    header: 'Наявна кількість типу інгредієнту', cell: (data) => data.getValue()
})]

const Page = () => {
    const queryClient = useQueryClient()
    const router = useRouter();
    const {error, info} = useToast();

    const {data, isLoading} = useQuery({
        queryKey: ['ingredients'], queryFn: async () => {
            const {data} = await axios.get('http://localhost:3001/ingredients', {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            })

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
                await axios.delete(`http://localhost:3001/ingredient/${id}`, requestConfig);
                await queryClient.invalidateQueries({queryKey: ['ingredients']});
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
        router.push(`/admin/ingredients/update?id=${id}`);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (<div className="flex-1 p-6">
        <div className="border-b pb-4">
            <button
                onClick={() => router.push('/admin/products/create')}
                className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-10 rounded px-4 transition-colors">
                <span>Додати новий запис</span>
                <PlusIcon className="w-6 h-6 text-white"/>
            </button>
        </div>
        <BasicTable data={data} columns={columns} onDelete={onDelete} onUpdate={onUpdate}/>
    </div>)
}

export default Page;