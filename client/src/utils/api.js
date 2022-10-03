import axios from "axios";
axios.defaults.baseURL = "http://localhost:7000/";

const API = {
  token: undefined,
  get: (PATH) => {
    return axios.get(PATH);
  },
  post: (PATH, data) => {
    return axios.post(PATH, data);
  },
  put: (PATH, data) => {
    return axios.put(PATH, data);
  },
  delete: (PATH, data) => {
    return axios.delete(PATH, data);
  },
  setToken(token) {
    this.token = token;
    sessionStorage.setItem("token", token);
    axios.defaults.headers.common["x-access-token"] = this.token;
  },
  tokenExists() {
    if (axios.defaults.headers.common["x-access-token"]) {
      return true;
    }

    this.token = sessionStorage.getItem("token");

    if (this.token) {
      axios.defaults.headers.common["x-access-token"] = this.token;
      return true;
    }

    return false;
  },
};
export default API;
