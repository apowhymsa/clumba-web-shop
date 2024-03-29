import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";
import "./ModalContainer.scss";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  children: ReactNode;
  headerContent?: string;
  containerWidthClass?: string;
  isOpen: boolean;
  isSearch?: boolean;
};

const ModalContainer = ({
  onClose,
  children,
  headerContent,
  containerWidthClass,
  isOpen,
  isSearch = false,
}: Props) => {
  const { scrollY } = useScroll();
  const [scrollValue, setScrollValue] = useState(0);
  const portalRef = useRef<HTMLElement | null>(null);
  const [isMounted, setMounted] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log("Page scroll: ", latest);
    setScrollValue(latest);
  });

  useEffect(() => {
    portalRef.current =
      document.querySelector<HTMLElement>(".portal-container");
    setMounted(true);
  }, []);

  return (
    isMounted &&
    portalRef.current &&
    createPortal(
      <div className="absolute" style={{ top: `${scrollValue}px` }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationStart={() => (document.body.style.overflow = "hidden")}
          className="absolute w-screen min-h-screen bg-black bg-opacity-50 left-0 z-50 backdrop-blur-sm"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: isSearch ? 0 : "50%" }}
            exit={{ left: "-100%" }}
            transition={{ duration: 0.5, type: "spring" }}
            className={clsx(
              isSearch
                ? "w-full top-0 rounded-bl rounded-br"
                : "top-1/2 -translate-x-1/2 -translate-y-1/2  rounded absolute w-full h-full sm:w-[500px] sm:h-fit",
              "bg-white h-fit",
              containerWidthClass
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div>{children}</div>
          </motion.div>
        </motion.div>
      </div>,
      portalRef.current
    )
  );
};

export default ModalContainer;
