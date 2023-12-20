import {create} from "zustand";

type Product = {
    product_id: any;
    productVariant: {
        title: string;
        id: string;
    },
    count: number;
}

export type Order = {
    _id: string;
    description: string;
    phoneNumber: string;
    userFullName: string;
    shippingAddress: string;
    products: Product[];
    payment: {
        status: boolean,
        amount: string,
        liqpayPaymentID: string,
    };
    status: string;
    createdAt: string;
}

type Store = {
    orders: Order[];
    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (id: string, order: Order) => void;
}

export const useOrdersStore = create<Store>()((set, get) => ({
    orders: [],
    setOrders: (orders) => {
        set({orders: orders});
    },
    addOrder: (order) => {
        set({orders: [order, ...get().orders]});
    },
    updateOrder: (id, order) => {

    }
}))

