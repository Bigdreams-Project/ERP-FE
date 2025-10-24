import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showSuccess = (message: string, options: ToastOptions = {}) => {
  toast.success(message, { ...defaultOptions, autoClose: 5000, ...options });
};

export const showError = (message: string, options: ToastOptions = {}) => {
  toast.error(message, { ...defaultOptions, autoClose: false, ...options });
};

export const showInfo = (message: string, options: ToastOptions = {}) => {
  toast.info(message, { ...defaultOptions, autoClose: 4000, ...options });
};

export const showWarning = (message: string, options: ToastOptions = {}) => {
  toast.warn(message, { ...defaultOptions, autoClose: 4000, ...options });
};
