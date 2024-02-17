import { create } from "zustand";

type Product = {
  product_id: any;
  productVariant: {
    title: string;
    id: string;
  };
  count: number;
};

export type Order = {
  _id: string;
  description: string;
  phoneNumber: string;
  userFullName: string;
  shippingAddress: string;
  deliveryTime: string;
  products: Product[];
  comment: string;
  payment: {
    status: boolean;
    amount: string;
    bonuses: number;
    deliveryPrice: string;
    liqpayPaymentID: string;
  };
  isViewed?: boolean;
  status: string;
  createdAt: string;
};

type Store = {
  orders: Order[];
  notViewedOrders: number;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Order) => void;
  setNotViewOrders: (orders: Order[]) => void;
  updateNotViewOrders: () => void;
};

export const useOrdersStore = create<Store>()((set, get) => ({
  orders: [],
  notViewedOrders: 0,
  setOrders: (orders) => {
    set({ orders: orders });
  },
  setNotViewOrders: (orders) => {
    set({ notViewedOrders: orders.length });
  },
  updateNotViewOrders: () => {
    set({ notViewedOrders: get().notViewedOrders + 1 });
  },
  addOrder: (order) => {
    set({ orders: [order, ...get().orders] });
  },
  updateOrder: (id, order) => {},
}));
