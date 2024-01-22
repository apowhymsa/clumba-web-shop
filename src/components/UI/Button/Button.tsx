import React, {FC, useMemo} from "react";
import {clsx} from "clsx";

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary';

type Props = {
    type: ButtonType;
    variant: ButtonVariant;
    content: string | React.ReactNode;
    isLoading?: boolean;
    onClick?: () => void;
}
const Button: FC<Props> = (props) => {
    const {type, variant, content, isLoading, onClick} = props;

    const className = useMemo(() => clsx('w-full text-sm items-center justify-center h-8 px-4 rounded border border-rose-400 transition-colors disabled:cursor-not-allowed',
        variant === 'primary' && 'text-white bg-rose-400 hover:text-rose-400 hover:bg-white disabled:bg-rose-300 disabled:text-white disabled:border-none',
        variant === 'secondary' && 'text-rose-400 bg-white hover:text-white hover:bg-rose-400 disabled:bg-gray-100 disabled:text-rose-300 disabled:border-rose-300 '
    ), [variant]);

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={isLoading}
            className={className}
        >
            {content}
        </button>
    )
}

export default Button;