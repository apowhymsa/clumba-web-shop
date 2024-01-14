import React, {ReactElement, ReactNode, useEffect, useState} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {CSSTransition} from "react-transition-group";
import './ModalContainer.scss';

type Props = {
    onClose: () => void;
    children: ReactNode;
    headerContent?: string;
    containerWidthClass?: string;
    isOpen: boolean;
}

const ModalContainer = ({onClose, children, headerContent, containerWidthClass, isOpen}: Props) => {
    const [isVisible, setVisible] = useState(false);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        function handleScroll() {
            const scrolledPixels = window.scrollY;
            setScroll(scrolledPixels);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'visible';
    }, [isOpen]);

    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="modal-container"
            unmountOnExit
        >
            <div style={{
                top: `${scroll}px`
            }} className="absolute w-screen min-h-screen bg-black bg-opacity-50 left-0 z-50 backdrop-blur-sm"
                 onMouseDown={onClose}
            >
                <div
                    className={clsx(containerWidthClass ? containerWidthClass : "w-[500px]", "absolute top-1/2 left-1/2 bg-white h-fit -translate-x-1/2 -translate-y-1/2 rounded")}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                        <div className="flex items-center justify-between px-6 py-3 border-b">
                            <div className="font-bold text-lg">{headerContent}</div>
                            <div
                                className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                                onClick={onClose}
                            >
                                <XMarkIcon className="h-6 w-6 text-black"/>
                            </div>
                        </div>
                        <div>
                            {children}
                        </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default ModalContainer;