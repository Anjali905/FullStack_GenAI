import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,getMe,logout } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;
    const handleLogin= async({email,password})=>{
        setLoading(true);
        const response = await login({email,password});
        setUser(response.user);
        setLoading(false);
    }
    const handleRegister= async({username,email,password})=>{
        setLoading(true);
        const response = await register({username,email,password})
        setUser(response.user);
        setLoading(false);
    }
    const handleGetMe= async()=>{
        setLoading(true);
        const response = await getMe()
        setUser(response.user);
        setLoading(false);
    }
    const handleLogout= async()=>{
        setLoading(true);
        const response = await logout()
        setUser(null);
        setLoading(false);
    }
    return {user,loading,handleLogin,handleRegister,handleGetMe,handleLogout}
}