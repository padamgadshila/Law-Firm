import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "../helper/getCookie";
import { useAxios } from "../hook/fetch.hook";

export const AuthorizeUser = ({ children }) => {
  const { post } = useAxios();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = getToken();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { status } = await post("/api/auth", {}, token);
        if (status === 200) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <FontAwesomeIcon spin={true} icon={faSpinner} className="text-9xl" />
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/expired" replace />;
};
