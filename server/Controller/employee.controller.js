import User from "../models/user.model.js";
import { getId } from "../helper/getObjectId.js";

// Get Employee
export let getEmployee = async (req, res) => {
  try {
    const { role } = req.query;
    const employeeData = await User.find({ role: role });

    if (!employeeData) {
      return res.status(404).json({ error: "No employee found..!" });
    }
    return res.status(200).json({ employeeData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error..!" });
  }
};

// Delete Employee
export let deleteEmployee = async (req, res) => {
  try {
    const { id, role } = req.query;
    const _id = getId(id);
    const deleteEmployee = await User.deleteOne({ _id: _id, role: role });

    if (deleteEmployee.deletedCount === 0) {
      return res.status(200).json({ error: "Employee not found..!" });
    }
    return res.status(200).json({ message: "Deleted..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

// Get employee by Id
export let getEmployeeById = async (req, res) => {
  try {
    const { id, role } = req.query;
    const eid = getId(id);
    const employeeData = await User.findOne({ _id: eid, role: role }).select(
      "-password"
    );

    if (!employeeData) {
      return res.status(404).json({ error: "Employee Not found..!" });
    }
    return res.status(200).json({ message: "Employee Found..!", employeeData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

//  Update employee data
export let updateEmployee = async (req, res) => {
  try {
    const { _id, fname, lname, email, mobile, role, username } = req.body;
    const eid = getId(_id);
    const updateEmployee = await User.findOneAndUpdate(
      { _id: eid, role: role },
      { fname, lname, email, mobile, username }
    );

    return res.status(200).json({ message: "Record Updated" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
