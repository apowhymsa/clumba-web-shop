import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ukUA } from "@mui/x-date-pickers/locales";
import "moment/locale/uk";
import Popper from "@mui/material/Popper";
type Props = {
  selectedDateTime: Dayjs | null;
  setSelectedDateTime: Dispatch<SetStateAction<Dayjs | null>>;
};
const CustomDateTimePicker = (props: Props) => {
  const { selectedDateTime, setSelectedDateTime } = props;

  useEffect(() => {
    console.log(
      "selectedDateTime",
      selectedDateTime?.toDate().toLocaleString()
    );
  }, [selectedDateTime]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      adapterLocale="uk"
      localeText={
        ukUA.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DateTimePicker
        ampm={false}
        slotProps={{
          textField: {
            size: "small",
            disabled: true,
            style: { color: "white" },
          },
        }}
        label="Вибір дати та часу"
        value={selectedDateTime}
        onChange={(newValue) => setSelectedDateTime(newValue)}
        className="dark:bg-[#1f2937] w-full dark:text-light text-dark datetimepicker"
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
