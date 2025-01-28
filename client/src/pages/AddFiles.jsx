import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
import { useActiveTab } from "../store/store";

let AddFiles = () => {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const { post, get } = useAxios();

  const spread = decodeURIComponent(location.search);
  const id = spread.split("&")[0].split("=")[1];

  const setActiveTab = useActiveTab((state) => state.setActiveTab);
  const [documents, setDocuments] = useState([
    {
      documentType: "",
      document: "",
      filename: "Select the file",
    },
  ]);

  const formik = useFormik({
    initialValues: {
      filename: "",
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

        formData.append(`filename`, values.filename);
        const { data, status } = await post(
          `/api/addFiles?id=${id}`,
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
  let [remainingDocTypes, setRemainingDocTypes] = useState([]);
  const addDocuments = () => {
    setDocuments([
      ...documents,
      {
        documentType: "",
        document: "",
        filename: "Select the file",
      },
    ]);
  };
  useEffect(() => {
    let getDocuments = async () => {
      try {
        const { data, status } = await get(`/api/getFiles?id=${id}`, token);
        if (status === 200) {
          const usedFiles = data.res?.map((el) => el.documentType);

          setRemainingDocTypes(
            docTypes.filter((el) => !usedFiles.includes(el))
          );
        }
      } catch (error) {
        toast.error(error.response.data.error || "Failed to get files..!");
      }
    };
    getDocuments();
  }, [get, id, token]);

  const getAvailableDocTypes = (currentIndex) => {
    const selectedTypes = documents
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);
    return remainingDocTypes.filter((type) => !selectedTypes.includes(type));
  };

  return (
    <div className="w-full h-full overflow-y-scroll flex justify-center bg-white">
      <form className="w-[700px]  p-5 mt-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-4xl font-bold text-center">Add Files</h1>

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
                {getAvailableDocTypes(i).map((cur, index) => (
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
        <button
          type="button"
          onClick={addDocuments}
          className="text-xl text-blue-500"
        >
          Add More
        </button>
        <button className={styles.button} type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};
export default AddFiles;
