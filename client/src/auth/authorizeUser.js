import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { auth } from "./auth";
import { getCookie } from "../helper/getCookie";

export const AuthorizeUser = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { status } = await auth(getCookie);
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
