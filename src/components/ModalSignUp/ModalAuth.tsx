"use client";
import React, {useContext, useEffect, useState} from "react";
import {ModalContext} from "@/contexts/ModalContext/ModalContext";
import ModalSignUpStep1 from "@/components/ModalSignUp/ModalSignUpStep1";
import ModalSignUpStep2 from "@/components/ModalSignUp/ModalSignUpStep2";
import "react-toastify/dist/ReactToastify.css";
import ModalSignIn from "@/components/ModalSignUp/ModalSignIn";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import {CSSTransition} from "react-transition-group";
import './Modal.scss';
import {AnimatePresence, useMotionValueEvent, useScroll} from "framer-motion";

export type UserFields = {
    name?: string | null;
    email?: string | null;
    profilePhoto?: string | null;
    password?: string | null;
    phone?: string | null;
};

const ModalAuth = () => {
    const {scrollY} = useScroll();
    const {setOpen, isOpen} = useContext(ModalContext);
    const [step, setStep] = useState(isOpen.step);
    const [userFields, setUserFields] = useState<UserFields | undefined>({
        name: "", phone: "", password: "", email: "", profilePhoto: "",
    });
    const [scrollValue, setScrollValue] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        console.log("Page scroll: ", latest)
        setScrollValue(latest);
    });

    const onCloseModalHandler = () => {
        setOpen({step: 1, isOpen: false});
        setStep(1);
        setUserFields({
            name: "", password: "", email: "", phone: "", profilePhoto: "",
        });
    };

    // if (!isOpen.isOpen) {
    //     return null;
    // }


    return (<>
        <AnimatePresence onExitComplete={() => document.body.style.overflow = 'visible'} mode="wait">
            {isOpen.isOpen && (
                <ModalContainer onClose={onCloseModalHandler} isOpen={isOpen.isOpen}
                                headerContent="Створення облікового запису">
                    {isOpen.step === 1 && (
                        <ModalSignUpStep1
                            userFields={userFields}
                            setUserFields={setUserFields}
                            setStep={setOpen}
                            onClose={onCloseModalHandler}
                        />
                    )}

                    {isOpen.step === 2 && (
                        <ModalSignUpStep2
                            onClose={onCloseModalHandler}
                            userFields={userFields}
                            setUserFields={setUserFields}
                            setStep={setOpen}
                        />
                    )}

                    {isOpen.step === 3 && (
                        <ModalSignIn
                            setStep={setOpen}
                            onClose={onCloseModalHandler}
                            userFields={userFields}
                        />
                    )}
                </ModalContainer>
            )}
        </AnimatePresence>
    </>);
};

export default ModalAuth;
