import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        let { data } = await axios.get(
          "https://newsapi.org/v2/everything?q=blockchain&business&sortBy=publishedAt&language=en&apiKey=2a4e4347946b4291ba6a55be53546f9e"
        );
        if (data) {
          setNews(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      {!news ? (
        <h1 className="text-4xl text-center mt-40  ">
          Getting news sit tight...
        </h1>
      ) : (
        <>
          <h1 className="text-3xl text-center font-semibold mt-10">
            Latest News
          </h1>
          <div className="max-w-screen-xl m-auto mt-10 grid w-[80%] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {news.map((newsItem,i) => {
              const maxLength = 100;
              let truncatedDescription = newsItem.description;
              if (
                newsItem.description &&
                newsItem.description.length > maxLength
              ) {
                truncatedDescription =
                  newsItem.description.substring(0, maxLength) + "...";
              }

              return (
                <Link to={newsItem.url} target="_blank" key={i}>
                  <div className="flex flex-col p-4 bg-slate-500/5 ring-1 ring-slate-900/5 rounded-3xl overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300">
                    <img
                      src={newsItem.urlToImage}
                      alt="news"
                      className="block object-cover rounded-2xl w-full h-44 bg-white"
                    />
                    <h1 className=" text-lg text-left mt-4 font-semibold line-clamp-3 mb-2">
                      {newsItem.title}.
                    </h1>
                    <p>{truncatedDescription}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
