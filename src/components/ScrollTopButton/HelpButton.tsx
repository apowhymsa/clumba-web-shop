"use client";

import { motion } from "framer-motion";
import {
  ArrowLongUpIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";

type Props = {
  onClick: () => void;
  isOpen: boolean;
};
const HelpButton: FC<Props> = (props) => {
  const { onClick, isOpen } = props;
  const { t, i18n } = useTranslation();

  return (
    <>
      <motion.div
        onClick={onClick}
        className="transition-colors hover:bg-rose-500 right-[20px] cursor-pointer fixed flex items-center justify-center z-30 bottom-5 bg-rose-400 w-10 h-10 rounded-full"
      >
        <motion.span className="absolute">
          <QuestionMarkCircleIcon className="h-6 w-6 text-white" />
        </motion.span>
      </motion.div>
      {isOpen && (
        <div className="fixed z-30 bottom-[20px] right-[85px] bg-light rounded-lg border border-gray-300">
          <div className="relative rounded-lg bottom-0 w-[350px] h-[350px] py-2 bg-light z-30 overflow-y-auto">
            <span className="flex justify-between items-center border-b pb-1 mb-2 px-4">
              <span>Допомога по сайту</span>
              <div
                className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                onClick={onClick}
              >
                <XMarkIcon className="h-6 w-6 text-black" />
              </div>
            </span>
            <div className="px-4 flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-4">
                <details className="group rounded bg-[#e4e6ea] text-dark shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
                  <summary className="flex cursor-pointer list-none items-center py-2 px-4 justify-between text-sm font-medium text-secondary-900">
                    <span className="text-sm">
                      {i18n.language === "uk"
                        ? "Інформація про бонуси"
                        : "Information about bonuses"}
                    </span>
                    <div className="text-secondary-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="block h-4 w-4 transition-all duration-300 group-open:-rotate-90"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
                    <div>
                      <p>
                        Нарахування бонусів відбувається після кожної покупки у
                        нашому магазині.
                      </p>
                      <p>
                        Відсоток нарахування залежить від суми покупок.
                        <span className="font-semibold italic">
                          <p>2%, якщо сума покупок &lt; 10000</p>
                          <p>4%, якщо сума покупок &gt; 10000</p>
                        </span>
                      </p>
                    </div>
                  </div>
                </details>
              </div>
              <div className="flex flex-col gap-y-4">
                <details className="group rounded bg-[#e4e6ea] text-dark shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
                  <summary className="flex cursor-pointer list-none items-center py-2 px-4 justify-between text-sm font-medium text-secondary-900">
                    <span className="text-sm">
                      {i18n.language === "uk"
                        ? "Зв`язатися з нами"
                        : "Contact us"}
                    </span>
                    <div className="text-secondary-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="block h-4 w-4 transition-all duration-300 group-open:-rotate-90"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
                    <div className="py-2 bg-rose-300 px-2 rounded hover:bg-rose-400 transition-colors">
                      <Link
                        prefetch={false}
                        href="https://www.instagram.com/clumba.krrog/"
                        className="flex gap-x-2 items-center"
                        target="_blank"
                      >
                        <Image
                          src="/icons8-instagram.svg"
                          alt="inst logo"
                          width={24}
                          height={24}
                        />
                        <span className="text-light">Instagram</span>
                      </Link>
                    </div>
                    <div className="py-2 bg-blue-300 px-2 rounded hover:bg-blue-400 transition-colors">
                      <Link
                        prefetch={false}
                        href="https://t.me/whymsa"
                        className="flex gap-x-2 items-center"
                        target="_blank"
                      >
                        <Image
                          src="/icons8-telegram.svg"
                          alt="inst logo"
                          width={24}
                          height={24}
                        />
                        <span className="text-light">Telegram</span>
                      </Link>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;
