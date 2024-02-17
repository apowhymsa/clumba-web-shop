"use client";

import { ThemeContext } from "@/contexts/ThemeContext/ThemeContext";
import { useTranslation } from "next-i18next";
import { useContext, useMemo } from "react";
import Select, { SingleValue } from "react-select";

type Props = {
  onChangeHandler: (
    newValue: SingleValue<{ value: string; label: string }>
  ) => void;
  defaultValue: string;
};
const SortSelect = (props: Props) => {
  const { onChangeHandler, defaultValue } = props;
  const { theme } = useContext(ThemeContext);
  const { i18n, t } = useTranslation();

  const options = [
    {
      value: "1",
      label: i18n.language === "uk" ? "Популярні" : "Popular",
      disabled: true,
    },
    {
      value: "2",
      label: i18n.language === "uk" ? "Нові" : "New",
      disabled: true,
    },
  ];

  return (
    <Select
      isSearchable={false}
      options={options}
      className="w-[245px] filter-select"
      onChange={onChangeHandler}
      styles={{
        container: (base, state) => ({
          ...base,
          color: theme === "light" ? "#1f2937 !important" : "white !important",
        }),
        singleValue: (base, props) => ({
          ...base,
          color: theme === "light" ? "#1f2937 !important" : "white !important",
        }),
        control: (base, state) => ({
          ...base,
          backgroundColor: theme === "light" ? "white" : "#1f2937",
          color: theme === "light" ? "#1f2937 !important" : "white !important",
          outline: state.isFocused
            ? "1px solid #fb7185 !important"
            : theme === "light"
            ? "1px solid #e5e7eb !important"
            : "1px solid #111827 !important",
          border: state.isFocused
            ? "1px solid #fb7185 !important"
            : theme === "light"
            ? "1px solid #e5e7eb !important"
            : "1px solid #111827 !important",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? "#fda4af"
            : state.isSelected
            ? "#fb7185"
            : theme === "light"
            ? base.backgroundColor
            : "#1f2937",
          color:
            state.isFocused || state.isSelected
              ? theme === "light"
                ? "#1f2937 !important"
                : "white !important"
              : base.color,
        }),
      }}
      defaultValue={
        options[Number(defaultValue) - 1]
        // Number(defaultValue) > 3
        //   ? options[0]
        //   : options[Number(defaultValue) - 1]
      }
    />
  );
};

export default SortSelect;
