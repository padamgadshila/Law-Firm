import { Router } from "express";
import {
  add,
  addEmployee,
  addEvent,
  auth,
  bulkDelete,
  bulkEdit,
  bulkHide,
  dashboardData,
  deleteEvent,
  deleteExpiredEvents,
  downloadFile,
  fileView,
  getEvents,
  getProfile,
  getProfilePic,
  login,
  resendOtp,
  resetDocNoCounter,
  resetPassword,
  updateProfile,
  verifyEmail,
  verifyOtp,
} from "../controller/user.controller.js";
import { authorize } from "../Auth/auth.js";
import { Mail } from "../controller/mail.controller.js";
const userRouter = Router();
//auth
userRouter.post("/auth", authorize(["Admin", "Employee"]), auth);

// Add admin
userRouter.post("/add", add);

// Add Employee
userRouter.post("/addEmployee", authorize("Admin"), addEmployee);

// login
userRouter.post("/login", login);

// File to view
userRouter.get("/files/:filename", authorize(["Admin", "Employee"]), fileView);

// File to download
userRouter.get(
  "/download/:filename",
  authorize(["Admin", "Employee"]),
  downloadFile
);

// Get Profile
userRouter.get("/profile", authorize(["Admin", "Employee"]), getProfile);

// Update Profile
userRouter.put(
  "/updateProfile",
  authorize(["Admin", "Employee"]),
  updateProfile
);

// Send Mail
userRouter.post("/sendMail", Mail);

// Send Otp
userRouter.post("/sendOtp", verifyEmail);

// Get Email pic
userRouter.get("/getProfilePic", getProfilePic);

// Verify Otp
userRouter.post("/verifyOtp", verifyOtp);

// Resend Otp
userRouter.post("/resendOtp", resendOtp);

// Reset Password
userRouter.put("/resetPassword", resetPassword);

// Dashboard data
userRouter.get("/dashboardData", authorize("Admin"), dashboardData);

// Add Event
userRouter.post("/addEvent", authorize("Admin"), addEvent);

// Delete Event
userRouter.delete("/delEvent", authorize("Admin"), deleteEvent);

// Get Events
userRouter.get("/getEvents", authorize("Admin"), getEvents);

// Delete Expired Events
userRouter.delete("/expiredEvents", authorize("Admin"), deleteExpiredEvents);

// Bulk Delete
userRouter.post("/bulkDelete", authorize("Admin"), bulkDelete);

// Bulk Hide
userRouter.post("/bulkHide", authorize("Admin"), bulkHide);

// Reset Document no counter
userRouter.put("/resetCounter", resetDocNoCounter);

// Bulk Edit
userRouter.post("/bulkEdit", authorize("Admin"), bulkEdit);
export default userRouter;
