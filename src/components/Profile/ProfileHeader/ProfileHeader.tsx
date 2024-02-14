"use client";

import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import "./ProfileHeader.scss";
import { useTranslation } from "next-i18next";

type Props = {
  checked: boolean[];
  setChecked: Dispatch<SetStateAction<boolean[]>>;
};
const ProfileHeader = (props: Props) => {
  const { checked, setChecked } = props;
  const { t, i18n } = useTranslation();

  return (
    <div role="tablist" className="tabs tabs-boxed">
      <span
        onClick={() => setChecked([true, false])}
        role="tab"
        className={clsx("tab", checked[0] && "bg-rose-400 text-white")}
      >
        {i18n.language === "uk" ? "Обліковий запис" : "Account"}
      </span>
      <span
        onClick={() => setChecked([false, true])}
        role="tab"
        className={clsx("tab", checked[1] && "bg-rose-400 text-white")}
      >
        {i18n.language === "uk" ? "Історія замовлень" : "Order history"}
      </span>
    </div>
  );
};

export default ProfileHeader;
