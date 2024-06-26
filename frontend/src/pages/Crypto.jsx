import axios from "axios";
import { useEffect, useState } from "react";

const Crypto = () => {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    const getCoins = async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      );
      setCoins(data);
    };
    getCoins();
  }, []);
  return (
    <div className="max-w-screen-xl  m-auto mt-14">
      {coins.length === 0 ? (
        <h1 className="text-2xl text-center">Loading...</h1>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-center mb-10 ">
            Top Trending Coins
          </h1>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-20">
                <tr className="font-semibold text-xl text-black text-start p-7 ">
                  <th>No.</th>
                  <th>Coin</th>
                  <th className="hidden md:flex">Symbol</th>
                  <th>Price</th>
                  <th>24h</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b text-gray-20 p-6 text-center text-lg  "
                    
                  >
                    <td className="p-2 py-5">{index + 1}</td>
                    <td className="p-2">
                      <div className="sm:w-[30%] flex items-center text-left mx-auto gap-x-2 text-gray-20">
                        <img src={coin.image} alt="" height={30} width={30} />
                        {coin.name}
                      </div>
                    </td>
                    <td className="p-2 hidden  md:flex">
                      {coin.symbol.toUpperCase()}
                    </td>
                    <td className="p-2">${coin.current_price.toFixed(2)}</td>
                    <td
                      className={`p-2 ${
                        coin.price_change_percentage_24h < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Crypto;
