import {Controller} from "react-hook-form";
import Select from "react-select";
import {TrashIcon} from "@heroicons/react/24/outline";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";

type Props = {
    item: any;
    nestIndex: number;
    k: number;
    errors: any;
    isLoadingIngredients: boolean;
    ingredients: any;
    control: any;
    register: any;
    defaultIngredients: any[];
    fields: any;
    remove: any;
}
const NestedFieldArrayUpdateItem = (props: Props) => {
    const {
        nestIndex,
        register,
        control,
        errors,
        k,
        item,
        isLoadingIngredients,
        ingredients,
        defaultIngredients,
        fields,
        remove
    } = props;
    const [ingredientVariants, setIngredientVariants] = useState<any>(null)

    console.log('ing nest', nestIndex, ingredients[k]);

    return (<div key={item.id} className="flex gap-x-4 mt-2 pl-10">
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.id`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.id ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Назва інгредієнту
            </label>
            <div className="relative">
                <Controller defaultValue={props.defaultIngredients[k] ? JSON.stringify({
                    label: props.defaultIngredients[k].ingredient.id.title,
                    value: props.defaultIngredients[k].ingredient.id._id
                }) : JSON.stringify({label: '', value: ''})} render={({field, fieldState}) => (<Select
                    defaultValue={props.defaultIngredients[k] ? {
                        label: props.defaultIngredients[k].ingredient.id.title,
                        value: props.defaultIngredients[k].ingredient.id._id
                    } : {label: '', value: ''}}
                    isDisabled={isLoadingIngredients}
                    ref={field.ref}
                    onChange={(data) => {
                        field.onChange(data);
                        const foundedVariants = ingredients.find((ingredient: any) => ingredient._id === data!.value);
                        setIngredientVariants(foundedVariants);
                    }}
                    isSearchable={false}
                    options={ingredients.map((ingredient: any) => ({
                        value: ingredient._id, label: ingredient.title
                    }))}
                    className={`block w-full text-sm rounded-md shadow-sm ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.id ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
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
            {errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.id ? (<p className="mt-1 text-sm text-red-500">{errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.id.message}</p>) : null}
        </div>
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.ingredient.variantID`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.variantID ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Варіант інгредієнту
            </label>
            <div className="relative">
                <Controller
                    defaultValue={props.defaultIngredients[k] ? JSON.stringify({
                        label: props.defaultIngredients[k].ingredient.variantID.vType,
                        value: props.defaultIngredients[k].ingredient.variantID._id
                    }) : JSON.stringify({label: '', value: ''})}
                    render={({field}) => (<Select
                        defaultValue={props.defaultIngredients[k] ? {
                            label: props.defaultIngredients[k].ingredient.variantID.vType,
                            value: props.defaultIngredients[k].ingredient.variantID._id
                        } : {label: '', value: ''}}
                        isDisabled={props.defaultIngredients[k] ? false : !ingredientVariants}
                        ref={field.ref}
                        onChange={field.onChange}
                        isSearchable={false}
                        options={ingredientVariants ? ingredientVariants.variants.map((variant: any) => ({
                            value: variant.id._id, label: variant.id.vType
                        })) : ingredients[k] && ingredients[k].variants.map((variant: any) => ({
                            value: variant.id._id, label: variant.id.vType
                        }))}
                        className={`block w-full rounded-md text-sm shadow-sm ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.variantID ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
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
            {errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.variantID ? (<p className="mt-1 text-sm text-red-500">{errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.ingredient?.variantID.message}</p>) : null}
        </div>
        <div className="flex-1">
            <label
                htmlFor={`variants.${nestIndex}.ingredients.${k}.count`}
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.count ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
            >
                Кількість інгредієнту
            </label>
            <div className="relative">
                <input
                    min={1}
                    type="number"
                    className={`block h-[38px] w-full text-sm rounded-md shadow-sm pl-4 ${errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.count ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                    {...register(`variants.${nestIndex}.ingredients.${k}.count`, {
                        required: {
                            value: true, message: "Поле обов'язкове для заповнення",
                        }, min: {
                            value: 1, message: 'Ціна товару повинна бути вища за 0'
                        }
                    })}
                />
            </div>
            {errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.count ? (<p className="mt-1 text-sm text-red-500">{errors.variants && (errors.variants.at?.(nestIndex) as any)?.ingredients.at?.(k)?.count.message}</p>) : null}
        </div>
        {fields.length > 1 ? (<span
            className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
            title="Видалити"
            onClick={() => remove(k)}>
                                        <TrashIcon className="w-6 h-6 text-white"/>
                                    </span>) : null}
    </div>);
}

export default NestedFieldArrayUpdateItem;