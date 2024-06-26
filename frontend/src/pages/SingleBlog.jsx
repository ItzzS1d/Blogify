import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axio from "./../utils/axios";
import { AuthContext } from "./../context/AuthProvider";

const SingleBlog = () => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState({});
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axio.get(`/blogs/${id}`);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        const { error } = err.response.data;
        setLoading(false);
        console.log(error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    try {
      const { data } = await axio.delete(`/blogs/delete/${id}`);
      alert("blog deleted successfully");
      navigate("/blogs");
    } catch (err) {
      const { error } = err.response.data;
      console.log(error);
    }
  };

  const blogOwner = blog.author?._id == userInfo?.user?._id;
  return (
    <>
      {loading ? (
        <h1 className="text-center text-3xl font-semibold mt-40">Loading...</h1>
      ) : (
        <div className="max-w-screen-xl  m-auto mt-14 flex items-start justify-center flex-col gap-8  md:flex-row hover:shadow-2xl rounded-3xl transition-all duration-300 cursor-pointer">
          {/* left */}
          <div className="flex flex-1 flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 rounded-3xl overflow-hidden cursor-default transition-all duration-300 shadow-sm">
            <h2 className="font-semibold capitalize text-3xl">{blog.title}</h2>
            <div className="my-3">
              <p>
                author :{" "}
                <span className="font-semibold">{blog.author?.firstName}</span>
                &nbsp;
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleString()
                  : new Date().getDay() +
                    "-" +
                    new Date().getMonth() +
                    "-" +
                    new Date().getFullYear()}
              </p>
            </div>
            <div>
              <img src={blog.image} alt="" className="rounded-3xl mb-6 " />
            </div>
            <p className="mb-5">{blog.content}</p>
            {blogOwner && (
              <div className="flex gap-2 my-6">
                <Link to={`/blog/edit/${blog._id}`}>
                  <button className="bg-blue-500 text-white font-semibold p-2 rounded-[20px] px-6">
                    Edit
                  </button>
                </Link>
                <button
                  className="bg-red-500 text-white font-semibold p-2 rounded-[20px] px-4"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {/* right */}
        </div>
      )}
    </>
  );
};

export default SingleBlog;
