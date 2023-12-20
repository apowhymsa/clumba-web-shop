'use client';

import {useState} from "react";
import clsx from "clsx";
import ProfileHeader from "@/components/Profile/ProfileHeader/ProfileHeader";
import OrderHistory from "@/app/profile/OrderHistory";
import UserInfo from "@/app/profile/UserInfo";

const Page = () => {
    const [checked, setChecked] = useState([true, false]);

    return <div className="px-10 flex flex-col gap-x-6 py-4">
        <div className="w-fit">
            <ProfileHeader checked={checked} setChecked={setChecked}/>
        </div>
        <div>
            {checked[1] && <OrderHistory/>}
            {checked[0] && <UserInfo/>}
        </div>
    </div>
}

export default Page;