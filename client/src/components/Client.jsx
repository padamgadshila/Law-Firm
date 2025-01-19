import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";

let Client = ({
  toast,
  clientData,
  filteredData,
  setFilteredData,
  setOperation,
  selectedRecords,
  setSelectedRecords,
  selectedFilter,
  setSelectedFilter,
  removeClient,
  setClientData,
}) => {
  const token = getToken();
  const { get, remove } = useAxios();
  const handleCheckboxChange = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(filteredData.map((data) => data.clientId));
    } else {
      setSelectedRecords([]);
    }
  };

  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredData(clientData);
    } else if (selectedFilter === "Hidden Clients") {
      setFilteredData(clientData.filter((data) => data.hide === true));
    } else if (selectedFilter === "Visible Clients") {
      setFilteredData(clientData.filter((data) => data.hide === false));
    } else {
      setFilteredData(
        clientData.filter((data) => {
          return (
            data?.status === selectedFilter || data?.docType === selectedFilter
          );
        })
      );
    }
  }, [selectedFilter, clientData, setFilteredData]);

  useEffect(() => {
    setOperation(selectedRecords.length > 0);
  }, [selectedRecords, setOperation]);

  // useEffect(() => {
  //   if (query.filter && query.search) {
  //     const filtered = originalClientData.filter((item) =>
  //       item[query.filter]?.toLowerCase().includes(query.search.toLowerCase())
  //     );
  //     setClientData(filtered);
  //   } else {
  //     setClientData(originalClientData);
  //   }
  // }, [query]);

  // const clientDocs = useClientDocumentsStore((state) => state.clientDocs);
  // const setClientDocs = useClientDocumentsStore((state) => state.setClientDocs);

  // const getDocuments = async (_id) => {
  //   try {
  //     const { data, status } = await getClientDocuments(_id);
  //     if (status === 201) {
  //       setClientDocs({
  //         userId: data.docs?.userId || null,
  //         document: data.docs?.document || [],
  //         info: data.docs?.info || null,
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.error || "Error fetching documents.");
  //   }
  // };

  const isImage = (filename) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const ext = filename.split(".").pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const printDocument = async (e) => {
    try {
      const { data, status } = await get(`/api/clientDocs?id=${e._id}`, token);

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
    <span class="doc1"><b>Document no:</b>${e.docNo}</span>
      <h1 class="heading">Client Information</h1>
      <br />
      <h2 class="subheading">Personal Information</h2>
      <div class="info-row">
        <span class="info-item">
          <b>Client ID: </b> ${e._id}
        </span>    
        <span class="info-item">
          <b>Full name: </b> ${e.fname} ${e.mname} ${e.lname}
        </span>
      </div>
      <div class="info-row">
          <span class="info-item">
          <b>Mobile no: </b> ${e.mobile}
        </span>
        <span class="info-item">
          <b>Email: </b> ${e.email}
        </span>
      </div>
      <div class="info-row">
             <span class="info-item">
          <b>Dob: </b> ${e.dob}
        </span>
        <span class="info-item">
          <b>Gender: </b>${e.gender}
        </span>      

      </div>
      <div class="info-row">
        <span class="info-item">
          <b>Case Type: </b> ${e.caseType}
        </span>
        <span class="info-item">
          <b>Document type: </b> ${e.docType}
        </span>

                
      </div> 
      <div class="info-row">
      <span class="info-item">
          <b>Address: </b>${e.address?.state}, ${e.address?.city}, ${
        e.address?.village
      }, ${e.address?.pincode}
        </span>
      </div>
      <h2 class="subheading">Documents Information</h2>
      <div class="documents-section">
  <ul>
    ${
      data.docs?.document.length > 0
        ? data.docs?.document
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

  const TableRows = ({ data, i }) => {
    const role = localStorage.getItem("role");

    return (
      <tr className="hover:bg-gray-100" key={i}>
        <td className="px-4 py-2 border">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={selectedRecords.includes(data.clientId)}
            onChange={() => {
              handleCheckboxChange(data.clientId);
            }}
          />
        </td>
        <td className="px-4 py-2 border">{data.clientId || "-"}</td>
        <td className="px-4 py-2 border">
          {data.fname} {data.mname} {data.lname}
        </td>
        <td className="px-4 py-2 border">{data.mobile || "-"}</td>

        <td className="px-4 py-2 border">{data.email || "-"}</td>
        <td className="px-4 py-2 border">{data.caseType || "-"}</td>
        <td className="px-4 py-2 border">
          {data.address?.state} {data.address?.city} {data.address?.village}{" "}
          {data.address?.pincode}{" "}
        </td>
        <td className="px-4 py-2 border">{data.status || "-"}</td>
        <td className="px-4 py-2 border text-center cursor-pointer">
          <Link
            to={`/edit?id=${data._id}`}
            className="block px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            Edit
          </Link>
        </td>
        {role === "Admin" && (
          <>
            <td className="px-4 py-2 border text-center cursor-pointer ">
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
                onClick={() => deleteClient(data._id)}
              >
                Delete
              </button>
            </td>
          </>
        )}
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "print");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
          >
            Print
          </button>
        </td>
        <td className="px-4 py-2 border text-center cursor-pointer ">
          <button
            onClick={() => {
              localStorage.setItem("print", "view");
              printDocument(data);
            }}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-700"
          >
            Preview
          </button>
        </td>
      </tr>
    );
  };

  const TableHeader = ({ isAdmin }) => (
    <thead className="sticky top-0">
      <tr className="text-black">
        {[
          "Select",
          "Client Id",
          "Name",
          "Mobile No",
          "Email",
          "Case Type",
          "Address",
          "Status",
          // "Documents",
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

  const getClientData = async () => {
    try {
      const { data, status } = await get("/api/getClients", token);
      if (status === 200) {
        setClientData(data.clientData);
        // setOriginalClientData(data.clientData);
        // setFilteredData(data.clientData);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching data.");
    }
  };

  useEffect(() => {
    getClientData();
  }, []);

  const deleteClient = async (_id) => {
    try {
      const { data, status } = await remove(
        `/api/deleteClient?id=${_id}`,
        token
      );
      if (status === 200) {
        toast.success(data.message);
        removeClient(_id);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting client.");
    }
  };

  const role = localStorage.getItem("role");
  return (
    <div className="absolute w-full h-full px-2">
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={role === "Admin"} />
        <TableBody
          filteredData={filteredData}
          isAdmin={role === "Admin"}
          deleteClient={deleteClient}
        />
      </table>
    </div>
  );
};

export default Client;
