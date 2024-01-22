import {create} from 'zustand';
import {state} from "sucrase/dist/types/parser/traverser/base";

interface IIngredient {
    id: string;
    variantID: string;
}

interface IVariant {
    title: string;
    ingredients: Array<{
        ingredient: IIngredient; count: string;
    }>;
}

interface Product {
    _id: string;
    image: any;
    title: string;
    categoryID: any;
    isNotVisible: boolean;
    price: string;
    discount: {
        state: boolean, percent: string
    };
    variants: IVariant[];
}

type Store = {
    products: Product[];
    addProduct: (product: Product | Product[]) => void;
    deleteProduct: (id: string) => void;
    updateProduct: (id: string, values: Product) => void;
}

export const useProductsStore = create<Store>()((set, get) => ({
    products: [], addProduct: (values: Product | Product[]) => {
        if (Array.isArray(values)) {
            set({products: [...get().products, ...values]});
        } else {
            set({products: [...get().products, values]});
        }
    }, deleteProduct: (id: string) => {
        console.log('deleted');
        set({products: [...get().products.filter(pc => pc._id !== id)]})
    }, updateProduct: (id: string, values: Product) => {
        set({
            products: [...get().products.map(pc => {
                if (pc._id === id) {
                    return {
                        _id: pc._id,
                        title: values.title,
                        image: values.image,
                        categoryID: values.categoryID,
                        variants: values.variants,
                        discount: values.discount,
                        isNotVisible: values.isNotVisible,
                        price: values.price
                    }
                }

                return pc;
            })]
        })
    }
}))