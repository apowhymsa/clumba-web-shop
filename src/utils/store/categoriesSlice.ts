import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";

type CategoriesState = {
  categories: {
    categories: Category[],
    count: number;
  }
};

const initialState: CategoriesState = {
  categories: {
    categories: [],
    count: 0
  },
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<{categories: Category[], count: number}>) => {
      state.categories = action.payload;
    },
    addCategories: (state, action: PayloadAction<{categories: Category[], count: number}>) => {
      state.categories = {categories: [...state.categories.categories, ...action.payload.categories], count: action.payload.count}
    }
  },
});

export const { setCategories, addCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
