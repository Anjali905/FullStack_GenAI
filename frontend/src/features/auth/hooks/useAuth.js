import { useContext ,useEffect} from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe, logout } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      setUser(response.user);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const response = await register({ username, email, password });
      setUser(response.user);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  };
  const handleGetMe = async () => {
    setLoading(true);
    try {
      const response = await getMe();
      setUser(response.user);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
      setUser(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleGetMe,
    handleLogout,
  };
};
  useEffect(()=>{
    const getAndSetUser = async()=>{
      const data = await getMe();
      setUser(data.user);
      setLoading(false);
    }
    getAndSetUser();
  },[])