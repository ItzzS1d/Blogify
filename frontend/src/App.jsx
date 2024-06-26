import React from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Footer from "./pages/Footer";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import Submit from "./pages/Submit";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Crypto from "./pages/Crypto";
import SingleBlog from "./pages/SingleBlog";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordOtpVerification from "./pages/auth/ForgotPasswordOtpVerification";
import Profile from "./pages/Profile";
import EditBlog from "./pages/EditBlog";

const App = () => {
  return (
    <div>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route
          path="/user/Forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/user/verify-otp"
          element={<ForgotPasswordOtpVerification />}
        />

        {/* Routes with Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/blog/new" element={<Submit />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/blog/edit/:id" element={<EditBlog />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
