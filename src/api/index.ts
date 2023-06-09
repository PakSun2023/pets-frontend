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
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
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
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const addPet = async (name: string, age?: string, color?: string, breed?: string, location?: string, description?: string, photo?: File | null) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("age", age ?? "");
        formData.append("color", color ?? "");
        formData.append("breed", breed ?? "");
        formData.append("location", location ?? "");
        formData.append("description", description ?? "");
        if (photo) formData.append("petPhoto", photo);

        const res = await axiosInstance.post("/pet", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("add pet error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const getPets = async () => {
    try {
        const res = await axiosInstance.get("/pets");
        return res.data;
    } catch (error) {
        console.log("get pets list error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const getPetDetail = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.get(`/pet/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("get pet detail by id error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const updatePet = async (id: string, name: string, description?: string, age?: string, color?: string, breed?: string, location?: string, photo?: File | null) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description ?? "");
        formData.append("age", age ?? "");
        formData.append("color", color ?? "");
        formData.append("breed", breed ?? "");
        formData.append("location", location ?? "");
        if (photo) formData.append("petPhoto", photo);

        const res = await axiosInstance.put(`/pet/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("update pet data by id error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const deletePet = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.delete(`/pet/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("delete pet by id error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const getMyFavorites = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.get('/user/myFavorites', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("get my favorite list error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const addPetToMyFavorites = async (petId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.put(`/user/myFavorites/${petId}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("update my favorite list error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const removePetFromMyFavorites = async (petId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.delete(`/user/myFavorites/${petId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("update my favorite list error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const getMessagesByPet = async (petId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.get(`/user/messages/${petId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("get messages error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const postMessage = async (petId: string, message: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.post(`/user/messages/${petId}`, { message }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("post message error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const replyMessage = async (msgId: string, message: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.put(`/user/messages/${msgId}`, { message }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("reply message error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}

export const deleteMessage = async (msgId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorize action, please login and try again.", { position: "bottom-left" });
        }

        const res = await axiosInstance.delete(`/user/messages/${msgId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.log("delete message error: ", error);
        if (error instanceof AxiosError && error.response) {
            toast.error(error?.response?.data?.message, { position: "bottom-left" });
        } else {
            toast.error("System error, please try again later.", { position: "bottom-left" });
        }
    }
}