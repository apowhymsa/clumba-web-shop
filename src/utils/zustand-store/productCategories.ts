import { create } from "zustand";
import { state } from "sucrase/dist/types/parser/traverser/base";

type ProductCategory = {
  _id: string;
  title: string;
  image: string;
};

type Store = {
  productCategories: ProductCategory[];
  addProductCategory: (
    ingredientCategory: ProductCategory | ProductCategory[]
  ) => void;
  deleteProductCategory: (id: string) => void;
  updateProductCategory: (id: string, values: ProductCategory) => void;
};

export const useProductCategoriesStore = create<Store>()((set, get) => ({
  productCategories: [],
  addProductCategory: (values: ProductCategory | ProductCategory[]) => {
    if (Array.isArray(values)) {
      set({ productCategories: [...values] });
    } else {
      set({ productCategories: [values, ...get().productCategories] });
    }
  },
  deleteProductCategory: (id: string) => {
    console.log("deleted");
    set({
      productCategories: [
        ...get().productCategories.filter((pc) => pc._id !== id),
      ],
    });
  },
  updateProductCategory: (id: string, values: ProductCategory) => {
    set({
      productCategories: [
        ...get().productCategories.map((pc) => {
          if (pc._id === id) {
            return {
              _id: pc._id,
              title: values.title,
              image: values.image,
            };
          }

          return pc;
        }),
      ],
    });
  },
}));
