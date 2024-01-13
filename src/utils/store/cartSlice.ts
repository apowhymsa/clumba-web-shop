import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Category, IVariantProduct, Product} from "@/types";
import cartItem from "@/components/Cart/CartItem/CartItem";
import {doc, setDoc, updateDoc} from "@firebase/firestore";
import {db} from "@/utils/firebase/firebase";
import axios, {AxiosRequestConfig} from "axios";

export type Cart = {
    product: Product; quantity: number; variant: IVariantProduct
};
type CartState = {
    cart: Cart[]; cartPrice: number;
};

const initialState: CartState = {
    cart: [], cartPrice: 0
};

export const getUserCart = createAsyncThunk('cart/getUserCart', async (userID: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*'
        }, withCredentials: true
    }
    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`, requestConfig);
    const {cart} = response.data;

    return cart.filter((cartItem: any) => cartItem.product != null);
})

export const updateUserCart = createAsyncThunk('cart/updateUserCart', async (userID: string, {getState}) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*'
        }, withCredentials: true
    }

    const requestBody = {
        data: {
            cart: (getState() as any).cartReducer.cart
        }
    }

    const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`, requestBody, requestConfig);
    const {cart} = response.data;

    return cart;
})

export const cartSlice = createSlice({
    name: "cart", initialState, reducers: {
        setCart: (state, action) => {

        }, setCartItem: (state, action: PayloadAction<Cart>) => {
            const userId = localStorage.getItem("authUserId");
            const productIndex = state.cart.findIndex((cartItem) => cartItem.product._id === action.payload.product._id && cartItem.variant._id === action.payload.variant._id,);

            if (productIndex !== -1) {
                state.cart[productIndex].quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }

            state.cartPrice = 0;
            state.cart.map(cartItem => {
                const isDiscount = cartItem.variant.discount.state;

                if (isDiscount) {
                    const discountAmount = (Number(cartItem.variant.price) * Number(cartItem.variant.discount.percent)) / 100;
                    state.cartPrice += (Number(cartItem.variant.price) - discountAmount) * Number(cartItem.quantity);
                } else {
                    state.cartPrice += Number(cartItem.variant.price) * Number(cartItem.quantity);
                }
            })
        }, updateQuantity: (state, action: PayloadAction<Cart>) => {
            const userId = localStorage.getItem("authUserId");
            const productIndex = state.cart.findIndex((cartItem) => cartItem.product._id === action.payload.product._id && cartItem.variant._id === action.payload.variant._id,);

            state.cart[productIndex].quantity = action.payload.quantity;
            state.cartPrice = 0;
            state.cart.map(cartItem => {
                const isDiscount = cartItem.variant.discount.state;

                if (isDiscount) {
                    const discountAmount = (Number(cartItem.variant.price) * Number(cartItem.variant.discount.percent)) / 100;
                    state.cartPrice += (Number(cartItem.variant.price) - discountAmount) * Number(cartItem.quantity);
                } else {
                    state.cartPrice += Number(cartItem.variant.price) * Number(cartItem.quantity);
                }
            })
        }, deleteItem: (state, action: PayloadAction<Cart>) => {
            const userId = localStorage.getItem("authUserId");
            const findIndex = state.cart.findIndex(cartItem => cartItem.product._id === action.payload.product._id && cartItem.variant._id === action.payload.variant._id);
            state.cart = [...state.cart.filter((_, index) => index !== findIndex)];
            console.log(state.cart.filter((_, index) => index !== findIndex));
            state.cartPrice = 0;
            state.cart.map(cartItem => {
                const isDiscount = cartItem.variant.discount.state;

                if (isDiscount) {
                    const discountAmount = (Number(cartItem.variant.price) * Number(cartItem.variant.discount.percent)) / 100;
                    state.cartPrice += (Number(cartItem.variant.price) - discountAmount) * Number(cartItem.quantity);
                } else {
                    state.cartPrice += Number(cartItem.variant.price) * Number(cartItem.quantity);
                }
            })
        }, clearCart: (state) => {
            state.cart = [];
            state.cartPrice = 0;
        },
    }, extraReducers: (builder) => {
        builder.addCase(getUserCart.fulfilled,(state, action) => {

            console.log('PAYLOAD', action.payload);
            const resultCart = (action.payload as any[]).map((cartItem: any) => {
                const quantity = cartItem.quantity;
                const itemVariantID = cartItem.variant._id;
                let isAvailable = null;

                const cartItemVariant = cartItem.product.variants.find((variant: any) => variant._id === itemVariantID);

                if (cartItemVariant) {
                    isAvailable = !!cartItemVariant.ingredients.findIndex((ing: any) => Number(ing.ingredient.variantID.count) >= Number(ing.count))
                }
                console.log('cartItemVariant', cartItemVariant, 'isAvailable', isAvailable)

                if (!isAvailable) return cartItem;
            });
            state.cart = resultCart.filter((value: any) => value !== undefined);

            console.log('CART', resultCart.filter((value: any) => value !== undefined));

            state.cartPrice = 0;
            state.cart.map(cartItem => {
                const isDiscount = cartItem.variant.discount.state;

                if (isDiscount) {
                    const discountAmount = (Number(cartItem.variant.price) * Number(cartItem.variant.discount.percent)) / 100;
                    state.cartPrice += (Number(cartItem.variant.price) - discountAmount) * Number(cartItem.quantity);
                } else {
                    state.cartPrice += Number(cartItem.variant.price) * Number(cartItem.quantity);
                }
            })
        }), builder.addCase(updateUserCart.fulfilled, (state, action) => {
            console.log('updated cart', action.payload);
        })
    }
});

export const {setCartItem, updateQuantity, deleteItem, clearCart, setCart} = cartSlice.actions;
export default cartSlice.reducer;
