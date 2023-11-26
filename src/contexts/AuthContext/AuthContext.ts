import { createContext, Dispatch, SetStateAction } from "react";
import { boolean } from "zod";

type ContextProps = {
  isLogged: boolean;
  isLoading: boolean;
  setLogged: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};
export const AuthContext = createContext<ContextProps>({
  isLogged: false,
  isLoading: false,
  setLogged: () => {},
  setLoading: () => {}
});
