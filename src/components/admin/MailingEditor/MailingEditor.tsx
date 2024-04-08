import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from './current_build/ckeditor';

import { Alignment } from '@ckeditor/ckeditor5-alignment';

import '@ckeditor/ckeditor5-build-classic/build/translations/uk';
import './MailingEditor.css';
import { EditorConfig } from '@editorjs/editorjs';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import MailingEditorPreviewer from './MailingEditorPreviewer';

const editorConfiguration = {
  placeholder: 'Додайте контент у контейнер та почніть його редагувати 😎',
  removePlugins: ['EasyImage', 'ImageUpload', 'MediaEmbed'],
  language: 'uk',
};

interface IMailingEditorProps {
  setHtmlContent: Dispatch<SetStateAction<string>>;
  htmlContent: string;
  setTitle: Dispatch<SetStateAction<string>>;
  title: string;
  setShortDesc: Dispatch<SetStateAction<string>>;
  shortDesc: string;
  onSubmit: (e: FormEvent) => void;
}
export const MailingEditor = (props: IMailingEditorProps) => {
  const {
    htmlContent,
    setHtmlContent,
    setShortDesc,
    setTitle,
    shortDesc,
    title,
    onSubmit,
  } = props;

  return (
    <div className="p-4">
      <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="title"
            className={`w-fit mb-1 block text-sm font-bold text-gray-700`}
          >
            Тема листа
          </label>
          <div className="relative">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              required
              className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="title"
            className={`w-fit mb-1 block text-sm font-bold text-gray-700`}
          >
            Короткий опис шаблону (для вас)
          </label>
          <div className="relative">
            <input
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              name="shortDescription"
              required
              className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
            />
          </div>
        </div>

        <div className="editor-wrapper p-4">
          <div className="flex text-sm justify-between">
            <div>
              {/* <button className="border border-[#ccced1] border-b-0 px-3 py-1 text-white bg-rose-400 hover:bg-rose-500 transition-colors rounded-tr-lg rounded-tl-lg">
            Редагування
          </button> */}
              {/* <button className="border border-[#ccced1] border-b-0 px-3 py-1 text-white bg-rose-400 hover:bg-rose-500 transition-colors rounded-tr-lg rounded-tl-lg">
            Перегляд
          </button> */}
            </div>
            <button
              type="submit"
              className="border border-[#ccced1] border-b-0 px-3 py-1 text-white bg-rose-400 hover:bg-rose-500 transition-colors rounded-tr-lg rounded-tl-lg"
            >
              Зберегти шаблон
            </button>
          </div>
          <CKEditor
            editor={Editor}
            onReady={(editor) => {
              console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
              console.log(editor.getData());
              setHtmlContent(editor.getData());
            }}
            config={editorConfiguration}
          />
          <div
            className="ck-content mt-4"
            // dangerouslySetInnerHTML={{ __html: editorContent }}
          >
            <MailingEditorPreviewer htmlContent={htmlContent} />
          </div>
        </div>
      </form>
    </div>
  );
};
