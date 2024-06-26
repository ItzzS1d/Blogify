import axios from "axios";

const axio = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default axio;
