'use client';
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import {useCallback, useEffect, useMemo, useState} from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {PlusIcon} from "@heroicons/react/24/outline";
import ModalCreateIC from "@/components/admin/ModalCreateIC/ModalCreateIC";
import {AxiosError, AxiosRequestConfig} from "axios";
import useToast from "@/hooks/useToast";
import ModalUpdateIC from "@/components/admin/ModalUpdateIC/ModalUpdateIC";
import ModalCreatePC from "@/components/admin/ModalCreatePC/ModalCreatePC";
import ModalUpdatePC from "@/components/admin/ModalUpdatePC/ModalUpdatePC";

type ProductCategory = {
    _id: string; title: string; image: any;
}

const columnHelper = createColumnHelper<ProductCategory>();

const columns = [columnHelper.accessor('_id', {
    header: '№ товару', cell: (data) => data.getValue()
}), columnHelper.accessor('image', {
    header: 'Зображення', cell: (data) => {
        return <div className="h-[60px] w-full flex justify-center">
            <img src={(data.getValue()).data} alt="Image" className="object-cover"/>
        </div>
    }
}),
    columnHelper.accessor('title', {
    header: 'Найменування категорії товару', cell: (data) => data.getValue()
})]

const Page = () => {
    const [isOpenCreateModal, setOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setOpenUpdateModal] = useState<{isOpen: boolean, id: string} | null>(null);
    const queryClient = useQueryClient()
    const {error, info} = useToast();

    const {data, isLoading} = useQuery({
        queryKey: ['productCategories'], queryFn: async () => {
            const {data} = await axios.get('http://localhost:3001/productCategories', {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            })

            return data;
        }
    });

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
                await axios.delete(`http://localhost:3001/productCategory/${id}`, requestConfig);
                await queryClient.invalidateQueries({queryKey: ['productCategories']});
                info('Запис було успішно видалено');
            } catch (err: unknown) {
                const errorObject = err as AxiosError;

                switch (errorObject.response?.status) {
                    case 403: {
                        error('Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу');
                        break;
                    }
                    default: error(`${errorObject.message} - ${errorObject.name}`)
                }
            }
        }
    }

    const onUpdate = (id: string) => {
        setOpenUpdateModal({isOpen: true, id: id});
        // console.log('update', id);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-1 p-6">
            <div className="border-b pb-4">
                <button
                    onClick={() => setOpenCreateModal(!isOpenCreateModal)}
                    className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-10 rounded px-4 transition-colors">
                    <span>Додати новий запис</span>
                    <PlusIcon className="w-6 h-6 text-white"/>
                </button>
            </div>
            <BasicTable data={data} columns={columns} onDelete={onDelete} onUpdate={onUpdate}/>
            {isOpenCreateModal ? <ModalCreatePC onClose={() => setOpenCreateModal(false)}/> : null}
            {isOpenUpdateModal?.isOpen ? <ModalUpdatePC onClose={() => setOpenUpdateModal({isOpen: false, id: ''})} id={isOpenUpdateModal.id}/> : null}
        </div>
    )
}

export default Page;