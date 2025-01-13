import React from "react";
import { Link } from "react-router-dom";
import style from "../css/style.module.css";
let Home = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[300px] h-auto flex flex-col">
        <Link className={style.button} to="/login?Admin">
          Admin
        </Link>

        <Link className={style.button} to="/login?Employee">
          Employee
        </Link>
      </div>
    </div>
  );
};

export default Home;
