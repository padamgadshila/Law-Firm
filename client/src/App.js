import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Email from "./pages/Email";
import ResetPassword from "./pages/ResetPassword";
import Verify from "./pages/Verify";
import AddEmployee from "./pages/AddEmployee";
import AddClient from "./pages/AddClient";
import AddClientDocuments from "./pages/AddClientDocuments";
import Admin from "./pages/Admin";
import { AuthorizeUser } from "./auth/authorizeUser";
import Employee from "./components/Employee";
import Session from "./pages/Session";
import EditClient from "./pages/EditClient";
import EditEmployee from "./pages/EditEmployee";
import UpdateProfile from "./pages/UpdateProfile";
import ViewDocuments from "./components/ViewDocuments";
import PreviewClient from "./pages/PreviewClient";
import EditUploads from "./pages/EditUploads";
import EditFile from "./pages/EditFile";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/email", element: <Email /> },
  { path: "/verify", element: <Verify /> },
  { path: "/resetPassword", element: <ResetPassword /> },
  {
    path: "/addEmployee",
    element: (
      <AuthorizeUser>
        <AddEmployee />
      </AuthorizeUser>
    ),
  },
  {
    path: "/addClient",
    element: (
      <AuthorizeUser>
        <AddClient />
      </AuthorizeUser>
    ),
  },
  {
    path: "/addClientDocuments",
    element: (
      <AuthorizeUser>
        <AddClientDocuments />
      </AuthorizeUser>
    ),
  },
  {
    path: "/viewDocuments",
    element: (
      <AuthorizeUser>
        <ViewDocuments />
      </AuthorizeUser>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthorizeUser>
        <Admin />
      </AuthorizeUser>
    ),
  },
  {
    path: "/employee",
    element: (
      <AuthorizeUser>
        <Employee />
      </AuthorizeUser>
    ),
  },
  { path: "/expired", element: <Session /> },

  {
    path: "/edit",
    element: (
      <AuthorizeUser>
        <EditClient />
      </AuthorizeUser>
    ),
  },
  {
    path: "/editUploads",
    element: (
      <AuthorizeUser>
        <EditUploads />
      </AuthorizeUser>
    ),
  },
  {
    path: "/editEmployee",
    element: (
      <AuthorizeUser>
        <EditEmployee />
      </AuthorizeUser>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <UpdateProfile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/preview",
    element: (
      <AuthorizeUser>
        <PreviewClient />
      </AuthorizeUser>
    ),
  },
  {
    path: "/editFile",
    element: (
      <AuthorizeUser>
        <EditFile />
      </AuthorizeUser>
    ),
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
