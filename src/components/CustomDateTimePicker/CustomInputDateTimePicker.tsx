import React, { forwardRef } from 'react';

const CustomInputDateTimePicker = forwardRef<HTMLInputElement>(
  ({ value, onClick }: any, ref) => {
    return (
      <input
        onClick={onClick}
        ref={ref}
        value={value}
        placeholder="Оберіть дату та час"
        className={`block w-full rounded-md shadow-sm text-dark dark:text-light dark:bg-[#1f2937] dark:border-dark border-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
        type="text"
      />
    );
  },
);

export default CustomInputDateTimePicker;
