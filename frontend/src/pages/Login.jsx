import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validate from '../components/validattionLogin';
import coverImg from "../assets/background-cover.png";
import logo from "../assets/logo.png";
import { useAuth } from "./AuthContext";

function Login() {
  const [psname, setPsname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spa, setSpa] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = useAuth(); 


  async function handleLoginUser(event) {
    event.preventDefault();

    // Create the validation data object
    const validationData = {
      policeStationName: psname,
      email: email,
      password: password,
      specialCode: spa,
    };

    // Validate the form data
    const validationErrors = validate(validationData);
    setErrors(validationErrors);

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {

      return; // If there are errors, prevent the form from submitting
    }

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationData),
      });

      const data = await response.json();
      if (data.status === "ok") {
        auth.login();

        navigate("/");
      } else {
      setErrors({ submit: "please enter valid email and password" });

      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "An error occurred. Please try again later." });
    }
  }

  return (
    <section className="flex flex-row">
      <div className="side-img flex-none w-30">
        <img src={coverImg} alt="" className="object-cover h-screen w-[500px]" />
      </div>
      <div className="flex flex-col justify-center w-full items-center ">
        <div className="flex flex-row justify-between gap-x-40 mr-60">
          <img src={logo} alt="logo" className="h-[60px]" />
          <div className="form-btn flex justify-center items-center gap-2 mr-50">
            <Link to="/signup" className="custom-link-style text-2xl text-gray-400 font-semibold ">
              Sign Up
            </Link>
            /
            <span className="custom-span-style text-2xl font-semibold">
              Login
            </span>
          </div>
        </div>
        <form className="mt-6 flex flex-col justify-center items-center" onSubmit={handleLoginUser}>
          <div className="middle p-10 shadow-right-bottom rounded-lg">
            <h2 className="text-black font-bold text-xl text-center">
              Welcome to Sicu-aura
            </h2>
            <p className="text-gray-300 text-[10px] text-center mt-2">
              Your one stop safety solutions using innovative technology
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
