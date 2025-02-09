import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import ChatPage from "./components/ChatPage.jsx";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
function App() {
  const user = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user._id,
        },
        transports: ["Websocket"],
      });
    }
  }, []);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
