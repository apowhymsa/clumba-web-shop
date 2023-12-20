import React, {useEffect, useState} from "react";
import {Control, Controller, FieldErrors, useFieldArray, UseFormRegister} from "react-hook-form";
import Select from "react-select";
import Button from "@/components/UI/Button/Button";
import axios, {AxiosRequestConfig} from "axios";
import {TrashIcon} from "@heroicons/react/24/outline";
import NestedFieldArrayItem from "@/app/admin/products/create/NestedFieldArrayItem";

interface IIngredient {
    id: string;
    variantID: string;
}

interface IVariant {
    title: string;
    price: string;
    discount: {
        state: boolean, percent: string
    };
    ingredients: Array<{
        ingredient: IIngredient; count: string;
    }>;
}

interface FormValues {
    image: any;
    title: string;
    categoryID: string;
    price: string;
    variants: IVariant[];
}

type Props = {
    nestIndex: number;
    control: Control<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>
}
const NestedFieldArray = (props: Props) => {
    const {nestIndex, register, control, errors} = props;
    const [isLoadingIngredients, setLoadingIngredients] = useState(true);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [ingredientVariants, setIngredientVariants] = useState<any>(null);
    const {fields, remove, append} = useFieldArray({
        control, name: `variants.${nestIndex}.ingredients`
    });

    useEffect(() => {
        async function getIngredients() {
            setLoadingIngredients(true);
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredients`, requestConfig);
            response.data.forEach((ingredient: any) => {
                setIngredients((currentState) => [...currentState, ingredient]);
            })
        }

        getIngredients().finally(() => setLoadingIngredients(false));
        console.log(ingredients);
    }, []);

    return (<div>
        <div className="flex justify-between items-center my-4">
            <span className="flex-1 text-[15px]">Інгредієнти товару</span>
            <div className="w-fit">
                <Button type="button" variant="primary" content="Додати ще один інгредієнт"
                        onClick={() => append({
                            ingredient: {
                                variantID: '', id: ''
                            }, count: ''
                        })}
                />
            </div>
        </div>
        {fields.map((item, k) => {
            return (<div className="flex gap-x-4">
                    <NestedFieldArrayItem key={item.id} item={item} nestIndex={nestIndex} k={k} errors={errors}
                                          isLoadingIngredients={isLoadingIngredients} ingredients={ingredients}
                                          control={control} register={register}/>
                    {fields.length > 1 ? (<span
                        className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
                        title="Видалити"
                        onClick={() => remove(k)}>
            <TrashIcon className="w-6 h-6 text-white"/>
            </span>) : null}
                </div>)
            // return (<div key={item.id} className="flex gap-x-4 mt-2 pl-10">
            //     <div className="flex-1">
            //         <label
            //             htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
            //             className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            //         >
            //             Назва інгредієнту
            //         </label>
            //         <div className="relative">
            //             <Controller render={({field}) => (<Select
            //                 isDisabled={isLoadingIngredients}
            //                 ref={field.ref}
            //                 onChange={(data) => {
            //                     field.onChange(data);
            //                     const foundedVariants = ingredients.find(ingredient => ingredient._id === data!.value);
            //                     setIngredientVariants(foundedVariants);
            //                 }}
            //                 isSearchable={false}
            //                 options={ingredients.map((ingredient: any) => ({
            //                         value: ingredient._id,
            //                         label: ingredient.title
            //                     }))}
            //                 className={`block w-full text-sm rounded-md shadow-sm ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
            //             />)}
            //                         name={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
            //                         control={control}
            //                         rules={{
            //                             required: {
            //                                 value: true, message: "Поле обов'язкове для заповнення"
            //                             }
            //                         }}
            //             />
            //         </div>
            //         {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
            //     </div>
            //     <div className="flex-1">
            //         <label
            //             htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
            //             className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryID ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            //         >
            //             Варіант інгредієнту
            //         </label>
            //         <div className="relative">
            //             <Controller render={({field}) => (<Select
            //                 isDisabled={!ingredientVariants}
            //                 ref={field.ref}
            //                 onChange={field.onChange}
            //                 isSearchable={false}
            //                 options={ingredientVariants && ingredientVariants.variants.map((variant: any) => ({
            //                         value: variant.id._id,
            //                         label: variant.id.vType
            //                     }))}
            //                 className={`block w-full rounded-md text-sm shadow-sm ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
            //             />)}
            //                         name={`variants.${nestIndex}.ingredients.${k}.ingredient.variantID`}
            //                         control={control}
            //                         rules={{
            //                             required: {
            //                                 value: true, message: "Поле обов'язкове для заповнення"
            //                             }
            //                         }}
            //             />
            //         </div>
            //         {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
            //     </div>
            //     <div className="flex-1">
            //         <label
            //             htmlFor={`variants.${nestIndex}.ingredients.${k}.count`}
            //             className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            //         >
            //             Кількість інгредієнту
            //         </label>
            //         <div className="relative">
            //             <input
            //                 min={1}
            //                 type="number"
            //                 className={`block h-[38px] w-full text-sm rounded-md shadow-sm pl-4 ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
            //                 {...register(`variants.${nestIndex}.ingredients.${k}.count`, {
            //                     required: {
            //                         value: true, message: "Поле обов'язкове для заповнення",
            //                     }, min: {
            //                         value: 1, message: 'Ціна товару повинна бути вища за 0'
            //                     }
            //                 })}
            //             />
            //         </div>
            //         {errors.variants ? (<p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
            //     </div>
            //
            //     {fields.length > 1 ? (<span
            //         className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
            //         title="Видалити"
            //         onClick={() => remove(k)}>
            //                             <TrashIcon className="w-6 h-6 text-white"/>
            //                         </span>) : null}
            // </div>);
        })}

        <hr className="my-6"/>
    </div>);
};

export default NestedFieldArray;
