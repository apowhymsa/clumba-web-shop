"use client";

import { FC, MouseEventHandler, SyntheticEvent, useState } from "react";
import Image from "next/image";

import "./LanguageSwitcher.scss";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";

interface LanguageSwitcherProps {}

const LanguageSwitcher: FC<LanguageSwitcherProps> = () => {
  const { t, i18n } = useTranslation();

  function changeLng(e: SyntheticEvent) {
    const currentTarget = e.currentTarget;
    const selectedLng =
      currentTarget.attributes.getNamedItem("data-lang")?.value;

    if (selectedLng === "uk" || selectedLng === "en") {
      localStorage.setItem("selectedLng", selectedLng);
      i18n.changeLanguage(selectedLng);
    } else {
      localStorage.setItem("selectedLng", "uk");
      i18n.changeLanguage("uk");
    }
  }

  return (
    <div className="lng-container">
      <ul className="lng-select">
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          whileTap={{ scale: 0.9 }}
          className={clsx(i18n.language === "uk" && "lng-selected")}
          role="button"
          data-lang="uk"
          onClick={changeLng}
        >
          <Image src="/ukraine-flag-icon.svg" width={24} height={24} alt="" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          whileTap={{ scale: 0.9 }}
          className={clsx(i18n.language === "en" && "lng-selected")}
          role="button"
          data-lang="en"
          onClick={changeLng}
        >
          <Image
            src="/united-states-flag-icon.svg"
            width={24}
            height={24}
            alt=""
          />
        </motion.button>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
