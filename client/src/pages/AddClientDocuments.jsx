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

let AddClientDocuments = () => {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { post } = useAxios();
  const id = location.search.split("=")[1];
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
      clientId: id || "",
      documentNo: "",
      village: "",
      gatNo: "",
      extraInfo: "",
      year: "",
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

        formData.append("extraInfo", values.extraInfo);
        formData.append("documentNo", values.documentNo);
        formData.append("village", values.village);
        formData.append("gatNo", values.gatNo);
        formData.append("clientId", values.clientId);
        formData.append("year", values.year);
        const { data, status } = await post(
          "/api/addClientDocument",
          formData,
          token
        );
        if (status === 200) {
          toast.success(data.message);
          setActiveTab(2);
          const role = localStorage.getItem("role");
          console.log(role === "Admin");
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
  const currentYear = 2025;
  const startYear = 1940;
  const years = [];

  // Generate years from 2025 to 1940
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
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

  const getAvailableDocTypes = (currentIndex) => {
    const selectedTypes = documents
      .map((doc, i) => (i !== currentIndex ? doc.documentType : null))
      .filter(Boolean);
    return docTypes.filter((type) => !selectedTypes.includes(type));
  };

  return (
    <div className="w-full h-full overflow-y-scroll flex justify-center bg-white">
      <form className="w-[750px]  p-5 mt-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-4xl font-bold text-center">Uploads</h1>
        <div className="flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Client Id</label>
            <input
              className={styles.input}
              placeholder="Client Id"
              {...formik.getFieldProps("clientId")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Village name</label>
            <input
              className={styles.input}
              placeholder="Village name"
              {...formik.getFieldProps("village")}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Gat No.</label>
            <input
              className={styles.input}
              placeholder="Gat No."
              {...formik.getFieldProps("gatNo")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Document Type</label>
            <select
              id="type"
              {...formik.getFieldProps("docType")}
              className={styles.input}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              <option value="Notary">Notary</option>
              <option value="Sub-Registrar">Sub-Registrar</option>
              <option value="Only Type">Only Type</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Document No.</label>
            <input
              className={styles.input}
              placeholder="Document No."
              {...formik.getFieldProps("documentNo")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Year No.</label>
            <select className={styles.input} {...formik.getFieldProps("year")}>
              <option value="" disabled={true}>
                Select Year
              </option>
              {years.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                <option>Select document</option>
                {getAvailableDocTypes(i).map((type, i) => (
                  <option value={type} key={i}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col my-2">
              <label className="text-[18px] ml-1">Filename</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Filename"
              />
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

        <div className="w-full flex flex-col my-2">
          <label className="text-xl ml-1">Extra info (Optional)</label>
          <textarea
            className={styles.input}
            style={{ height: "150px" }}
            placeholder="Enter additional information about the document"
            {...formik.getFieldProps("extraInfo")}
          ></textarea>
        </div>
        <button className={styles.button} type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};
export default AddClientDocuments;
