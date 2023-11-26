import { createContext, Dispatch, SetStateAction } from "react";

export type OpenDispatch = {
  step: number,
  isOpen: boolean;
}

type ContextProps = {
  isOpen: OpenDispatch;
  setOpen: Dispatch<SetStateAction<OpenDispatch>>;
};
export const ModalContext = createContext<ContextProps>({
  isOpen: {isOpen: false, step: 1},
  setOpen: () => {},
});
