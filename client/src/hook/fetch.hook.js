import { useState, useCallback } from "react";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiRequest = useCallback(async (method, url, body = null, token) => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const headers = {
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      const response = await axios({
        method,
        url,
        data: body,
        headers,
      });

      setData(response.data);
      setStatus(response.status);
      return { data: response.data, status: response.status };
    } catch (err) {
      const responseError = err.response;
      setError(responseError ? responseError.data : err.message);
      setStatus(responseError ? responseError.status : null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(
    (url, token) => apiRequest("get", url, null, token),
    [apiRequest]
  );
  const post = useCallback(
    (url, body, token) => apiRequest("post", url, body, token),
    [apiRequest]
  );
  const put = useCallback(
    (url, body, token) => apiRequest("put", url, body, token),
    [apiRequest]
  );
  const remove = useCallback(
    (url, token) => apiRequest("delete", url, null, token),
    [apiRequest]
  );

  return { data, error, status, loading, get, post, put, remove };
};
