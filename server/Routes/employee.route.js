import { Router } from "express";
import {
  deleteEmployee,
  getEmployee,
  getEmployeeById,
  updateEmployee,
} from "../controller/employee.controller.js";
import { authorize } from "../Auth/auth.js";
const employeeRouter = Router();

// Get Employee
employeeRouter.get("/getEmployee", authorize("Admin"), getEmployee);

// Delete Employee
employeeRouter.delete("/deleteEmployee", authorize("Admin"), deleteEmployee);

// Get employee by Id
employeeRouter.get("/employeeData", authorize("Admin"), getEmployeeById);

//  Update employee data
employeeRouter.put("/updateEmployee", authorize("Admin"), updateEmployee);

export default employeeRouter;
