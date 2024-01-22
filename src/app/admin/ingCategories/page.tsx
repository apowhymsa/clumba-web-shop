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
import {useIngredientCategoriesStore} from "@/utils/zustand-store/ingredientCategories";
import Loader from "@/components/Loader/Loader";
import {AnimatePresence} from "framer-motion";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";

type IngredientCategory = {
    _id: string; title: string;
}

const columnHelper = createColumnHelper<IngredientCategory>();

const columns = [columnHelper.accessor('_id', {
    header: '№ товару', cell: (data) => data.getValue()
}), columnHelper.accessor('title', {
    header: 'Назва', cell: (data) => data.getValue()
})]

const Page = () => {
    const {addIngredientCategory, ingredientCategories, deleteIngredientCategory} = useIngredientCategoriesStore();
    const [isOpenCreateModal, setOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setOpenUpdateModal] = useState(false);
    const [updatingID, setUpdatingID] = useState('');
    const queryClient = useQueryClient()
    const {error, info} = useToast();

    const {data, isLoading} = useQuery({
        queryKey: ['ingredientCategories'], queryFn: async () => {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }

            const {data} = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategories`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*'
                }, withCredentials: true
            })

            addIngredientCategory(data);

            return data;
        }
    });

    const onDelete = async (id: string) => {
        const confirmDelete = confirm('Ви дійсно хочете видалити запис з бази даних?');

        if (confirmDelete) {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }

            try {
                const response = await axios.delete(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategory/${id}`, requestConfig);
                deleteIngredientCategory(response.data._id);
                info('Запис було успішно видалено');
                console.log(id);
            } catch (err: unknown) {
                const errorObject = err as AxiosError;

                switch (errorObject.response?.status) {
                    case 403: {
                        error('Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу');
                        break;
                    }
                    case 409: {
                        error('Видалення неможливе, тому що, ця категорія вже використовується у створеному інгредієнті');
                        break;
                    }
                    default:
                        error(`${errorObject.message} - ${errorObject.name}`)
                }
            }
        }
    }

    const onUpdate = (id: string) => {
        setUpdatingID(id);
        setOpenUpdateModal(true);
    }

    if (isLoading) {
        return <Loader/>
    }

    return (<>
            <div className="flex-1 p-6 text-[14px]">
                <div className="border-b pb-4">
                    <button
                        onClick={() => setOpenCreateModal(!isOpenCreateModal)}
                        className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors">
                        <span>Додати новий запис</span>
                        <PlusIcon className="w-5 h-5 text-white"/>
                    </button>
                </div>
                <BasicTable data={ingredientCategories} columns={columns} onDelete={onDelete} onUpdate={onUpdate}/>
            </div>
            <AnimatePresence onExitComplete={() => document.body.style.overflow = 'visible'}>
                {isOpenCreateModal && (
                    <ModalContainer onClose={() => setOpenCreateModal(false)} isOpen={isOpenCreateModal}>
                        <ModalCreateIC isOpen={isOpenCreateModal} onClose={() => setOpenCreateModal(false)}/>
                    </ModalContainer>)}
                {isOpenUpdateModal && (
                    <ModalContainer onClose={() => setOpenUpdateModal(false)} isOpen={isOpenUpdateModal}>
                        <ModalUpdateIC isOpen={isOpenUpdateModal} onClose={() => setOpenUpdateModal(false)}
                                       id={updatingID}/>
                    </ModalContainer>)}
            </AnimatePresence>
        </>)
}

export default Page;