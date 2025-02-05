import React, { useEffect } from "react";
import { getToken } from "../helper/getCookie";
import { useAxios } from "../hook/fetch.hook";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPrint } from "@fortawesome/free-solid-svg-icons";
let UniversalSearch = ({ globalFData, setGlobalData }) => {
  const token = getToken();
  const { get } = useAxios();
  const role = localStorage.getItem("role");

  const getCombinedData = async () => {
    try {
      const { data, status } = await get("/api/getCombinedData", token);
      if (status === 200) {
        setGlobalData(data.result);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };

  useEffect(() => {
    getCombinedData();
  }, []);

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

      <h1 class="heading">Client Information</h1>
      <br />
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

  const TableRows = ({ data, i }) => {
    return (
      <>
        {data.infoRecords?.map((record, index) => (
          <tr className="hover:bg-gray-100" key={`${i}-${index}`}>
            <td className="px-4 py-2 border">{data?.clientId || "-"}</td>
            <td className="px-4 py-2 border">
              {data.fname || " "} {data.mname || " "} {data.lname || " "}{" "}
            </td>
            <td className="px-4 py-2 border">{data.email || "-"}</td>
            <td className="px-4 py-2 border">{data.mobile || "-"}</td>
            <td className="px-4 py-2 border">{data.caseType || "-"}</td>
            <td className="px-4 py-2 border">{record.documentNo || "-"}</td>
            <td className="px-4 py-2 border">{record.gatNo || "-"}</td>
            <td className="px-4 py-2 border">{record.year || "-"}</td>
            <td className="px-4 py-2 border">{record.docType || "-"}</td>
            <td className="px-4 py-2 border">
              {data.address.state || " "} {data.address.city || " "}{" "}
              {data.address.village || " "} {data.address.pincode || " "}{" "}
            </td>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                onClick={() => {
                  localStorage.setItem("print", "view");
                  printDocument(record);
                }}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </td>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                onClick={() => {
                  localStorage.setItem("print", "print");
                  printDocument(record);
                }}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-700"
              >
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </td>
          </tr>
        ))}
      </>
    );
  };
  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Client Id",
          "Name",
          "Email",
          "Mobile",
          "Case Type",
          "Document No",
          "Gat No",
          "Year",
          "Document Type",
          "Address",
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
  const TableBody = ({ globalFData }) => {
    return (
      <tbody>
        {globalFData.length !== 0 ? (
          globalFData.map((data, i) => <TableRows data={data} key={i} />)
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

  return (
    <div className="absolute w-full h-full">
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={role === "Admin"} />
        <TableBody globalFData={globalFData} isAdmin={role === "Admin"} />
      </table>
    </div>
  );
};
export default UniversalSearch;
