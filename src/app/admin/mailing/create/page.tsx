'use client';

import useToast from '@/hooks/useToast';

import React, { FormEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/UI/Button/Button';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { MailingEditor } from '@/components/admin/MailingEditor/MailingEditor';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [shortDesc, setShortDesc] = useState('');
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const router = useRouter();
  const { error, info } = useToast();

  const handlerMailing = (e: FormEvent) => {
    e.preventDefault();

    console.log(shortDesc, title, htmlContent);

    axios
      .put(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/mailing`,
        {
          shortDescription: shortDesc,
          html: htmlContent,
          title: title,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*',
          },
          withCredentials: true,
        },
      )
      .then((data) => {
        info('Шаблон було створено');
        router.replace('/admin/mailing');
      })
      .catch((error) => {
        error('Помилка створення: ' + error.message);
        console.error(error);
      });
  };

  return (
    <MailingEditor
      setHtmlContent={setHtmlContent}
      htmlContent={htmlContent}
      title={title}
      setTitle={setTitle}
      shortDesc={shortDesc}
      setShortDesc={setShortDesc}
      onSubmit={handlerMailing}
    />
  );
};

export default Page;
