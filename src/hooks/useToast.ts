import { toast, ToastOptions } from "react-toastify";

const useToast = () => {
  return {
    error: (content: string, options?: ToastOptions<{}> | undefined) => {
      toast.error(content, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...options,
      });
    },
    info: (content: string, options?: ToastOptions<{}> | undefined) => {
      toast.info(content, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...options,
      });
    },
  };
};

export default useToast;
