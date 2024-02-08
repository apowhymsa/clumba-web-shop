import { create } from "zustand";
import { state } from "sucrase/dist/types/parser/traverser/base";

type IngredientCategory = {
  _id: string;
  title: string;
};

type Store = {
  ingredientCategories: IngredientCategory[];
  addIngredientCategory: (
    ingredientCategory: IngredientCategory | IngredientCategory[]
  ) => void;
  deleteIngredientCategory: (id: string) => void;
  updateIngredientCategory: (id: string, values: IngredientCategory) => void;
};

export const useIngredientCategoriesStore = create<Store>()((set, get) => ({
  ingredientCategories: [],
  addIngredientCategory: (
    values: IngredientCategory | IngredientCategory[]
  ) => {
    if (Array.isArray(values)) {
      set({ ingredientCategories: [...values] });
    } else {
      set({ ingredientCategories: [values, ...get().ingredientCategories] });
    }
  },
  deleteIngredientCategory: (id: string) => {
    console.log("deleted");
    set({
      ingredientCategories: [
        ...get().ingredientCategories.filter((ic) => ic._id !== id),
      ],
    });
  },
  updateIngredientCategory: (id: string, values: IngredientCategory) => {
    set({
      ingredientCategories: [
        ...get().ingredientCategories.map((ic) => {
          if (ic._id === id) {
            return {
              _id: ic._id,
              title: values.title,
            };
          }

          return ic;
        }),
      ],
    });
  },
}));
