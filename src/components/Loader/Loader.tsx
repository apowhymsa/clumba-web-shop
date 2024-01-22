import {FC} from "react";
import {clsx} from "clsx";

type Props = {
    variant?: 'primary' | 'secondary'
}

const Loader: FC<Props> = (props) => {
    const {variant = 'primary'} = props;

    return <div className="w-full h-full flex justify-center items-center">
        <span className={clsx("loading loading-spinner", variant === 'primary' ? 'text-rose-400' : 'text-white')}></span>
    </div>
}

export default Loader;