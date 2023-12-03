import React, {ReactNode, useEffect, useState} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";

type Props = {
    onClose: () => void; children: ReactNode
}

const ModalContainer = ({onClose, children}: Props) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    return (<div className="absolute w-screen h-full bg-black bg-opacity-50 top-0 left-0 z-50 backdrop-blur-sm"
                 onClick={onClose}>
            <div
                className="absolute top-1/2 left-1/2 bg-white h-fit w-[500px] -translate-x-1/2 -translate-y-1/2 px-9 py-9 rounded"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="btn-close-modal flex absolute right-5 top-5 cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6 text-black"/>
                </div>
                {children}
            </div>
        </div>)
}

export default ModalContainer;