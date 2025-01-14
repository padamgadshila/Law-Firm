import { useState, useCallback } from "react";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiRequest = useCallback(
    async (method, url, body = null, config = {}, params = {}) => {
      setLoading(true);
      setError(null);
      setStatus(null);
      try {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        const response = await axios({
          method,
          url: fullUrl,
          data: body,
          ...config,
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
    },
    []
  );

  const get = useCallback(
    (url, config = {}) => apiRequest("get", url, null, config),
    [apiRequest]
  );
  const post = useCallback(
    (url, body, config = {}) => apiRequest("post", url, body, config),
    [apiRequest]
  );
  const put = useCallback(
    (url, body, config = {}) => apiRequest("put", url, body, config),
    [apiRequest]
  );
  const remove = useCallback(
    (url, config = {}) => apiRequest("delete", url, null, config),
    [apiRequest]
  );

  return { data, error, status, loading, get, post, put, remove };
};
