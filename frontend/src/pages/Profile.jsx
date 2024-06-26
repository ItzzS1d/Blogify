import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axio from "../utils/axios";
import { AuthContext } from "./../context/AuthProvider";

const Profile = () => {
  const [blogs, setBlogs] = useState([]);
  const { userInfo, handleLogOut } = useContext(AuthContext);
  const { user } = userInfo;

  useEffect(() => {
    try {
      const fetchBlogs = async () => {
        const { data } = await axio.get(`/blogs/blogs-by-author`);
        setBlogs(data);
      };
      fetchBlogs();
    } catch (err) {
      const { error } = err.response.data;
      throw new Error(error);
    }
  }, []);
 

  return (
    <div className="max-w-screen-xl  m-auto mt-14 ">
   
      {userInfo.isPending ? (
        <h1 className="text-4xl">Loading...</h1>
      ) : (
        <div className="bg-slate-500/5 pl-6 pb-5 hover:shadow-lg">
          <div>
            <div className="flex justify-between items-center ">
              <h1 className="mb-5 pt-5 text-3xl ">Profile</h1>
              <Link to={"/"} onClick={handleLogOut}>
                <button className="bg-red-500 text-white p-3 rounded-lg mr-5">
                  Logout
                </button>
              </Link>
            </div>
            <img
              src={user.profileImg}
              alt="avatar"
              height={50}
              width={50}
              className="bg-transparent"
            />
            <div>
              <h1 className="my-5">
                Full Name :{" "}
                <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>
              </h1>
              <div className="flex justify-between items-center">
                <p>
                  {" "}
                  E-mail : <span className="font-semibold">{user.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
  
      <div>
        <h1 className="text-3xl mt-4 text-center mb-10">
          {blogs.length === 0 || "My Blogs"}
        </h1>
      </div>     
      <div className="space-y-20">
        {blogs.length === 0 ? (
          <h1 className="text-center text-3xl font-semibold ">
            You don't have any Blogs created
          </h1>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-500/5 py-10 px-5 rounded-lg hover:shadow-2xl"
            >
              <div className="flex gap-10 md:flex-row flex-col object-cover">
                <img
                  src={blog.image}
                  alt=""
                  height={300}
                  width={300}
                  className="rounded-lg"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold mb-3">
                      {blog.title}
                    </h1>
                   
                    
                  </div>
                  <p>{blog.content.slice(0, 500)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
