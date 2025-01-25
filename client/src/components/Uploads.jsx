import React, { useEffect, useState } from "react";
import { getToken } from "../helper/getCookie";
import { useAxios } from "../hook/fetch.hook";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPrint,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
let Uploads = ({
  uploadedData,
  setUploadedData,
  removeUploadedData,
  selectedRecords,
  setSelectedRecords,
  setOperation,
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
        console.log(data);
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
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting client.");
    }
  };

  useEffect(() => {
    getUploadedDoc();
    console.log(uploadedData);
  }, []);

  useEffect(() => {
    setOperation(selectedRecords.length > 0);
  }, [selectedRecords, setOperation]);
  const handleCheckboxChange = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(filteredData.map((data) => data._id));
    } else {
      setSelectedRecords([]);
    }
  };
  const TableRows = ({ data, i }) => {
    const role = localStorage.getItem("role");

    return (
      <tr className="hover:bg-gray-100" key={i}>
        <td className="px-4 py-2 border">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={selectedRecords.includes(data._id)}
            onChange={() => {
              handleCheckboxChange(data._id);
            }}
          />
        </td>
        <td className="px-4 py-2 border">{data._id || "-"}</td>
        <td className="px-4 py-2 border">{data.documentNo || "-"}</td>
        <td className="px-4 py-2 border">{data.village || "-"}</td>
        <td className="px-4 py-2 border">{data.gatNo || "-"}</td>
        <td className="px-4 py-2 border">{data.year || "-"}</td>
        <td className="px-4 py-2 border">{data.extraInfo || "-"}</td>
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
      </tr>
    );
  };
  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Select",
          "Client Id",
          "Document No",
          "Village",
          "Gat No",
          "Year",
          "Extra",
        ].map((header, index) => (
          <th
            key={index}
            className={`bg-gray-300 px-4 py-2 ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${index === 14 && !isAdmin ? "rounded-tr-xl" : ""}`}
          >
            {index === 0 ? (
              <input
                type="checkbox"
                className="w-5 h-5"
                onChange={handleSelectAll}
                checked={
                  selectedRecords.length > 0 &&
                  selectedRecords.length === filteredData.length
                }
              />
            ) : (
              header
            )}
          </th>
        ))}
        {isAdmin && (
          <th
            colSpan={4}
            className="bg-gray-300 px-4 py-2 text-center rounded-tr-xl"
          >
            Action
          </th>
        )}
        {!isAdmin && (
          <th
            colSpan={3}
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
    <title>${e.fname} ${e.mname} ${e.lname}</title>
    <style>
      body {font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f9f9f9;}.container {
        width: 8in;margin: 20px auto;padding: 20px;border: 1px solid #ccc;background-color: #fff;position:relative;}
        .heading{margin-top: 20px;font-weight: bold;font-size:24px;text-align:center;color: #000;}
        .subheading {font-size: 18px;font-weight: bold;margin: 20px 0 10px;}.info-row {display: 
        flex;align-items: center;}.info-item {display:block;padding: 10px;      
        border: 1px solid #ccc;width:100%;}.documents-section {margin-top: 20px;}
        .document-item {display: block;margin-bottom: 5px;}.doc1{display:block;position:absolute;
        top:10px;left:10px;} ul{list-style:none;}    
    </style>
  </head>
  <body>
    <div class="container">

      <h1 class="heading">Client Information</h1>
      <br />
     
      <div class="info-row">
        <span class="info-item">
          <b>Client ID: </b> ${e._id}
        </span>    
        <span class="info-item">
          <b>Document no: </b> ${e.documentNo}
        </span>
      </div>
      <div class="info-row">
          <span class="info-item">
          <b>Village: </b> ${e.village}
        </span>
        <span class="info-item">
          <b>Gat no: </b> ${e.gatNo}
        </span>
      </div>

      <div class="info-row">
        <span class="info-item">
          <b>Document type: </b> ${e.docType}
        </span>  
      </div> 

      <h2 class="subheading">Documents Information</h2>
       <div class="documents-section"></div>
  <ul>
    ${
      e?.document.length > 0
        ? e?.document
            .map(
              (doc, i) => `
            <li class="di" key="${i}">
            ${
              isImage(doc.filename)
                ? `
              <h3>${doc.documentType}</h3>
                <img src="http://localhost:3500/${doc.filename}" style="width:50%" alt="${doc.documentType}" />
              `
                : ""
            }
            </li>
          `
            )
            .join("")
        : `<li>No files available</li>`
    }
  </ul>
  
      </div>
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
