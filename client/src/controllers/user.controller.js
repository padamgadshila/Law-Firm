import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
// import { getCookie } from "../helper/getCookie";

export let login = async (values) => {
  try {
    return await axios.post("/api/login", values);
  } catch (error) {
    throw error;
  }
};
