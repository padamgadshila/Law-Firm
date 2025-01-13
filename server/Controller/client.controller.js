import Client from "../models/client.model.js";
import Files from "../models/files.model.js";
import { getId } from "../helper/getObjectId.js";
import path from "path";
import fs from "fs";

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

// add clients documents
export let addClientDocument = async (req, res) => {
  try {
    const { _id, info } = req.body;
    const id = getId(_id);

    const update = await Client.findOneAndUpdate(
      { _id: id },
      { fileUploaded: "Yes" }
    );
    const check = await Files.findOne({ userId: id });
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

        const fileData = {
          documentType: documentType,
          filename: documentFile.filename,
          filePath: "uploads/" + documentFile.filename,
        };
        docs.push(fileData);
      }
    }
    const data = await Files.create({
      userId: id,
      document: docs,
      info: info,
    });

    return res
      .status(200)
      .json({ message: "Documents uploaded..!", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// delete clients
export let deleteClient = async (req, res) => {
  try {
    const cid = req.query.id;
    const id = getId(cid);

    const clientDocs = await Files.find({ userId: id });

    if (clientDocs) {
      for (const doc of clientDocs) {
        for (const file of doc.document) {
          const fullPath = path.join("uploads", file.filename);
          fs.unlinkSync(fullPath);
        }
      }
      const delDocuments = await Files.deleteMany({ userId: id });
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
    const _id = getId(id);

    const documents = await Files.findOne({ userId: _id });

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
    const { id } = req.query;
    const _id = getId(id);
    const { filenames } = req.query;
    const documents = await Files.findOne({ userId: _id });

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

    const docs = [];
    for (let i = 0; i <= 8; i++) {
      const documentTypeKey = `documentType-${i}`;
      const documentFileKey = `document-${i}`;

      if (req.files[documentFileKey] && req.body[documentTypeKey]) {
        const documentType = req.body[documentTypeKey];
        const documentFile = req.files[documentFileKey][0];

        const fileData = {
          documentType: documentType,
          filename: documentFile.filename,
          filePath: "uploads/" + documentFile.filename,
        };
        docs.push(fileData);
      }
    }

    documents.document.push(...docs);

    await documents.save();
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
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get Client Documents
export let getClientsDocs = async (req, res) => {
  try {
    const cid = req.query.id;
    const id = getId(cid);

    const docs = await Files.findOne({ userId: id });

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
