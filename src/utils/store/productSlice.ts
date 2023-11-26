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
      state.filteredProducts = action.payload;
    },
    filterProducts: (state, action) => {
      state.filteredProducts = [...state.products];

      // SORT
      switch (action.payload.sortFilter) {
        case "1": {
          state.filteredProducts = [...state.products];
          break;
        }
        case "2": {
          state.filteredProducts = state.filteredProducts.reverse();
          break;
        }
        case "3": {
          state.filteredProducts = state.filteredProducts.sort((a, b) => {
            if (
              Number(a.price["1"].slice(0, -2)) <
              Number(b.price["1"].slice(0, -2))
            ) {
              return -1;
            }

            if (
              Number(a.price["1"].slice(0, -2)) >
              Number(b.price["1"].slice(0, -2))
            ) {
              return 1;
            }

            return 0;
          });
          break;
        }
        case "4": {
          state.filteredProducts = state.filteredProducts.sort((a, b) => {
            if (
              Number(a.price["1"].slice(0, -2)) >
              Number(b.price["1"].slice(0, -2))
            ) {
              return -1;
            }

            if (
              Number(a.price["1"].slice(0, -2)) <
              Number(b.price["1"].slice(0, -2))
            ) {
              return 1;
            }

            return 0;
          });
          break;
        }
        default: {
          break;
        }
      }

      // PRICE
      state.filteredProducts = state.filteredProducts.filter((product) => {
        const price = Number(product.price["1"].slice(0, -2));
        return (
          price >= action.payload.priceFilter[0] &&
          price <= action.payload.priceFilter[1]
        );
      });

      // CATEGORIES
      if (action.payload.categoriesFilter[0] === "") {
        if (action.payload.categoriesFilter.slice(1).length > 0) {
          state.filteredProducts = state.filteredProducts.filter((product) => {
            return action.payload.categoriesFilter.includes(
              product.menu_category_id,
            );
          });
        }
      } else {
        if (action.payload.categoriesFilter.length > 0) {
          state.filteredProducts = state.filteredProducts.filter((product) => {
            return action.payload.categoriesFilter.includes(
              product.menu_category_id,
            );
          });
        }
      }
    },
  },
});

export const { setProducts, filterProducts } = productsSlice.actions;
export default productsSlice.reducer;
