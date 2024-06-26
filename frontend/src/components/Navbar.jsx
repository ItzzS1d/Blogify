import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { CgMenuRight } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthProvider";
import Logo from "../assets/Logo.jpg";

const defaultImg =
  "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?size=626&ext=jpg&ga=GA1.1.65206403.1718193388&semt=ais_user";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userInfo, handleLogOut } = useContext(AuthContext);
  const { user } = userInfo;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navbarStyles = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "white",
    boxShadow: "0 5px 5px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    // container
    <>
      <div
        className="flex items-center px-5 justify-between max-w-screen-xl  m-auto mt-2  rounded-[30px] min-w-[264px] "
        style={navbarStyles}
      >
        {/* logo */}
        <Link to="/">
          {" "}
          <img src={Logo} alt="logo" className="w-16 rounded-xl" />
        </Link>
        {/*pc links */}
        <ul className="md:flex hidden gap-16 font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-black"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/crypto"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-black"
            }
          >
            Crypto
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-black"
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/blog/new"
            className={({ isActive }) =>
              isActive ? "text-blue-500" : "text-black"
            }
          >
            Submit
          </NavLink>
        </ul>
        {/* login/signupBtn */}
        <div className="flex gap-2 items-center">
          {/* login */}

          {isMenuOpen ? (
            <IoCloseOutline
              size={30}
              className="md:hidden"
              onClick={toggleMenu}
            />
          ) : (
            <CgMenuRight size={26} className="md:hidden" onClick={toggleMenu} />
          )}
          {userInfo.isLoggedIn || (
            <Link to="/user/login">
              <div className="hidden  md:flex items-center gap-1 hover:bg-gray-200 rounded-[20px] px-4 p-2 ">
                <AiOutlineUser size={19} />
                <h3 className="font-semibold">Log In</h3>
              </div>
            </Link>
          )}
          {userInfo.isLoggedIn ? (
            <Link to={`/user/${user._id}`}>
              <img
                src={userInfo.profileImg || defaultImg}
                alt=""
                className="h-[68px] w-[68px] rounded-2xl object-cover"
              />
            </Link>
          ) : (
            <Link to="/user/signup">
              <button className="bg-blue-500 text-white font-semibold p-2 rounded-[20px] px-4">
                Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* mobile menu */}
      {isMenuOpen && (
        <div className="w-[380px] m-auto ">
          <div
            className="md:hidden flex justify-center mt-5 text-center py-4 rounded-2xl"
            style={{ boxShadow: "0 5px 5px 5px rgba(0, 0, 0, 0.1)" }}
          >
            <ul
              className=" md:hidden font-semibold flex flex-col gap-5 "
              onClick={toggleMenu}
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "text-black"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/crypto"
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "text-black"
                }
              >
                Crypto
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "text-black"
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/blog/new"
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "text-black"
                }
              >
                Submit
              </NavLink>
            </ul>
          </div>
        </div>
      )}
      {/* dropDownMenu */}
    </>
  );
};

export default Navbar;
