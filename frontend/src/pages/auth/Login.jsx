import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userInfo, handleLogin } = useContext(AuthContext);
  const { user } = userInfo;


  

  useEffect(() => {
    if (userInfo.error) {
      setError("");
      setError(userInfo.error);
    } else if (user) {
      navigate("/");
    }
  }, [userInfo.error , user]);
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const formData = { email, password };
    handleLogin(formData);
  };
  

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <Link to={"/"}>
            <h1 className="text-white font-bold text-4xl font-sans">Blogify</h1>
          </Link>
          <p className="text-white mt-1">
            The most popular BlogSite For Reading news and Blogs.
          </p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        <form className="bg-white" onSubmit={handleOnSubmit}>
          <h1
            className={`text-gray-800 font-bold text-2xl mb-5 ${
              error && "text-red-500"
            }`}
          >
            {error ? error : "Hello Again!"}
          </h1>

          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <input
              className="pl-2  !outline-none border-none"
              type="text"
              name="email"
              id=""
              placeholder="Email Address"
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none "
              type="text"
              name="password"
              id=""
              placeholder="Password"
            />
          </div>
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to={"/user/signup"} className="text-blue-500">
              SignUp
            </Link>
          </span>
          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-1"
          >
            {userInfo.isPending ? "Logging..." : "Login"}
          </button>
          <Link to={"/user/Forgot-password"}>
            <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">
              Forgot Password ?
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
