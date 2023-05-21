import React, { useEffect, useState } from "react"
import { userLogin } from "../api";
import axios from "axios";

interface IUser {
    username: string;
    email: string;
    role: "admin" | "staff" | "user";
}

interface IAuthContext {
    isAuthenticated: boolean;
    user: IUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const initAuthContext: IAuthContext = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: async () => { },
    logout: () => { },
};

export const AuthContext = React.createContext<IAuthContext>(
    initAuthContext
);

const AuthProvider = ({ children }: { children: React.ReactElement }) => {
    const [user, setUser] = useState(initAuthContext.user);
    const [isLoading, setIsLoading] = useState(initAuthContext.isLoading);
    const [isAuthenticated, setIsAuthenticated] = useState(initAuthContext.isAuthenticated);

    useEffect(() => {
        initAuth()
    }, []);

    const initAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            const data = res.data;
            if (data?.success && data?.user) {
                const user = data.user;
                setUser({
                    username: user?.username ?? "",
                    email: user?.email ?? "",
                    role: user?.role
                })
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                window.location.replace("/");
            }
        } catch (error) {
            console.log("initialize authorization error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const res = await userLogin(email, password);

        if (res?.success && res?.user && res?.token) {
            localStorage.setItem("token", res.token);
            const user = res?.user;
            setUser({
                username: user?.username ?? "",
                email: user?.email ?? "",
                role: user?.role
            })

            setIsAuthenticated(true);
        };

        setIsLoading(false);
    }

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        window.location.replace("/");
    }

    return (
        <AuthContext.Provider value={
            { user, isAuthenticated, isLoading, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider