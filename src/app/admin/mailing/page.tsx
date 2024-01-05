'use client';

import exampleData from "@/utils/EDITOR_JS_TOOLS";

const Editor = dynamic(() => import("@/components/admin/EditorMain/Editor/Editor"), {
    ssr: false,
});

const EditorPreview = dynamic(() => import("@/components/admin/EditorMain/EditorPreview/EditorPreview"), {
    ssr: false,
});

import {useState} from "react";
import dynamic from "next/dynamic";
import Button from "@/components/UI/Button/Button";

const Page = () => {
    const [data, setData] = useState({});

    return (
        <div>
            <p>MAILING</p>
            <div className="flex gap-x-4 justify-between ml-[60px]">
                <div className="bordered flex-1">
                    <Editor data={data} setData={setData} />
                </div>
                <div className="bordered mx-10 w-[600px] break-keep">
                    <EditorPreview data={data}/>
                </div>
            </div>
            <div className="w-fit">
                <Button type="button" variant="primary" content="Відправити" />
            </div>
        </div>
    )
}

export default Page;