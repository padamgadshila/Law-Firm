import { useAxios } from "../hook/fetch.hook";

export const auth = async (getCookie) => {
  const { post } = useAxios;
  try {
    return await post(
      "/api/auth",
      {},
      {
        headers: { Authorization: `Bearer ${getCookie()}` },
      }
    );
  } catch (error) {
    throw error;
  }
};
