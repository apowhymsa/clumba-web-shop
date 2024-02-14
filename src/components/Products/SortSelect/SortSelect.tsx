"use client";

import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import Select, { SingleValue } from "react-select";

type Props = {
  onChangeHandler: (
    newValue: SingleValue<{ value: string; label: string }>
  ) => void;
  defaultValue: string;
};
const SortSelect = (props: Props) => {
  const { onChangeHandler, defaultValue } = props;
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
      className="w-[245px]"
      onChange={onChangeHandler}
      styles={{
        control: (base, state) => ({
          ...base,
          outline: state.isFocused
            ? "1px solid #fb7185 !important"
            : base.outline,
          border: state.isFocused
            ? "1px solid #fb7185 !important"
            : base.border,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? "#fda4af"
            : state.isSelected
            ? "#fb7185"
            : base.backgroundColor,
          color: state.isFocused || state.isSelected ? "white" : "black",
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
