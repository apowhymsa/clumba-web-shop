import { Dispatch, SetStateAction, createContext } from "react";

type ContextProps = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
};

export const ThemeContext = createContext<ContextProps>({
  theme: "light",
  setTheme: () => {},
});
