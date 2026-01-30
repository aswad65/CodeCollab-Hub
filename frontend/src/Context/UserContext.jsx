import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { router } from '../routes/Router'

const UserContext = createContext()
export const UserContextProvider = ({ children }) => {
    const [users, setusers] = useState([])
    const [user, setuser] = useState(null)
    const url='https://backend-cv0c.onrender.com'


    async function registerUser(email, password) {
        try {
            const data = await axios.post(
                `${url}/api/user/register`,
                { email, password },
                { withCredentials: true }
            );
            // Set client-side login flag
            // localStorage.setItem('isLoggedIn', '1');
            router.navigate({ to: "/" });
            toast.success(data.data.message);
            localStorage.setItem('token', data.data.token);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            router.navigate({ to: "/register" });
            console.log(error.response?.data?.message);
        }
    }

    async function loginUser(email, password) {
        try {
            const data = await axios.post(
                `${url}/api/user/login`,
                { email, password },
                { withCredentials: true }
            );
            router.navigate({ to: "/" });
            localStorage.setItem('token', data.data.token);
            toast.success(data.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            router.navigate({ to: "/login" });
        }
    }
        async function logoutUser() {
            try {
                const data = await axios.get(`${url}/api/user/logout`, {}, { withCredentials: true });
                localStorage.removeItem('token');
                toast.success(data.data.message);
                router.navigate({ to: "/login" });
            } catch (error) {
                toast.error(error.response?.data?.message || "Logout failed");
            }
        }
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(
                    `${url}/api/user/profile`,
                    { withCredentials: true }
                );
                setuser(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, []);
    const getAll = async () => {
        try {
            const { data } = await axios.get(
                `${url}/api/user/Getallusers`,
                { withCredentials: true }
            );

            setusers(data.users || data || []);
        } catch (err) {
            console.log(err);
            toast.error("User cannot fetch");
        }
    

    }

    return (
        <UserContext.Provider value={{
            registerUser,
            loginUser,
            logoutUser,
            getAll,
            users,
            user
        }}>
            {children}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </UserContext.Provider>
    )
}
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within UserContextProvider");
    }
    return context;
};

