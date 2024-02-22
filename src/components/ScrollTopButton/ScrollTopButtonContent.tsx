import { motion } from "framer-motion";
import { ArrowLongUpIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const animateIcon = {
  initial: { top: 16 },
  animate: { top: 6 },
};

type Props = {
  onClick: () => void;
};
const ScrollTopButtonContent: FC<Props> = (props) => {
  const { onClick } = props;

  return (
    <motion.div
      onClick={onClick}
      whileHover="animate"
      initial={{ right: -100 }}
      animate={{ right: 20 }}
      exit={{ right: -100 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="transition-colors hover:bg-rose-500 cursor-pointer fixed flex items-center justify-center z-20 bottom-20 bg-rose-400 w-10 h-10 rounded-full"
    >
      <motion.span
        className="absolute"
        transition={{ type: "spring", stiffness: 100 }}
        variants={animateIcon}
      >
        <ArrowLongUpIcon className="h-4 w-4 text-white" />
      </motion.span>
    </motion.div>
  );
};

export default ScrollTopButtonContent;
