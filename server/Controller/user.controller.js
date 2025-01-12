import generateToken from "../Auth/generate.token.js";
import { usernamePasswordGenerate } from "../Helper/username.password.generator.js";
import User from "../Models/user.model.js";
import Client from "../Models/client.model.js";
import bcrypt from "bcryptjs";

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

// add clients
export let addClient = async (req, res) => {
  try {
    const {
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      docType,
      gender,
      state,
      city,
      village,
      pincode,
    } = req.body;

    const client = await Client.create({
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      docType,
      gender,
      address: { state, city, village, pincode },
      fileUploaded: "No",
      hide: false,
    });

    return res
      .status(201)
      .json({ message: "Client added..!", _id: client._id });
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};
