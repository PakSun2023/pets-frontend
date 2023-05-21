import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import CreatePet from "./pages/CreatePetPage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = window.localStorage.getItem("token");

    if (!token) {
        return <Navigate to={"/"} replace />;
    }

    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/pet/add",
                element: <ProtectedRoute>
                    <CreatePet />
                </ProtectedRoute>,
            },
        ],
    },
]);

export default router;