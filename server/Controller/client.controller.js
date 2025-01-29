import Client from "../models/client.model.js";
import Files from "../models/files.model.js";
import { getId } from "../helper/getObjectId.js";
import path from "path";
import fs from "fs";
import Info from "../models/info.model.js";
import Counter from "../models/counter.model.js";

// add clients
export let addClient = async (req, res) => {
  try {
    const {
      clientId,
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      state,
      city,
      village,
      pincode,
    } = req.body;
    const check = await Client.find({
      fname: fname,
      mname: mname,
      lname: lname,
    });

    if (check.length > 0) {
      return res.status(409).json({ error: "Client already exists..!" });
    }
    const client = await Client.create({
      fname,
      clientId,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      address: { state, city, village, pincode },
      hide: false,
    });

    return res
      .status(200)
      .json({ message: "Client added..!", _id: client._id });
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};

// add clients documents
export let addClientDocument = async (req, res) => {
  try {
    const {
      clientId,
      docType,
      documentNo,
      village,
      gatNo,
      year,
      extraInfo,
      filename,
    } = req.body;

    console.log(req.body);

    // const id = getId(clientId);

    // const update = await Client.findOneAndUpdate(
    //   { _id: id },
    //   { fileUploaded: "Yes" }
    // );
    const check = await Info.findOne({ _id: clientId });
    if (check) {
      return res.status(409).json({ error: "Documents already uploaded..!" });
    }
    const docs = [];
    for (let i = 0; i <= 8; i++) {
      const documentTypeKey = `documentType-${i}`;
      const documentFileKey = `document-${i}`;

      if (req.files[documentFileKey] && req.body[documentTypeKey]) {
        const documentType = req.body[documentTypeKey];
        const documentFile = req.files[documentFileKey][0];

        const userDefinedName = req.body.filename || `file-${i}`;
        const newFilename = `${userDefinedName}-${Date.now()}${path.extname(
          documentFile.originalname
        )}`;
        const newPath = path.join("uploads", newFilename);
        fs.renameSync(documentFile.path, newPath);

        const fileData = {
          documentType: documentType,
          filename: newFilename,
          filePath: newPath,
        };
        docs.push(fileData);
      }
    }
    const data = await Info.create({
      documentNo: documentNo,
      village: village,
      gatNo: gatNo,
      year: year,
      extraInfo: extraInfo,
      document: docs,
      docType: docType,
      filename: filename,
    });

    return res
      .status(200)
      .json({ message: "Documents uploaded..!", user: data });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};

// delete clients
export let deleteClient = async (req, res) => {
  try {
    const cid = req.query.id;
    const id = getId(cid);
    const clientId = await Client.findOne({ _id: id });
    const clientDocs = await Info.find({ _id: clientId.clientId });

    if (clientDocs) {
      for (const doc of clientDocs) {
        for (const file of doc.document) {
          const fullPath = path.join("uploads", file.filename);
          fs.unlinkSync(fullPath);
        }
      }
      const delDocuments = await Info.deleteMany({ _id: clientId.clientId });
    }

    const delClient = await Client.deleteOne({ _id: id });
    if (delClient.deletedCount === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.status(200).json({ message: "Deleted..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Delete specific client document
export let deleteClientDocument = async (req, res) => {
  try {
    const { id, filename } = req.query;

    const documents = await Info.findOne({ _id: id });

    if (!documents) {
      return res
        .status(404)
        .json({ error: "Documents not found for the client" });
    }

    const fileToDelete = documents.document.find(
      (doc) => doc.filename === filename
    );

    if (!fileToDelete) {
      return res.status(404).json({ error: "File not found" });
    }

    const fullPath = path.join("uploads", fileToDelete.filename);
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.log("Error deleting file from file system:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete file from file system" });
    }

    documents.document = documents.document.filter(
      (doc) => doc.filename !== filename
    );

    await documents.save();

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Update one or more client document
export let updateClientDocument = async (req, res) => {
  try {
    const { id, filenames } = req.query;
    const documents = await Info.findOne({ _id: id });
    if (!documents) {
      return res
        .status(404)
        .json({ error: "Documents not found for the client" });
    }

    const filesToDelete = filenames.split(",");

    for (const filenames of filesToDelete) {
      const fileToDelete = documents.document.find(
        (doc) => doc.filename === filenames
      );

      if (!fileToDelete) {
        console.log(`File not found: ${filenames}`);
        continue;
      }

      const fullPath = path.resolve("uploads", fileToDelete.filename);
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.log(`Error deleting file from file system: ${filenames}`, err);
        return res
          .status(500)
          .json({ error: `Failed to delete file: ${filenames}` });
      }

      documents.document = documents.document.filter(
        (doc) => doc.filename !== filenames
      );
    }

    for (let i = 0; i <= 8; i++) {
      const documentTypeKey = `documentType-${i}`;
      const documentFileKey = `document-${i}`;

      if (req.files[documentFileKey] && req.body[documentTypeKey]) {
        const documentType = req.body[documentTypeKey];
        const documentFile = req.files[documentFileKey][0];

        const userDefinedName = req.body.filename || `file-${i}`;
        const newFilename = `${userDefinedName}-${Date.now()}${path.extname(
          documentFile.originalname
        )}`;
        const newPath = path.join("uploads", newFilename);
        fs.renameSync(documentFile.path, newPath);

        const fileData = {
          documentType: documentType,
          filename: newFilename,
          filePath: newPath,
        };
        await Info.updateOne(
          { _id: id },
          {
            $push: { document: fileData },
          }
        );
      }
    }

    return res
      .status(200)
      .json({ message: "Documents updated successfully", documents });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get Client Data
export let getClients = async (req, res) => {
  try {
    const clientData = await Client.find();
    if (!clientData) {
      return res.status(404).json({ error: "No clients found..!" });
    }

    return res.status(200).json({ message: "okay", clientData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};

// Get Client Documents
export let getClientsDocs = async (req, res) => {
  try {
    const cid = req.query.id;
    const id = getId(cid);

    const docs = await Info.findOne({ clientId: id });

    return res.status(200).json({ docs });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get client data by id
export let getClientById = async (req, res) => {
  try {
    const id = req.query.id;
    const cid = getId(id);
    const clientData = await Client.findById(cid);

    if (!clientData) {
      return res.status(404).json({ error: "Client Not found..!" });
    }
    return res.status(200).json({ message: "Client Found..!", clientData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// Update client
export let updateClient = async (req, res) => {
  try {
    const {
      _id,
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
    const id = getId(_id);
    const UpdateClient = await Client.findByIdAndUpdate(id, {
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      docType,
      gender,
      address: {
        state,
        city,
        village,
        pincode,
      },
    });

    return res.status(200).json({ message: "Client details updated..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// get all uploaded data
export let getUploads = async (req, res) => {
  try {
    const data = await Info.find();

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// get id
export let getLastId = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "info" },
      { $setOnInsert: { count: 0 } }, // Initialize only if not present
      { new: true, upsert: true } // Return the updated document or create it
    );
    console.log(counter);

    return res.status(200).json({ counter });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Server Error" });
  }
};

export let getUploadsById = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Info.findOne({ _id: id });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export let uploadUpdate = async (req, res) => {
  try {
    const { id } = req.query;
    const { documentNo, village, gatNo, extraInfo, year, docType } = req.body;
    console.log(req.body);

    const result = await Info.findByIdAndUpdate(id, {
      documentNo,
      village,
      gatNo,
      extraInfo,
      year,
      docType,
    });
    return res.status(200).json({ message: "Record update..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export let removeC = async (req, res) => {
  try {
    const { id } = req.query;
    const infos = await Info.find({ _id: id });
    const deleteClient = await Client.deleteOne({ clientId: id });

    if (infos) {
      for (const doc of infos) {
        for (const file of doc.document) {
          const fullPath = path.join("uploads", file.filename);
          fs.unlinkSync(fullPath);
        }
      }
      const deleteInfo = await Info.deleteMany({ _id: id });
    }
    return res.status(200).json({ message: "Deleted..!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};

export let getCombinedData = async (req, res) => {
  try {
    const result = await Client.aggregate([
      {
        $lookup: {
          from: "infos",
          localField: "clientId",
          foreignField: "_id",
          as: "infoRecords",
        },
      },
    ]);

    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export let getFiles = async (req, res) => {
  try {
    const { id } = req.query;

    const result = await Info.findOne({ _id: id });
    return res.status(200).json({ res: result.document });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export let addFiles = async (req, res) => {
  try {
    const { id } = req.query;
    const documents = await Info.findOne({ _id: id });
    const filename = documents.filename;

    for (let i = 0; i <= 8; i++) {
      const documentTypeKey = `documentType-${i}`;
      const documentFileKey = `document-${i}`;

      if (req.files[documentFileKey] && req.body[documentTypeKey]) {
        const documentType = req.body[documentTypeKey];
        const documentFile = req.files[documentFileKey][0];

        const userDefinedName = filename || `file-${i}`;
        const newFilename = `${userDefinedName}-${Date.now()}${path.extname(
          documentFile.originalname
        )}`;
        const newPath = path.join("uploads", newFilename);
        fs.renameSync(documentFile.path, newPath);

        const fileData = {
          documentType: documentType,
          filename: newFilename,
          filePath: newPath,
        };
        await Info.updateOne(
          { _id: id },
          {
            $push: { document: fileData },
          }
        );
      }
    }

    return res.status(200).json({ message: "Files Added Successfully..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
};
