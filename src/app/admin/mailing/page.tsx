'use client';

import useToast from "@/hooks/useToast";

const Editor = dynamic(() => import("@/components/admin/EditorMain/Editor/Editor"), {
    ssr: false,
});

const EditorPreview = dynamic(() => import("@/components/admin/EditorMain/EditorPreview/EditorPreview"), {
    ssr: false,
});

import React, {FormEvent, useState} from "react";
import dynamic from "next/dynamic";
import Button from "@/components/UI/Button/Button";
import axios from "axios";
import {useForm} from "react-hook-form";

const Page = () => {
    const [data, setData] = useState({});
    const [title, setTitle] = useState('');
    const {error, info} = useToast();

    const handlerMailing = (e: FormEvent) => {
        e.preventDefault();


        axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/startMailing`, {
            htmlData: data,
            title: title
        }, {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            }, withCredentials: true
        })
            .then((data) => {
                info('Розсилку завершено');
                setTitle('');
                console.log(data.data, data.status)
            })
            .catch(error => console.error(error))
            // .finally(() => setCompleteRequest(true))
    }

    return (
        <form className="px-4 py-4" onSubmit={handlerMailing}>
            {Object.keys(data).length > 0 && (
                <div className="w-fit ml-[60px] mb-6">
                    <Button type="submit" variant="primary" content="Відправити" />
                </div>
            )}
            <div className="flex gap-x-4 justify-between ml-[60px]">
                <div className="bordered flex-1 max-w-[700px]">
                        <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="title"
                                    className={`w-fit mb-1 block text-sm font-bold text-gray-700`}
                                >
                                    Тема
                                </label>
                                <div className="relative">
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`block w-full h-10 text-sm rounded-md shadow-sm pl-4 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                        required
                                    />
                                </div>
                        </div>
                    <hr className="w-full my-6"/>
                    <Editor data={data} setData={setData} title={title}/>
                </div>
                <div className="bordered mx-10 w-[600px] break-words">
                    <EditorPreview data={data}/>
                </div>
            </div>
        </form>
    )
}

export default Page;