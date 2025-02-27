import React, { useEffect, useState } from "react";
import { getToken } from "../helper/getCookie";
import { useAxios } from "../hook/fetch.hook";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPlus,
  faPlusCircle,
  faPrint,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
let Uploads = ({
  setUploadedData,
  removeUploadedData,
  selectedRecords,
  setOperation,
  setActiveTab,
}) => {
  const token = getToken();
  const { get, remove } = useAxios();
  const role = localStorage.getItem("role");

  let [filteredData, setFilteredData] = useState([]);
  const getUploadedDoc = async () => {
    try {
      const { data, status } = await get("/api/getUploaded", token);
      if (status === 200) {
        setUploadedData(data.data);
        setFilteredData(data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };

  let deleteClient = async (id) => {
    try {
      const { status, data } = await remove(`/api/removeC?id=${id}`, token);
      if (status === 200) {
        removeUploadedData(id);
        toast.success(data.message);
        getUploadedDoc();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting client.");
    }
  };
  let oneFileDelete = async (id, filename) => {
    try {
      const { status, data } = await remove(
        `/api/oneFileDelete?id=${id}&filename=${filename}`,
        token
      );
      if (status === 200) {
        removeUploadedData(id);
        toast.success(data.message);
        getUploadedDoc();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting file.");
    }
  };
  useEffect(() => {
    getUploadedDoc();
  }, []);

  useEffect(() => {
    setOperation(selectedRecords.length > 0);
  }, [selectedRecords, setOperation]);

  const TableRows = ({ data, i }) => {
    const role = localStorage.getItem("role");

    return (
      <tr className="hover:bg-gray-100" key={i}>
        <td className="px-4 py-2 border">{data.clientId || "-"}</td>
        <td className="px-4 py-2 border">{data.documentNo || "-"}</td>
        <td className="px-4 py-2 border">{data.docType || "-"}</td>
        <td className="px-4 py-2 border">{data.village || "-"}</td>
        <td className="px-4 py-2 border">{data.gatNo || "-"}</td>
        <td className="px-4 py-2 border">{data.year || "-"}</td>
        <td className="px-4 py-2 border group relative cursor-pointer">
          <h1 className="text-xl">{data.filename || "-"}</h1>
          <div className="absolute w-[450px]  border top-1/2 -translate-y-1/2 transition-all duration-300 left-0 p-3 rounded-md invisible opacity-0 shadow-md group-hover:left-[50px] group-hover:visible group-hover:opacity-100 bg-white">
            <table className="border-collapse w-full text-left table-auto">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Filename</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.document.length > 0 &&
                  data.document.map((val, i) => (
                    <tr key={i}>
                      <td>
                        <h1>{val.documentType}</h1>
                      </td>
                      <td>
                        <Link
                          className="text-blue-500"
                          to={`http://192.168.0.230:3500/${val.filename}`}
                          target="_blank"
                        >
                          {val.filename}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/editFile?id=${data._id}&type=${val.documentType}&filename=${val.filename}`}
                          className="block rounded-md text-green-500 hover:text-green-700"
                          title="Update File"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </Link>
                      </td>
                      <td>
                        <button
                          className="rounded-md text-red-500 hover:text-red-700"
                          title="Delete File"
                          onClick={() => oneFileDelete(data._id, val.filename)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <hr className="my-1" />
            <Link
              to={`/addFile?id=${data._id}`}
              className="text-blue-500 text-md"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Add Files</span>
            </Link>
          </div>
        </td>
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "view");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </td>
        <td className="px-4 py-2 border text-center cursor-pointer">
          <Link
            to={`/editUploads?id=${data._id}`}
            className="block px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        </td>

        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "print");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-700"
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </td>
        {role === "Admin" && (
          <>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
                onClick={() => deleteClient(data._id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </td>
          </>
        )}
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            className="px-4 py-2 rounded-md bg-black text-white hover:bg-black"
            onClick={() => {
              if (localStorage.getItem("role") === "Admin") {
                setActiveTab(1);
              } else {
                setActiveTab(0);
              }
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </td>
      </tr>
    );
  };
  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Client Id",
          "Document No",
          "Document Type",
          "Village",
          "Gat No",
          "Year",
          "Filename",
        ].map((header, index) => (
          <th
            key={index}
            className={`bg-gray-300 px-4 py-2 ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${index === 14 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {header}
          </th>
        ))}
        {isAdmin && (
          <th
            colSpan={5}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
        {!isAdmin && (
          <th
            colSpan={4}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
      </tr>
    </thead>
  );
  const TableBody = ({ filteredData }) => {
    return (
      <tbody>
        {filteredData.length !== 0 ? (
          filteredData.map((data, i) => <TableRows data={data} key={i} />)
        ) : (
          <tr>
            <td className="px-4 py-2 border text-center" colSpan="100%">
              No records available
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  const isImage = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const ext = filename.split(".").pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const printDocument = async (e) => {
    try {
      const printableContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOC${e.documentNo}</title>
    <style>
            body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        width: 8in;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        background-color: #fff;
        position: relative;
      }
      .heading {
        margin-top: 20px;
        font-weight: bold;
        font-size: 24px;
        text-align: center;
        color: #000;
      }
      .cont {
        display: grid;
        grid-template-columns: auto auto;
        gap: 20px;
      }
      .cont img {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
 <div class="cont">
    ${
      e?.document.length > 0
        ? e?.document
            .map(
              (doc, i) =>
                `${
                  isImage(doc.filename)
                    ? `<img key="${i}" src="http://192.168.0.230:3500/${doc.filename}" alt="${doc.documentType}" />`
                    : ""
                }`
            )
            .join("")
        : `<span>No files available</span>`
    }
    </div>
  </body>
  </html>
  
    `;

      const printWindow = window.open("", "_blank");
      const print = localStorage.getItem("print");
      if (print === "print") {
        localStorage.removeItem("print");
        printWindow.document.open();
        printWindow.document.write(printableContent);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      } else if (print === "view") {
        localStorage.removeItem("print");
        printWindow.document.open();
        printWindow.document.write(printableContent);
        printWindow.document.close();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute w-full h-full px-2">
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={role === "Admin"} />
        <TableBody filteredData={filteredData} isAdmin={role === "Admin"} />
      </table>
    </div>
  );
};

export default Uploads;
