import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
import { useActiveTab } from "../store/store";

let EditFile = () => {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const { post, get } = useAxios();

  const spread = decodeURIComponent(location.search);
  const id = spread.split("&")[0].split("=")[1];
  const docType = spread.split("&")[1].split("=")[1];
  const filename = spread.split("&")[2].split("=")[1];
  const file = filename.split("-")[0];

  const setActiveTab = useActiveTab((state) => state.setActiveTab);
  const [documents, setDocuments] = useState([
    {
      documentType: docType,
      document: "",
      filename: "Select the file",
    },
  ]);

  const formik = useFormik({
    initialValues: {
      clientId: "",
      filename: file,
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let formData = new FormData();

        documents.forEach((doc, i) => {
          formData.append(`documentType-${i}`, doc.documentType);
          formData.append(`document-${i}`, doc.document);
        });

        formData.append(`clientId`, values.clientId);
        formData.append(`filename`, values.filename);
        const { data, status } = await post(
          `/api/editFile?id=${id}&filenames=${filename}`,
          formData,
          token
        );
        if (status === 200) {
          toast.success(data.message);
          setActiveTab(2);
          const role = localStorage.getItem("role");
          formik.resetForm();
          if (role === "Admin") {
            navigate("/admin");
          } else if (role === "Employee") {
            navigate("/employee");
          }
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    },
  });

  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
  };

  const handleFileSelection = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].document = file || null;
    updatedDocuments[index].filename = file.name || null;
    setDocuments(updatedDocuments);
  };

  const docTypes = [
    "Client Photo",
    "Client Signature",
    "Aadhar Card",
    "Pan Card",
    "Voter Card",
    "Driving License",
    "Ration Card",
    "Domicile Certificate",
    "Others",
  ];

  return (
    <div className="w-full h-full overflow-y-scroll flex justify-center bg-white">
      <form className="w-[700px]  p-5 mt-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-4xl font-bold text-center">Update Files</h1>

        {documents.map((doc, i) => (
          <div className="w-full flex gap-2" key={i}>
            <div className="w-full flex flex-col my-2">
              <label className="text-xl ml-1">Upload Type</label>
              <select
                className={styles.input}
                value={doc.documentType}
                onChange={(e) =>
                  handleDocumentChange(i, "documentType", e.target.value)
                }
              >
                <option value="" disabled={true}>
                  Select document
                </option>
                {docTypes
                  .filter((cur) => {
                    return cur === docType;
                  })
                  .map((cur, index) => (
                    <option key={index} value={cur}>
                      {cur}
                    </option>
                  ))}
              </select>
            </div>

            <div className="w-full flex flex-col my-2">
              <label className="text-[18px] ml-1">
                {doc.documentType} (JPG, PNG, PDF)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                id={`file-${i}`}
                style={{ display: "none" }}
                placeholder="Client Id"
                onChange={(e) => handleFileSelection(i, e.target.files[0])}
              />
              <label
                htmlFor={`file-${i}`}
                className={styles.input}
                style={{
                  border: "1px dashed",
                  lineHeight: "55px",
                  cursor: "pointer",
                  textWrap: "nowrap",
                  overflow: "hidden",
                  width: "300px",
                  textOverflow: "ellipsis",
                }}
              >
                {doc.filename}
              </label>
            </div>
          </div>
        ))}

        <button className={styles.button} type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};
export default EditFile;
