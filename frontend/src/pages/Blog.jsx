import React, { useEffect, useState } from "react";
import axio from "../utils/axios";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    try {
      const fetchBlogs = async () => {
        const { data } = await axio.get("/blogs");
        setBlogs(data);
      };
      fetchBlogs();
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }, []);

  return (
    <>
      {!blogs ? (
        <h1 className="text-center font-semibold text-4xl mt-14">
          Getting blogs...
        </h1>
      ) : (
        <div className="max-w-screen-xl  m-auto mt-14">
          <h1 className="text-4xl font-bold text-center mb-5">Blogs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {blogs &&
              blogs.map((blog) => (
                <Link to={`/blog/${blog._id}`} key={blog._id}>
                  <div className="flex flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <img src={blog.image} alt="" className="rounded-md" />
                    <h4>{blog.title}</h4>
                    <h6 className=" my-3">
                      Author :{" "}
                      <span className="font-semibold">
                        {blog.author.firstName}
                      </span>
                    </h6>
                    <p>{blog.summary}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
