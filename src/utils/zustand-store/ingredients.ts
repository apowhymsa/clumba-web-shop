import {create} from 'zustand';

interface IVariants {
    id: {
        vType: string;
        count: string;
    }
}

interface ICategory {
    _id: string;
    title: string;
}

type Ingredient = {
    _id: string; title: string; categoryID: ICategory; variants: IVariants[]; image: any;
}

type Store = {
    ingredients: Ingredient[];
    addIngredient: (ingredient: Ingredient | Ingredient[]) => void;
    deleteIngredient: (id: string) => void;
    updateIngredient: (id: string, values: Ingredient) => void;
}

export const useIngredientsStore = create<Store>()((set, get) => ({
    ingredients: [],
    addIngredient: (values: Ingredient | Ingredient[]) => {
        if (Array.isArray(values)) {
            set({ingredients: [...get().ingredients, ...values]});
        } else {
            set({ingredients: [...get().ingredients, values]});
        }

        console.log(get().ingredients);
    }, deleteIngredient: (id: string) => {
        set({ingredients: [...get().ingredients.filter(i => i._id !== id)]})
    }, updateIngredient: (id: string, values: Ingredient) => {
        set({
            ingredients: [...get().ingredients.map(i => {
                if (i._id === id) {
                    return {
                        ...values,
                        _id: id,
                    }
                }

                return i;
            })]
        })
    }
}))