import { create } from "zustand";
import { state } from "sucrase/dist/types/parser/traverser/base";

interface Personals {
  fullName: string;
  phoneNumber: string;
  avatar: string;
}

interface Promo {
  ordersSummary: number;
  bonuses: number;
  bonusesPercent: number;
}

interface User {
  _id: string;
  email: string;
  personals: Personals;
  promo: Promo;
}

type Store = {
  users: User[];
  addUser: (user: User | User[]) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, values: User) => void;
};

export const useUsersStore = create<Store>()((set, get) => ({
  users: [],
  addUser: (values: User | User[]) => {
    if (Array.isArray(values)) {
      set({ users: [...values] });
    } else {
      set({ users: [values, ...get().users] });
    }
  },
  deleteUser: (id: string) => {
    console.log("deleted");
    set({ users: [...get().users.filter((u) => u._id !== id)] });
  },
  updateUser: (id: string, values: User) => {
    set({
      users: [
        ...get().users.map((u) => {
          if (u._id === id) {
            return {
              _id: u._id,
              email: values.email,
              personals: values.personals,
              promo: values.promo,
            };
          }

          return u;
        }),
      ],
    });
  },
}));
