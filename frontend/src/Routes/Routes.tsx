import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Container/HomeContainer";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
      ],
    },
  ]);