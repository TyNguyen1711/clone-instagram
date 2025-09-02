import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./components/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import ChatPage from "./components/ChatPage.jsx";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice.js";
import { setOnlineUsers } from "./redux/chatSlice.js";
import { useEffect } from "react";
import { setLikeNotification } from "./redux/rtnSlice.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Explore from "./components/Explore.jsx";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
      {
        path: "/explore",
        element: <Explore />,
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
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
