'use client';

import Loader from '@/components/Loader/Loader';
import BasicTable from '@/components/admin/BasicTable/BasicTable';
import useToast from '@/hooks/useToast';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Mailing = {
  _id: string;
  title: string;
  shortDescription: string;
  html: string;
};

const columnHelper = createColumnHelper<Mailing>();

const columns = [
  columnHelper.accessor('_id', {
    header: '№ запису',
    cell: (data) => data.getValue(),
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('shortDescription', {
    header: 'Короткий опис шаблону',
    cell: (data) => {
      console.log(data.getValue());
      return data.getValue();
    },
  }),
];

const Page = () => {
  const [mailings, setMailings] = useState<Mailing[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { error, info } = useToast();

  useEffect(() => {
    const getMailingData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/mailing`,
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
              'Access-Control-Allow-Origin': '*',
              credentials: 'include',
            },
            cache: 'no-store',
          },
        );

        const data = await response.json();
        setMailings(data);
      } catch {
        error('Помилка завантаження дани, оновіть сторінку');
      }
    };

    Promise.all([getMailingData()]).finally(() => setLoading(false));
  }, []);

  const onDelete = async (id: string) => {
    const confirmDelete = confirm(
      'Ви дійсно хочете видалити запис з бази даних?',
    );

    if (confirmDelete) {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials: true,
      };

      try {
        await axios.delete(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/mailing/${id}`,
          requestConfig,
        );

        setMailings(mailings.filter((mailing) => mailing._id !== id));

        info('Запис було успішно видалено');
      } catch (err: unknown) {
        const errorObject = err as AxiosError;

        switch (errorObject.response?.status) {
          case 403: {
            error(
              'Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу',
            );
            break;
          }
          default:
            error(`${errorObject.message} - ${errorObject.name}`);
        }
      }
    }
  };

  const onUpdate = (id: string) => {
    router.push(`/admin/mailing/update?id=${id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 p-6 text-[14px]">
      <div className="border-b pb-4">
        <button
          onClick={() => router.push('/admin/mailing/create')}
          className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-800 text-white h-8 rounded px-4 transition-colors"
        >
          <span>Додати новий запис</span>
          <PlusIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      <BasicTable
        data={mailings}
        columns={columns}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default Page;
