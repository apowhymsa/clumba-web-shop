"use client";

import Select, { SingleValue } from "react-select";

const options = [
  { value: "1", label: "Популярные", disabled: true },
  { value: "2", label: "Новые", disabled: true },
  { value: "3", label: "Цена: Низкая - Высокая", disabled: true },
  { value: "4", label: "Цена: Высокая - Низкая", disabled: true },
];

type Props = {
  onChangeHandler: (
    newValue: SingleValue<{ value: string; label: string }>,
  ) => void;
  defaultValue: number;
};
const SortSelect = (props: Props) => {
  const { onChangeHandler, defaultValue } = props;
  return (
    <Select
      options={options}
      className="w-[245px]"
      onChange={onChangeHandler}

      styles={{
        control: (base, state) => ({
          ...base,
          outline: state.isFocused ? '1px solid #fb7185 !important' : base.outline,
          border: state.isFocused ? '1px solid #fb7185 !important' : base.border
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? '#fda4af' : state.isSelected ? '#fb7185' : base.backgroundColor,
          color: state.isFocused || state.isSelected ? 'white' : 'black'
        })
      }}
      defaultValue={
        Number(defaultValue) > 3
          ? options[0]
          : options[Number(defaultValue) - 1]
      }
    />
  );
};

export default SortSelect;
