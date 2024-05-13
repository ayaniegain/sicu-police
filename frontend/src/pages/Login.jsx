import React, { useState } from "react";
import coverImg from "../assets/background-cover.png";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [psname, setPsname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spa, setSpa] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          psname,
          email,
          password,
          spa
        }),
      });
      const data = await response.json();
      console.log(data);
      if(data.status === 'ok'){
        console.log(data);
        navigate('/');
      } 
      else{
        console.log('nope')
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  }

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100 ">
      <div className="flex w-1/2 bg-white ">
        <div className="side-img">
          <img src={coverImg} alt="" className="w-full h-[600px]" />
        </div>
        <div className="ml-8 mt-6  ">
          <div className="form-header flex items-center ">
            <img src={logo} alt="logo" className="mr-4 h-[60px]" />
            <div className="form-btn flex justify-center mx-20">
              <div className="flex flex-row justify-center items-center gap-2">
                <Link to="/signup">SignUp</Link>/
                <span className="text-xl font-semibold">Login</span>
              </div>
            </div>

          </div>

          <form className="max-w-md mx-30 mt-6 w-full" onSubmit={loginUser}>
            <div className="middle  p-14 shadow-right-bottom rounded-md">
              <h2 className="text-black font-bold text-xl text-center ">
                Welcome to Sicu-aura
              </h2>
              <p className="text-gray-300 text-[10px] text-center mt-2">
                Your one stop safety solutions using innovative technology
              </p>
              <div className="grid grid-cols-1 gap-8">
                <div className="">
                  <input
                    type="text"
                    name="name"
                    value={psname}
                    onChange={(e) => setPsname(e.target.value)}
                    className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Police Station Name"
                    required
                  />
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
                </div>
                <div className="">
                  <input
                    type="text"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="">
                  <input
                    type="text"
                    name="special-access"
                    value={spa}
                    onChange={(e) => setSpa(e.target.value)}
                    className="block w-full px-0 py-1 text-sm text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Special Access Code"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-1 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
              >
                Login
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-6">
              Terms and Condition privacy policy
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
