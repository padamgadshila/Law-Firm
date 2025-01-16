import React, { useEffect, useState } from "react";
import { getToken } from "../helper/getCookie";
import { useAxios } from "../hook/fetch.hook";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
let Uploads = ({
  uploadedData,
  setUploadedData,
  removeUploadedData,
  selectedRecords,
  setSelectedRecords,
}) => {
  const token = getToken();
  const { get } = useAxios();
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

  useEffect(() => {
    getUploadedDoc();
    console.log(uploadedData);
  }, []);

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
        <td className="px-4 py-2 border">{data.clientId || "-"}</td>
        <td className="px-4 py-2 border">{data.documentNo || "-"}</td>
        <td className="px-4 py-2 border">{data.village || "-"}</td>
        <td className="px-4 py-2 border">{data.gatNo || "-"}</td>
        <td className="px-4 py-2 border">{data.year || "-"}</td>
        <td className="px-4 py-2 border">{data.extraInfo || "-"}</td>
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
                // onClick={() => deleteClient(data._id)}
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
              //   printDocument(data);
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
              //   printDocument(data);
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
  return (
    <div className="absolute w-full h-full px-2">
      <table className="border-collapse w-full text-left table-auto">
        <TableHeader isAdmin={role === "Admin"} />
        <TableBody
          filteredData={filteredData}
          isAdmin={role === "Admin"}
          //   deleteClient={deleteClient}
        />
      </table>
    </div>
  );
};

export default Uploads;
