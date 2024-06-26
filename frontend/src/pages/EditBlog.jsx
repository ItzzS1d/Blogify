import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import axio from "../utils/axios";

const EditBlog = () => {
  const [blog, setBlog] = useState({});
 
 
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFormSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const summary = form.summary.value;
    const content = form.content.value;
    const obj = { title, summary, content, image: img };
    try {
      const editPost = async () => {
        await axio.patch(`/blogs/update/${id}`, obj);
        setLoading(false);
        navigate("/blogs");
      };
      editPost();
    } catch (err) {
      const { error } = err.response.data;
      console.log(error);
    }
  };
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
  return (
    <div className="max-w-screen-xl  m-auto mt-14">
      <form className="w-[80%] m-auto" onSubmit={handleFormSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2 ">
          <div>
            <label
              htmlFor="Title"
              className="block mb-2 text-lg font-semibold  text-gray-900 dark:text-white "
            >
              Title
            </label>
            <input
              type="text"
              id="Title"
              
              defaultValue={blog?.title}
              name="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Summary
            </label>
            <input
              type="text"
              id="summary"
              defaultValue={blog?.summary}
              
              name="summary"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="summary"
              required
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                onChange={handleImgChange}
                className="hidden w-full"
                accept="image/*"
                required
              />
            </label>
          </div>
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Content
            </label>
            <textarea
              type="text"
              id="content"
             
              defaultValue={blog?.content}
              name="content"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="content"
              rows="14"
              cols="25"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {loading ? "Wait..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
