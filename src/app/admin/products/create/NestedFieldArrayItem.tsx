import {Controller} from "react-hook-form";
import Select from "react-select";
import {TrashIcon} from "@heroicons/react/24/outline";
import React, {Dispatch, SetStateAction, useState} from "react";

type Props = {
    item: any;
    nestIndex: number;
    k: number;
    errors: any;
    isLoadingIngredients: boolean;
    ingredients: any;
    control: any;
    register: any;
}
const NestedFieldArrayItem = (props: Props) => {
    const {nestIndex, register, control, errors, k, item, isLoadingIngredients, ingredients} = props;
    const [ingredientVariants, setIngredientVariants] = useState<any>(null)
    return (<div key={item.id} className="flex gap-x-4 mt-2 pl-10">
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Назва інгредієнту
            </label>
            <div className="relative">
                <Controller render={({field}) => (<Select
                    isDisabled={isLoadingIngredients}
                    ref={field.ref}
                    onChange={(data: any) => {
                        field.onChange(data);
                        const foundedVariants = ingredients.find((ingredient: any) => ingredient._id === data!.value);
                        setIngredientVariants(foundedVariants);
                    }}
                    isSearchable={false}
                    options={ingredients.map((ingredient: any) => ({
                        value: ingredient._id,
                        label: ingredient.title
                    }))}
                    className={`block w-full text-sm rounded-md shadow-sm ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                />)}
                            name={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
                            control={control}
                            rules={{
                                required: {
                                    value: true, message: "Поле обов'язкове для заповнення"
                                }
                            }}
                />
            </div>
            {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
        </div>
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryID ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Варіант інгредієнту
            </label>
            <div className="relative">
                <Controller render={({field}) => (<Select
                    isDisabled={!ingredientVariants}
                    ref={field.ref}
                    onChange={field.onChange}
                    isSearchable={false}
                    options={ingredientVariants && ingredientVariants.variants.map((variant: any) => ({
                        value: variant.id._id,
                        label: variant.id.vType
                    }))}
                    className={`block w-full rounded-md text-sm shadow-sm ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                />)}
                            name={`variants.${nestIndex}.ingredients.${k}.ingredient.variantID`}
                            control={control}
                            rules={{
                                required: {
                                    value: true, message: "Поле обов'язкове для заповнення"
                                }
                            }}
                />
            </div>
            {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
        </div>
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.count`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Кількість інгредієнту
            </label>
            <div className="relative">
                <input
                    min={1}
                    type="number"
                    className={`block h-[38px] w-full text-sm rounded-md shadow-sm pl-4 ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                    {...register(`variants.${nestIndex}.ingredients.${k}.count`, {
                        required: {
                            value: true, message: "Поле обов'язкове для заповнення",
                        }, min: {
                            value: 1, message: 'Ціна товару повинна бути вища за 0'
                        }
                    })}
                />
            </div>
            {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
        </div>

        {/*{fields.length > 1 ? (<span*/}
        {/*    className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"*/}
        {/*    title="Видалити"*/}
        {/*    onClick={() => remove(k)}>*/}
        {/*                                <TrashIcon className="w-6 h-6 text-white"/>*/}
        {/*                            </span>) : null}*/}
    </div>);
}

export default NestedFieldArrayItem;