import React from "react";

const Copyright = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Copyright Notice
        </h1>
        <p className="text-gray-600 mb-4">
          Copyright &copy; {new Date().getFullYear()} All rights reserved.
          Designed & developed by{" "}
          <a
            className="text-blue-500"
            target="_blank"
            rel="noreferrer"
            href="https://wa.me/7757069284?text=Hi%20Padam"
          >
            Padam Gadshila{" "}
          </a>
          & Shravni
        </p>
        <div className="mt-6">
          <a href="/" className="text-blue-500 hover:underline">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
