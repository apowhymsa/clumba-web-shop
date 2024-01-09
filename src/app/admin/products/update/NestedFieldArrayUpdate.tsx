import React, {useEffect, useState} from "react";
import {Control, Controller, FieldErrors, useFieldArray, UseFormRegister} from "react-hook-form";
import Select from "react-select";
import Button from "@/components/UI/Button/Button";
import axios, {AxiosRequestConfig} from "axios";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useProductsStore} from "@/utils/zustand-store/products";
import {useSearchParams} from "next/navigation";
import NestedFieldArrayUpdateItem from "@/app/admin/products/update/NestedFieldArrayUpdateItem";

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
    errors: FieldErrors<FormValues>;
    defaultIngredients: any[]
}
const NestedFieldArrayUpdate = (props: Props) => {
    const searchParams = useSearchParams();
    const {products} = useProductsStore();
    const {nestIndex, register, control, errors} = props;
    const [isLoadingIngredients, setLoadingIngredients] = useState(true);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [ingredientVariants, setIngredientVariants] = useState<any>(null);
    const {fields, remove, append} = useFieldArray({
        control, name: `variants.${nestIndex}.ingredients`
    });

    useEffect(() => {
        console.log('current ingredients', + nestIndex, props.defaultIngredients);
        console.log('products', products);

        async function getIngredients() {
            setLoadingIngredients(true);
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*'
                }, withCredentials: true
            }
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredients`, requestConfig);
            response.data.forEach((ingredient: any) => {
                setIngredients((currentState) => [...currentState, ingredient]);
            })
        }

            getIngredients().finally(() => {
                // const foundedVariants = ingredients.find(ingredient => ingredient._id === props.defaultIngredients[nestIndex].ingredient);
                // setIngredientVariants(foundedVariants);
                setLoadingIngredients(false)
            });
    }, []);

    useEffect(() => {
        console.log('ing', ingredients);
    }, [ingredients]);
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
            return <NestedFieldArrayUpdateItem key={item.id} fields={fields} remove={remove} item={item} k={k} isLoadingIngredients={isLoadingIngredients} ingredients={ingredients} nestIndex={nestIndex} control={control} register={register} errors={errors} defaultIngredients={props.defaultIngredients}/>
        })}

        <hr className="my-6"/>
    </div>);
};

export default NestedFieldArrayUpdate;
