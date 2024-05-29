import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validate from '../components/validattionLogin';
import coverImg from "../assets/background-cover.png";
import logo from "../assets/logo.png";
import { useAuth } from "./AuthContext";
import { useMutation } from '@tanstack/react-query';

import {login} from "../components/centralApi"


function Login() {
  const [psname, setPsname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spa, setSpa] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = useAuth(); 
  
  const mutation = useMutation({
    mutationFn: login,  // using react query and centralApi
    onSuccess: (data) => {
      if (data.status === "ok") {
        localStorage.setItem('token', data.token);
        auth.login();
        navigate("/");
      } else {
        setErrors({ submit: "Please enter a valid email and password." });
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      setErrors({ submit: "An error occurred. Please try again later." });
    }
  });

  const handleLoginUser = async (event) => {
    event.preventDefault();

    const validationData = {
      policeStationName: psname,
      email: email,
      password: password,
      specialCode: spa,
    };

    const validationErrors = validate(validationData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    mutation.mutate(validationData);
  }

  return (
    <section className="flex flex-row">
      <div className="side-img flex-none w-30">
        <img src={coverImg} alt="" className="object-cover h-screen w-[500px] sm:block hidden" />
      </div>
      <div className="flex flex-col justify-center w-full items-center">
        <div className="form-header flex flex-col sm:flex-row sm:justify-center md:justify-between gap-x-40 md:mr-60 md:mt-10 mt-10 mb-20 sm:items-center sm:ml-30">
          <img src={logo} alt="logo" className="h-[60px] hidden md:block mb-4 sm:mb-0" />
          <div className="form-btn flex justify-center items-center gap-2 mr-50">
            <Link to="/signup" className="custom-link-style text-2xl text-gray-400 font-semibold">
              Sign Up
            </Link>
            /
            <span className="custom-span-style ml-2 text-2xl font-semibold">
              Login
            </span>
          </div>
        </div>
        <form className="flex flex-col justify-center items-center" onSubmit={handleLoginUser}>
          <div className="middle p-10 shadow-right-bottom rounded-lg">
            <h2 className="text-black font-bold text-xl text-center">
              Welcome to Sicu-aura
            </h2>
            <p className="text-gray-300 text-[10px] text-center mt-2">
              Your one-stop safety solutions using innovative technology
            </p>
            <div className="mt-6 grid grid-cols-1 gap-8">
              <div className="">
                <input
                  type="text"
                  name="policeStationName"
                  value={psname}
                  onChange={(e) => setPsname(e.target.value)}
                  className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Police Station Name"
                  required
                />
                {errors.policeStationName && <span className="text-red-500 text-[12px]">{errors.policeStationName}</span>}
              </div>
              <div className="">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Email ID"
                  required
                />
                {errors.email && <span className="text-red-500 text-[12px]">{errors.email}</span>}
              </div>
              <div className="">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Password"
                  required
                />
                {errors.password && <span className="text-red-500 text-[12px]">{errors.password}</span>}
              </div>
              <div className="">
                <input
                  type="text"
                  name="specialCode"
                  value={spa}
                  onChange={(e) => setSpa(e.target.value)}
                  className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Special Access Code"
                  required
                />
                {errors.specialCode && <span className="text-red-500 text-[12px]">{errors.specialCode}</span>}
              </div>
            </div>
          </div>
          <span className="mt-2">
            {errors.submit && <span className="text-red-500 text-[12px]">{errors.submit}</span>}
          </span>
          <div className="text-center mt-8">
            <button
              type="submit"
              className="w-full sm:w-auto px-9 py-1.5 text-[12px] text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
            >
              Login
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-6">
            Terms and Condition privacy policy
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
