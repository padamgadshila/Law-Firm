import React, { useEffect } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
let EditClient = () => {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { put, get } = useAxios();
  const _id = location.search.split("=")[1];
  const formik = useFormik({
    initialValues: {
      _id: "",
      fname: "",
      mname: "",
      lname: "",
      email: "",
      mobile: "",
      caseType: "",
      dob: "",
      docType: "",
      gender: "",
      state: "",
      city: "",
      village: "",
      pincode: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { data, status } = await put("/api/updateClient", values, token);
        if (status === 200) {
          toast.success(data.message);
          const role = localStorage.getItem("role");
          if (role === "Admin") {
            navigate("/admin");
          } else if (role === "Employee") {
            navigate("/employee");
          }
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });
  let getClient = async (id) => {
    try {
      const {
        data: { clientData },
        status,
      } = await get(`/api/clientData?id=${id}`, token);

      if (status === 200) {
        formik.setValues({
          _id: clientData._id || "",
          fname: clientData.fname || "",
          mname: clientData.mname || "",
          lname: clientData.lname || "",
          email: clientData.email || "",
          mobile: clientData.mobile || "",
          caseType: clientData.caseType || "",
          docType: clientData.docType || "",
          dob: clientData.dob || "",
          gender: clientData.gender || "",
          state: clientData.address?.state || "",
          city: clientData.address?.city || "",
          village: clientData.address?.village || "",
          pincode: clientData.address?.pincode || "",
        });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.error);
      }
    }
  };

  useEffect(() => {
    getClient(_id);
  }, []);
  return (
    <div className="w-full h-full flex justify-center">
      <Toaster />
      <form
        className="border w-[650px]  p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Update Information</h1>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">First name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="First Name"
              {...formik.getFieldProps("fname")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Middle name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Middle Name"
              {...formik.getFieldProps("mname")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Last name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Last Name"
              {...formik.getFieldProps("lname")}
            />
          </div>
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              {...formik.getFieldProps("email")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Gender</label>
            <select
              className={styles.input}
              {...formik.getFieldProps("gender")}
            >
              <option value="" disabled={true}>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Mobile</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Mobile No."
              {...formik.getFieldProps("mobile")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Dob</label>
            <input
              type="date"
              className={styles.input}
              placeholder="Dob"
              {...formik.getFieldProps("dob")}
            />
          </div>
        </div>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Case Type</label>
            <select
              className={styles.input}
              {...formik.getFieldProps("caseType")}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              <option value="Criminal">Criminal</option>
              <option value="Property">Property</option>
              <option value="Divorce">Divorce</option>
              <option value="Family">Family</option>
              <option value="Civil">Civil</option>
              <option value="Others">Others</option>
            </select>
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
              <option value="Subreg">Subreg</option>
              <option value="Only Type">Only Type</option>
            </select>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">State</label>
            <input
              type="text"
              className={styles.input}
              placeholder="State"
              {...formik.getFieldProps("state")}
            />
          </div>

          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">City</label>
            <input
              type="text"
              className={styles.input}
              placeholder="City"
              {...formik.getFieldProps("city")}
            />
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Village</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Village"
              {...formik.getFieldProps("village")}
            />
          </div>
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Pincode</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Pincode"
              {...formik.getFieldProps("pincode")}
            />
          </div>
        </div>

        <input type="hidden" {...formik.getFieldProps("_id")} />

        <button className={styles.button} type="submit">
          Update
        </button>
        <Link
          to={localStorage.getItem("role") === "admin" ? "/admin" : "/employee"}
          className="mt-4 text-[20px] font-bold text-blue-500 "
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3" />
          Back to Home
        </Link>
      </form>
    </div>
  );
};

export default EditClient;
