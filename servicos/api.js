import axios from "axios";
const api = axios.create({
  baseURL: "https://localizacao-9e104-default-rtdb.firebaseio.com/",
});

export default api;
