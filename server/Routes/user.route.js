import { Router } from "express";
import {
  add,
  addClient,
  addEmployee,
  login,
} from "../Controller/user.controller.js";
import { authorize } from "../Auth/auth.js";

const userRouter = Router();

// Add admin
userRouter.post("/add", add);

// Add Employee
userRouter.post("/addEmployee", authorize("Admin"), addEmployee);

// login
userRouter.post("/login", login);

// Add Clients
userRouter.post("/addClient", authorize(["Admin", "Employee"]), addClient);
export default userRouter;
