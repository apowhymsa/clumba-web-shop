"use client";

import { useContext, useEffect, useLayoutEffect, useState } from "react";
import clsx from "clsx";
import ProfileHeader from "@/components/Profile/ProfileHeader/ProfileHeader";
import OrderHistory from "@/app/profile/OrderHistory";
import UserInfo from "@/app/profile/UserInfo";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import useToast from "@/hooks/useToast";
import { useTranslation } from "next-i18next";

const Page = () => {
  const [checked, setChecked] = useState([true, false]);
  const { isLogged, isLoading } = useContext(AuthContext);
  const { error, info } = useToast();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isLogged) {
        info(
          i18n.language === "uk"
            ? "Для доступу до профілю потрібно увійти в обліковий запис"
            : "To access your profile, you need to log in to your account"
        );
        return router.push("/");
      }
    }
  }, [isLogged, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="px-5 md:px-10 flex flex-col gap-x-6 py-4">
      <div className="w-full sm:w-fit">
        <ProfileHeader checked={checked} setChecked={setChecked} />
      </div>
      <div>
        {checked[1] && <OrderHistory />}
        {checked[0] && <UserInfo />}
      </div>
    </div>
  );
};

export default Page;
