import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// Import necessary modules
import { useMediaQuery } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ukUA } from "@mui/x-date-pickers/locales";
import "moment/locale/uk";

type Props = {
  selectedDateTime: Dayjs | null;
  setSelectedDateTime: Dispatch<SetStateAction<Dayjs | null>>;
};

const CustomDateTimePicker = (props: Props) => {
  const { selectedDateTime, setSelectedDateTime } = props;
  const isMobile = useMediaQuery("(max-width:600px)");

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
        disablePast
        ampm={false}
        slotProps={{
          textField: {
            size: "small",
            disabled: isMobile ? false : true,
          },
        }}
        label="Вибір дати та часу"
        value={selectedDateTime}
        onChange={(newValue: dayjs.Dayjs | null) =>
          setSelectedDateTime(newValue)
        }
        className="dark:bg-[#1f2937] w-full dark:text-light text-dark datetimepicker"
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
