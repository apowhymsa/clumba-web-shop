'use client';

import clsx from "clsx";
import {Dispatch, SetStateAction, useState} from "react";
import './ProfileHeader.scss';

type Props = {
    checked: boolean[];
    setChecked: Dispatch<SetStateAction<boolean[]>>;
}
const ProfileHeader = (props: Props) => {
    const {checked, setChecked} = props;
    return <div role="tablist" className="tabs tabs-boxed">
        <span onClick={() => setChecked([true, false])} role="tab" className={clsx("tab", checked[0] && "bg-rose-400 text-white")}>Обліковий запис</span>
        <span onClick={() => setChecked([false, true])} role="tab" className={clsx("tab", checked[1] && "bg-rose-400 text-white")}>Історія замовлень</span>
    </div>
}

export default ProfileHeader;