import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Heading from "../components/Heading";
import TextInput from "../components/TextInput";
import { fetchLogin } from "../API/calls";

const Login = () => {
  const [formData, setFormData] = useState({
    eventId: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleClick = () => {
    toast.promise(fetchLogin(formData), {
      loading: "Logging in...",
      success: (data) => {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", formData.eventId.toUpperCase());
        console.log(localStorage.getItem("user"));
          navigate("/dashboard");

        return "Logged in successfully!";
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <main className="font-poppins w-screen h-screen bg-gradient-to-br from-sky-600 to-sky-100 flex items-center justify-center">
      <div className="w-5/6 lg:w-[400px] h-fit bg-white rounded-lg p-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className="text-xl mb-1">Convenor's Portal</h1>
            <Heading>Login</Heading>
          </div>
          <img
            src="/assets/Kriya_KLA_Logo_Final.png"
            className="h-20 opacity-50"
            alt="Kriya KLA Logo"
          />
        </div>
        <TextInput
          className="mt-8"
          valueState={[
            formData.eventId,
            (val) => setFormData({ ...formData, eventId: val }),
          ]}
          placeholder="Enter Username"
          title="Username"
        />
        <TextInput
          className="mt-4"
          valueState={[
            formData.password,
            (val) => setFormData({ ...formData, password: val }),
          ]}
          placeholder="Enter Password"
          title="Password"
          type="password"
        />
        <Button text="Login" className="mt-8" handleClick={handleClick} />
      </div>
    </main>
  );
};

export default Login;
