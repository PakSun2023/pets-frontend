import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URI,
    timeout: 10000
});

export const userSignUp = async (email: string, password: string, role: string, staffCode?: string) => {
    try {
        const res = await axiosInstance.post("/auth/register", { email, password, role, staffCode });
        return res.data;
    } catch (error) {
        console.log("user sign up error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        }
    }
}

export const userLogin = async (email: string, password: string) => {
    try {
        const res = await axiosInstance.post("/auth/login", { email, password });
        return res.data;
    } catch (error) {
        console.log("user login error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        }
    }
}