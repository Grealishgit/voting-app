import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import RootLayout from "./pages/RootLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Elections from "./pages/Elections";
import Results from "./pages/Results";
import ElectionsDetails from "./pages/ElectionsDetails";
import Candidates from "./pages/Candidates";
import Congrats from "./pages/Congrats";
import Logout from "./pages/Logout";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "results",
        element: <Results />
      },
      {
        path: "elections",
        element: <Elections />
      },
      {
        path: "elections/:id",
        element: <ElectionsDetails />
      },
      {
        path: "elections/:id/candidates",
        element: <Candidates />
      },
      {
        path: "congrats",
        element: <Congrats />
      },
      {
        path: "Logout",
        element: <Logout />
      },
    ]
  }
])


function App() {
  return (
    <>
      <Toaster />
      (<RouterProvider router={router} />)
    </>
  )


}

export default App;
