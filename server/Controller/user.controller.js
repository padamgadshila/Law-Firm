import generateToken from "../auth/generate.token.js";
import { usernamePasswordGenerate } from "../helper/username.password.generator.js";
import User from "../models/user.model.js";
import Client from "../models/client.model.js";
import Files from "../models/files.model.js";
import Event from "../models/event.model.js";
import bcrypt from "bcryptjs";
import { getId } from "../helper/getObjectId.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Mail } from "./mail.controller.js";
import { getOtp } from "../helper/otpGenerator.js";
import Info from "../models/info.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// auth
export let auth = async (req, res) => {
  return res.status(200).json({ message: "authorized" });
};
// add new admin
export let add = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    const userExist = await User.findOne({ username, role: role });

    if (userExist) {
      return res.status(409).json({ message: "username already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashPassword,
      role,
      email,
    });

    return res.status(201).json({ message: "Account created" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//add employee
export let addEmployee = async (req, res) => {
  try {
    const { fname, lname, email, mobile, role } = req.body;
    const { username, password } = usernamePasswordGenerate(fname);

    const userExists = await User.findOne({ email, role: role });

    if (userExists) {
      return res.status(409).json({ error: "user already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newEmployee = await User.create({
      username,
      password: hashPassword,
      email,
      fname,
      lname,
      role,
      mobile,
    });

    return res.status(201).json({
      message: "Employee added..!",
      mail: {
        username: username,
        userEmail: email,
        text: { password: password },
        subject: "Registered Successfully..!",
        type: "registration",
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server error" });
  }
};

// admin or employee login
export let login = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userExist = await User.findOne({ username, role: role });

    if (!userExist) {
      return res.status(404).json({ error: "User not found..!" });
    }

    const passwordCheck = await bcrypt.compare(password, userExist.password);
    if (!passwordCheck) {
      return res.status(401).json({ error: "Password is incorrect..!" });
    }

    const user = {
      id: userExist._id,
      username: userExist.username,
      role: userExist.role,
    };
    const token = generateToken(user);

    if (userExist.role === "Admin") {
      return res.status(200).json({
        message: "Admin login successful",
        token: token,
        user,
      });
    }

    if (userExist.role === "Employee") {
      return res.status(200).json({
        message: "Employee login successful",
        token: token,
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// File to view
export let fileView = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, "../uploads", filename);
  return res.sendFile(filePath);
};

// File to download
export let downloadFile = async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).send("File not found!");
    }
  });
};

// Get Profile
export let getProfile = async (req, res) => {
  try {
    const { id, role } = req.query;
    const userId = getId(id);

    const userData = await User.findOne({ _id: userId, role: role }).select(
      "-password"
    );
    if (!userData) {
      return res.status(404).json({ error: "Not found..!" });
    }
    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

// Update Profile
export let updateProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = getId(id);
    const { fname, lname, email, mobile, role, username, profilePic } =
      req.body;

    const updateInfo = await User.findOneAndUpdate(
      { _id: userId, role: role },
      {
        fname,
        lname,
        email,
        mobile,
        username,
        profilePic,
      }
    );

    return res.status(200).json({ message: "Profile updated..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

//Send otp
export let verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const check = await User.find({ email: email }).select(
      "-password -profilePic"
    );

    if (!check) {
      return res.status(404).json({ error: "Email not found..!" });
    }

    const otp = getOtp();
    otpStore.set(email, {
      otp,
      valid: true,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    const emailData = {
      username: check.username,
      userEmail: email,
      text: { otp: otp },
      subject: "Account Recovery",
      type: "forgotPassword",
    };

    return res
      .status(200)
      .json({ message: "Email sent successfully!", emailData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

// Get Email Pic
export let getProfilePic = async (req, res) => {
  try {
    const { email } = req.query;
    const profilePic = await User.findOne({ email: email }).select("-password");
    if (!profilePic) {
      return res.status(404).json({ error: "Not found..!" });
    }
    return res.status(200).json({ profilePic });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

//  Verify Otp
export let verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const storedOtpData = otpStore.get(email);

    if (!storedOtpData || !storedOtpData.valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP." });
    }
    otpStore.delete(email);

    return res.status(200).json({ message: "Okay" });
  } catch (error) {
    return res.status(500).json({ error: "Server error.!" });
  }
};

// Resend Otp
export let resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    otpStore.delete(email);
    const otp = getOtp();
    otpStore.set(email, {
      otp,
      valid: true,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    const emailData = {
      userEmail: email,
      text: { otp: otp },
      subject: "Account Recovery",
      type: "forgotPassword",
    };

    const mockRes = {
      status: (code) => ({
        json: (response) => {
          if (code === 200) {
            return res.status(200).json({
              message: "OTP sent..!",
            });
          } else {
            return res.status(500).json({ error: "Failed to send otp." });
          }
        },
      }),
    };

    await Mail({ body: emailData }, mockRes);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Reset Password
export let resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const update = await User.findOneAndUpdate(
      { email: email },
      { password: hashPassword }
    );
    return res.status(200).json({ message: "Done" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Dashboard Data
export let dashboardData = async (req, res) => {
  try {
    const { id } = req.query;

    const _id = getId(id);
    const Employee = await User.find({ role: "Employee" });
    const Clients = await Client.aggregate([
      {
        $lookup: {
          from: "infos",
          localField: "clientId",
          foreignField: "_id",
          as: "infoRecords",
        },
      },
    ]);
    const events = await Event.find({ adminId: _id });
    let totalEmployee = Employee.length;
    let TotalClients = Clients.length;

    let activeClients = Clients.filter(
      (data) => data.status === "Active"
    ).length;
    let completedClients = Clients.filter(
      (data) => data.status === "Completed"
    ).length;
    let pendingClients = Clients.filter(
      (data) => data.status === "Pending"
    ).length;
    return res.status(200).json({
      totalEmployee,
      TotalClients,
      activeClients,
      completedClients,
      pendingClients,
      events,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Add Event
export let addEvent = async (req, res) => {
  try {
    const { title, date, time, adminId } = req.body;
    const event = new Event({
      title,
      date,
      time,
      adminId,
    });

    const savedEvent = await event.save();
    return res.status(200).json({ message: "Event added..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Delete Event
export let deleteEvent = async (req, res) => {
  try {
    const { id } = req.query;
    const _id = getId(id);
    const delEvent = await Event.deleteOne({ _id: _id });

    return res.status(200).json({ message: "Task deleted..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get Events
export let getEvents = async (req, res) => {
  try {
    const { id } = req.query;
    const _id = getId(id);
    const events = await Event.find({ adminId: _id });

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

// Delete Expired Events
export let deleteExpiredEvents = async (req, res) => {
  try {
    const now = new Date();

    const result = await Event.deleteMany({
      $or: [
        { date: { $lt: now.toISOString().split("T")[0] } },
        {
          $and: [
            { date: now.toISOString().split("T")[0] },
            { time: { $lt: now.toTimeString().slice(0, 5) } },
          ],
        },
      ],
    });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: "Removed expired events..!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Bulk Delete
export let bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    const clientDocs = await Info.find({ _id: { $in: ids } });

    console.log(clientDocs);

    if (clientDocs.length > 0) {
      for (const doc of clientDocs) {
        for (const file of doc.document) {
          const fullPath = path.join("uploads", file.filename);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }

      await Info.deleteMany({ _id: { $in: ids } });
    }

    const result = await Client.deleteMany({ clientId: { $in: ids } });

    if (result.deletedCount > 0) {
      res.status(200).send({ message: "Records deleted successfully." });
    } else {
      res
        .status(404)
        .send({ message: "No matching records found for deletion." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Bulk Hide
export let bulkHide = async (req, res) => {
  try {
    const { ids } = req.body;

    const result = await Client.updateMany({ _id: { $in: ids } }, [
      {
        $set: {
          hide: { $not: "$hide" },
        },
      },
    ]);
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Records hidden..!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// // Reset Document no counter
// export const resetDocNoCounter = async (req, res) => {
//   try {
//     const result = await DocNoCounter.updateOne(
//       {},
//       { $set: { sequenceValue: 0 } },
//       { upsert: true }
//     );
//     return res
//       .status(200)
//       .json({ message: "Counter reset successfully.", result });
//   } catch (error) {
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// Bulk Edit
export let bulkEdit = async (req, res) => {
  try {
    const { id, status } = req.body;

    const result = await Client.updateMany(
      { clientId: { $in: id } },
      {
        $set: { status: status },
      }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Records updated..!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
