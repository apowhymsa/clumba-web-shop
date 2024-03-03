import editorJsHtml from "editorjs-html";

const EditorJsToHtml = editorJsHtml();

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  data: any;
};
const EditorPreview: FC<Props> = (props) => {
  const { data } = props;

  let html: string[] = [];

  if (Object.keys(data).length > 0) {
    html = editorJsHtml().parse(data);
    console.log(html);
  }

  return (
    <div
      className="prose w-[600px]"
      key={data.time}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="bg-[#7B516E] flex flex-col justify-center items-center py-2 rounded-tl-lg rounded-tr-lg">
        <Image
          src="/clumba-logo.svg"
          className="m-0"
          width={100}
          height={100}
          alt="Логотип магазину квітів 'Clubma'"
        />
        <span className="text-white">Магазин квітів</span>
      </div>
      <div className="px-4">
        {Object.keys(data).length > 0 ? (
          html.map((item: any, index: number) => {
            if (typeof item === "string") {
              return (
                <div
                  dangerouslySetInnerHTML={{ __html: item }}
                  key={index}
                ></div>
              );
            }
            return item;
          })
        ) : (
          <p>ДОДАЙТЕ КОНТЕНТ У РЕДАКТОРІ ДЛЯ СТВОРЕННЯ ШАБЛОНУ РОЗСИЛКИ</p>
        )}
      </div>
      <div className="bg-[#d9d9d9] flex flex-col justify-center items-center py-2 rounded-bl-lg rounded-br-lg px-4 relative">
        {/*<Image src="/bottom-image-mailing.svg" className="m-0 absolute bottom-0 right-0 z-1" width={100} height={100} alt="Image"/>*/}
        <div className="flex flex-col justify-center items-center text-[14px]">
          <span className="">Є питання? Наші контакти.</span>
          <div className="flex flex-col items-center">
            <span>
              Телефон:{" "}
              <span className="text-[#2C61EB] underline">+380686560665</span>
            </span>
            <span>
              Електронна адреса:{" "}
              <span className="text-[#2C61EB] underline">
                clumbaeshop@gmail.com
              </span>
            </span>
          </div>
          <span>Бажаємо гарного дня!</span>
        </div>
        <hr className="w-full my-2" />
        <div className="flex flex-col items-center justify-center">
          <Link
            prefetch={false}
            href="https://maps.app.goo.gl/3Y2uQUWv2bfN3Pg26"
            target="_blank"
            className="text-[14px]"
          >
            ул. Владимира Терещенко, 5А
          </Link>
          <ul className="list-none flex text-[14px] m-0 p-0 gap-x-1 relative z-2">
            <li className="flex items-center gap-x-2">
              <Link prefetch={false} href="http://localhost:3000">
                Наш магазин
              </Link>
              <span className="w-[1.5px] h-[15px] bg-gray-400 inline-block"></span>
            </li>
            <li className="flex items-center gap-x-2">
              <Link prefetch={false} href="http://localhost:3000">
                Про нас
              </Link>
              <span className="w-[1.5px] h-[15px] bg-gray-400 inline-block"></span>
            </li>
            <li>
              <Link prefetch={false} href="http://localhost:3000">
                Нові товари
              </Link>
            </li>
          </ul>
          <div>
            <Link
              prefetch={false}
              href="https://www.instagram.com/clumba.krrog"
              className="w-10 h-10"
              title="Наш Instagram"
            >
              <Image
                src="/icons8-instagram.svg"
                alt="Instagram Link Logo"
                className="m-0"
                width={40}
                height={40}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPreview;
