import React, { useEffect } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
import { useActiveTab } from "../store/store";

let EditUploads = () => {
  const location = useLocation();
  const id = location.search.split("=")[1];
  const token = getToken();
  const navigate = useNavigate();
  const { put, get } = useAxios();
  const setActiveTab = useActiveTab((state) => state.setActiveTab);

  const formik = useFormik({
    initialValues: {
      clientId: "",
      documentNo: "",
      village: "",
      gatNo: "",
      extraInfo: "",
      year: "",
      filename: "",
      docType: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { data, status } = await put(
          `/api/uploadUpdate?id=${id}`,
          values,
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
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error);
        }
      }
    },
  });

  useEffect(() => {
    const getUploadsById = async () => {
      try {
        const { data, status } = await get(
          `/api/getUploadsById?id=${id}`,
          token
        );
        if (status === 200) {
          formik.setValues({
            clientId: data.result?._id,
            year: data.result?.year,
            documentNo: data.result?.documentNo,
            village: data.result?.village,
            gatNo: data.result?.gatNo,
            docType: data.result?.docType,
          });
        }
      } catch (error) {
        if (error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error(error);
        }
      }
    };
    getUploadsById();
  }, []);

  const currentYear = 2025;
  const startYear = 1940;
  const years = [];

  // Generate years from 2025 to 1940
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  return (
    <div className="w-full h-full overflow-y-scroll flex justify-center bg-white">
      <form className="w-[700px]  p-5 mt-5" onSubmit={formik.handleSubmit}>
        <h1 className="text-4xl font-bold text-center">Update Information</h1>
        <div className="flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Client Id</label>
            <input
              className={styles.input}
              disabled={true}
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
          Update
        </button>
      </form>
    </div>
  );
};
export default EditUploads;
