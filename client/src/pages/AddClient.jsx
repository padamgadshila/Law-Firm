import React, { useEffect, useState } from "react";
import styles from "../css/style.module.css";
import { useFormik } from "formik";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../hook/fetch.hook";
import { getToken } from "../helper/getCookie";
let AddClient = () => {
  const token = getToken();
  const { post, get } = useAxios();
  const navigate = useNavigate();
  let [id, setId] = useState(0);
  const formik = useFormik({
    initialValues: {
      clientId: "",
      fname: "",
      mname: "",
      lname: "",
      email: "",
      mobile: "",
      caseType: "",
      dob: "",
      state: "",
      city: "",
      village: "",
      pincode: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { data, status } = await post("/api/addClient", values, token);
        if (status === 200) {
          toast.success(data.message);
          if (localStorage.getItem("role") === "Admin") {
            navigate("/admin");
          } else {
            navigate("/employee");
          }
        }
      } catch (error) {
        toast.error(error.response.data.error || "Something went wrong..!");
      }
    },
  });
  useEffect(() => {
    const getLastId = async () => {
      try {
        const { data, status } = await get("/api/getId", token);
        if (status === 200) {
          setId(parseInt(data?.counter?.count) + 1);
          console.log(data);
        }
      } catch (error) {
        if (error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error(error);
        }
      }
    };
    getLastId();
  }, [get, token]);

  useEffect(() => {
    formik.setFieldValue("clientId", id);
  }, [id]);
  return (
    <div className="w-full h-full flex justify-center">
      <Toaster />
      <form
        className="border w-[650px]  p-5 rounded-md shadow-md mt-5"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-4xl font-bold text-center">Client Information</h1>
        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Client Id</label>
            <input
              type="text"
              className={styles.input}
              disabled={true}
              placeholder="Client Id"
              {...formik.getFieldProps("clientId")}
            />
          </div>
        </div>
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

          <div className="w-full flex gap-2">
            <div className="w-full flex flex-col my-2">
              <label className="text-xl ml-1">Mobile</label>
              <input
                type="text"
                maxLength="10"
                className={styles.input}
                placeholder="Mobile No."
                {...formik.getFieldProps("mobile")}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <div className="w-full flex flex-col my-2">
            <label className="text-xl ml-1">Dob</label>
            <input
              type="date"
              className={styles.input}
              placeholder="Dob"
              {...formik.getFieldProps("dob")}
            />
          </div>
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
              maxLength="6"
              placeholder="Pincode"
              {...formik.getFieldProps("pincode")}
            />
          </div>
        </div>

        <button className={styles.button} type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddClient;
