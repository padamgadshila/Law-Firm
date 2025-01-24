import { Router } from "express";
import {
  addClient,
  addClientDocument,
  deleteClient,
  deleteClientDocument,
  getClientById,
  getClients,
  getClientsDocs,
  getLastId,
  getUploads,
  getUploadsById,
  removeC,
  updateClient,
  updateClientDocument,
  uploadUpdate,
} from "../controller/client.controller.js";
import { authorize } from "../Auth/auth.js";
import { uploadFields } from "../helper/multerConfiguration.js";
const clientRouter = Router();
// Add Clients
clientRouter.post("/addClient", authorize(["Admin", "Employee"]), addClient);

// Add Client Documents
clientRouter.post(
  "/addClientDocument",
  authorize(["Admin", "Employee"]),
  uploadFields,
  addClientDocument
);

// Delete Client
clientRouter.delete(
  "/deleteClient",
  authorize(["Admin", "Employee"]),
  deleteClient
);

// Delete document
clientRouter.delete(
  "/deleteDocument",
  authorize(["Admin", "Employee"]),
  deleteClientDocument
);

//  Update client document
clientRouter.put(
  "/updateDocument",
  authorize(["Admin", "Employee"]),
  uploadFields,
  updateClientDocument
);

// Get Client data
clientRouter.get("/getClients", authorize(["Admin", "Employee"]), getClients);

// Get Client Documents
clientRouter.get(
  "/clientDocs",
  authorize(["Admin", "Employee"]),
  getClientsDocs
);

// Get client data by id
clientRouter.get(
  "/clientData",
  authorize(["Admin", "Employee"]),
  getClientById
);

// Update client
clientRouter.put(
  "/updateClient",
  authorize(["Admin", "Employee"]),
  updateClient
);

// get uploaded
clientRouter.get("/getUploaded", authorize(["Admin", "Employee"]), getUploads);

// get id
clientRouter.get("/getId", authorize(["Admin", "Employee"]), getLastId);

clientRouter.get(
  "/getUploadsById",
  authorize(["Admin", "Employee"]),
  getUploadsById
);

clientRouter.put(
  "/uploadUpdate",
  authorize(["Admin", "Employee"]),
  uploadUpdate
);
clientRouter.delete("/removeC", authorize(["Admin", "Employee"]), removeC);
export default clientRouter;
