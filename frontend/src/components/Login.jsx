import React, { useState } from "react";
import { Button } from "./ui/button";
import { loginApi } from "../services/api/user.js";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
const Login = () => {
  const [input, setInput] = useState({
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await loginApi(input);
    setLoading(false);
    if (response.success) {
      dispatch(setAuthUser(response.user));
      navigate("/");
      toast.success(response.mes);
    }
  };
  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={handleLogin}
          className="shadow-lg flex flex-col gap-5 p-8"
        >
          <div className="text-center flex flex-col">
            <span className="font-bold text-2xl mb-2">LOGO</span>
            <span className="text-lg">
              Signup to see photos & videos from your friends
            </span>
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Email</label>
            <input
              type="email"
              value={input.email}
              name="email"
              className="border p-2 my-2 rounded focus:outline-none"
              onChange={handleChangeInput}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Password</label>
            <input
              type="password"
              value={input.password}
              name="password"
              className="border p-2 my-2 rounded focus:outline-none"
              onChange={handleChangeInput}
            />
          </div>
          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )}
          <span className="text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};
export default Login;
