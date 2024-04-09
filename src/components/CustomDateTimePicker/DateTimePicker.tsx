import React from 'react';
import CustomInputDateTimePicker from './CustomInputDateTimePicker';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

import { uk } from 'date-fns/locale/uk';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('uk', uk);

interface IDateTimePicker {
  dateTimeDelivery: Date | null | undefined;
  setDateTimeDelivery: React.Dispatch<
    React.SetStateAction<Date | null | undefined>
  >;
}

export default function DateTimePicker({
  dateTimeDelivery,
  setDateTimeDelivery,
}: IDateTimePicker) {
  return (
    <DatePicker
      isClearable
      toggleCalendarOnIconClick
      selected={dateTimeDelivery}
      onChange={(date) => {
        const normalizedDate = date
          ? date.getDate() === new Date().getDate() &&
            date.getHours() < new Date().getHours()
            ? new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                new Date().getHours() + 1,
                new Date().getMinutes(),
              )
            : date
          : date;
        setDateTimeDelivery(normalizedDate);
      }}
      customInput={<CustomInputDateTimePicker />}
      dateFormat="Pp"
      timeFormat="p"
      showTimeSelect
      timeIntervals={15}
      locale="uk"
      wrapperClassName="w-full"
      minDate={new Date()}
      minTime={
        dateTimeDelivery
          ? dateTimeDelivery.getDate() === new Date().getDate()
            ? new Date(
                dateTimeDelivery.getFullYear(),
                dateTimeDelivery.getMonth(),
                dateTimeDelivery.getDate(),
                new Date().getHours() + 1,
                new Date().getMinutes(),
              )
            : new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                9,
                0,
              )
          : new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
              9,
              0,
            )
      }
      maxTime={
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          19,
          0,
        )
      }
    />
  );
}
