import React, { useState } from "react";
import { Button } from "./ui/button";
import { registerApi } from "../services/api/user.js";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
  });
  const handleChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    validateFields(e.target.name, e.target.value);
  };

  const validateUsername = (username) => {
    if (username.trim().includes(" ")) {
      return "Username have not space";
    }
    return "";
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return "Email is not valid";
    }
    return "";
  };

  const validateFields = (fieldName, value) => {
    let error = "";
    if (value == "") {
      error = "This field is require";
    } else if (fieldName == "username") {
      error = validateUsername(value);
    } else if (fieldName == "email") {
      error = validateEmail(value);
    } else if (fieldName == "password") {
      error =
        value.trim().length >= 6
          ? ""
          : "Password must be at least 6 characters long";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };
  const validateForms = () => {
    validateFields("username", input.username);
    validateFields("email", input.email);
    validateFields("password", input.password);

    return (
      input.username.trim() !== "" &&
      input.email.trim() !== "" &&
      input.password.trim() !== "" &&
      !(errors.email || errors.username || errors.password)
    );
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForms()) {
      const response = await registerApi(input);
      if (response.success) {
        toast.success(response.mes);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(response.mes);
      }
    }
  };
  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={handleSignup}
          className="shadow-lg flex flex-col gap-5 p-8"
        >
          <div className="text-center flex flex-col">
            <span className="font-bold text-2xl mb-2">LOGO</span>
            <span className="text-lg">
              Signup to see photos & videos from your friends
            </span>
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Username</label>
            <input
              type="text"
              name="username"
              value={input.username}
              className="border p-2 my-2 rounded focus:outline-none"
              onChange={handleChangeInput}
            />
            {errors.username && (
              <span className="text-red-500">{errors.username}</span>
            )}
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
            {errors.email && (
              <span className="text-red-500">{errors.email}</span>
            )}
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
            {errors.password && (
              <span className="text-red-500">{errors.password}</span>
            )}
          </div>

          <Button>Signup</Button>
          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};
export default Signup;
