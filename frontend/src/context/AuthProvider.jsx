import { createContext, useEffect, useState } from "react";
import axio from "./../utils/axios";



export const AuthContext = createContext();
const defaultAuthInfo = {
  user: "",
  isLoggedIn: false,
  isPending: false,
  error: "",
};
const AuthProvider = ({ children }) => {

  const [userInfo, setUserInfo] = useState(defaultAuthInfo);
  const handleLogin = async (user) => {
    setUserInfo({ ...userInfo, isPending: true });
    try {
      const { data } = await axio.post("/user/login", user);

      setUserInfo({
        user: { ...data },
        isLoggedIn: true,
        isPending: false,
        error: "",
      });
      localStorage.setItem("user", JSON.stringify(data));
      
    } catch (err) {
      const { error } = err.response.data;
      setUserInfo({ ...userInfo, isPending: false, error });
    }
  };


  const handleUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserInfo({ ...userInfo, user, isLoggedIn: true });
    } else {
      setUserInfo({ ...userInfo, isLoggedIn: false });
    }
  };
  useEffect(() => {
    handleUser();
  }, []);

  const handleLogOut = async () => {
    try {
      await axio.post("/user/logout");
    } catch (err) {
      console.log(err);
    }
    setUserInfo({ ...userInfo, user: "", isLoggedIn: false });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ userInfo, handleLogin, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
