import React from "react";
import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface InputFieldProps extends React.AllHTMLAttributes<HTMLInputElement> {
  labelText: string;
  leftIcon?: React.ReactNode;
  register: UseFormRegister<any>;
  name: Path<any>;
  options?: RegisterOptions;
  error: FieldError | undefined;
}

const InputField = (props: InputFieldProps) => {
  const { labelText, leftIcon, register, options, error, ...inputProps } =
    props;
  return (
    <div>
      <label
        htmlFor={inputProps.id}
        className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
          error ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null
        }`}
      >
        {labelText}
      </label>
      <div className="relative">
        {leftIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">
            {leftIcon}
          </div>
        ) : null}
        <input
          className={`block w-full rounded-md shadow-sm dark:bg-[#1f2937] dark:text-light dark:border-dark ${
            leftIcon ? "pl-10" : "pl-4"
          } ${
            error
              ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
              : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
          }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
          {...inputProps}
          {...register(inputProps.name, options)}
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      ) : null}
    </div>
  );
};

export default InputField;
