'use client';

import {EDITOR_JS_TOOLS} from "@/utils/EDITOR_JS_TOOLS";
import { createReactEditorJS } from "react-editor-js";
import {Dispatch, FC, SetStateAction, useCallback, useRef} from "react";
import './Editor.scss';

type Props = {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
    title: string;
}
const Editor: FC<Props> = (props) => {
    const {setData, data, title} = props;
    const editorCore = useRef<any>(null);
    const ReactEditorJS = createReactEditorJS();

    const handleInitialize = useCallback((instance: any) => {
        // await instance._editorJS.isReady;
        instance._editorJS.isReady
            .then(() => {
                // set reference to editor
                editorCore.current = instance;
            })
            .catch((err: any) => console.log("An error occured", err));
    }, []);

    const handleSave = useCallback(async () => {
        // retrieve data inserted
        const savedData = await editorCore.current.save();
        // save data

        console.log(savedData);
        setData(savedData);
    }, [setData]);

    return (
        <div className="editor-container">
            <ReactEditorJS
                onInitialize={handleInitialize}
                tools={EDITOR_JS_TOOLS}
                onChange={handleSave}
                // defaultValue={data}
            />
        </div>
    );
}

export default Editor;