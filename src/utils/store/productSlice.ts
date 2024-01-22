import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import products from "@/components/Products/Products";

type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
};

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload];
    }
  },
});

export const { setProducts, addProducts } = productsSlice.actions;
export default productsSlice.reducer;
