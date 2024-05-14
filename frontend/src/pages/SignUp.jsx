import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import coverImg from "../assets/background-cover.png";
import brandLogo from "../assets/capture-logo.png";
import cameraicon from "../assets/camera-icon.png";
function SignUp() {
  const [psname, setPsname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState("");
  const [city, setCity] = useState("");
  const [areaofaction, setAreaofaction] = useState("");
  const [state, setState] = useState("");
  const [officerno, setOfficerno] = useState("");
  const [pincode, setPincode] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [password, setPassword] = useState("");
  const [videoStream, setVideoStream] = useState(null);
  const [image, setImage] = useState(null);
  const [showRetakeContinue, setShowRetakeContinue] = useState(false);
  const [videoCam, setVideoCam] = useState(false);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      setVideoStream(stream);
      const video = document.getElementById("video");
      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCaptureImage = async () => {
    try {
      console.log("Capturing image...");
      const canvas = document.createElement("canvas");
      const video = document.getElementById("video");
      console.log("Video element:", video);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/jpeg");

      setImage(capturedImage);
      setShowRetakeContinue(true);
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setShowRetakeContinue(false);
    startCamera();
  };
  const handleContinue = async () => {
    try {
      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        const formData = new FormData();
        formData.append("image", blob);
        formData.append("psname", psname); // Police Station name
        formData.append("email", email);
        formData.append("address", address);
        formData.append("phno", phno);
        formData.append("city", city);
        formData.append("areaofaction", areaofaction);
        formData.append("state", state);
        formData.append("officerno", officerno);
        formData.append("pincode", pincode);
        formData.append("password", password);

        const response = await fetch("http://localhost:8080/api/signup", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
        if (data.message === "Police Station Name or Email already exists") {
          // alert("Police Station Name or Email already exists");

          navigate("/signup");
          setVideoCam(true);
        } else if (response.ok) {
          navigate("/login");
        } else {
          console.error("Error in response:", data.message);
        }
      } else {
        console.error("No image captured.");
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  async function registerUser(event) {
    event.preventDefault();
    if (password !== createPassword) {
      alert("Passwords do not match");
      return;
    }
    setVideoCam(true);
    startCamera();
  }

  return (
    <section className="flex flex-row ">
      {/* <div className="flex w-[700px] bg-white"> */}
        <div className="side-img flex-none w-30">
          <img src={coverImg} alt="" className="object-cover h-screen w-[500px]" />
        </div>
        <div className="flex flex-col justify-center w-full items-center  ">
          <div className="form-header flex flex-row justify-between gap-x-40 mr-60 ">
            {!videoCam ? (
              <img src={logo} alt="logo" className="mr-4 h-[60px]" />
            ) : (
              <img src={brandLogo} alt="logo" className=" h-[60px]" />
            )}

<div className="form-btn flex justify-center items-center gap-2 mr-50">
            <Link
              to="/login"
              className="custom-link-style text-2xl text-gray-400 font-semibold "
            >
              Login
            </Link>
            /
            <span className="custom-span-style text-2xl font-semibold">
              Sign Up
            </span>
          </div>
          </div>

          {!videoCam ? (
            <form className="flex flex-col justify-start mr-40 w-1/2 mt-10" onSubmit={registerUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="max-w-60">
                  <input
                    type="text"
                    name="psname"
                    value={psname}
                    onChange={(e) => setPsname(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Police Station Name"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Email ID"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="number"
                    name="phno"
                    value={phno}
                    onChange={(e) => setPhno(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="City"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="text"
                    name="area"
                    value={areaofaction}
                    onChange={(e) => setAreaofaction(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Area of Action"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="text"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="State"
                    required
                  />
                </div>
                <div className="max-w-60">
                  <input
                    type="text"
                    name="office"
                    value={officerno}
                    onChange={(e) => setOfficerno(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Officers'In-Charges' Number"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10 mt-9 max-w-60">
                <div className="">
                  <input
                    type="number"
                    name="pincode"
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="">
                  <input
                    type="password"
                    name="create-password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Create Password"
                    required
                  />
                </div>
                <div className="">
                  <input
                    type="text"
                    name="confirm-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-0 py-1 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Confarm Password"
                    required
                  />
                </div>
              </div>
              <div className="text-center mt-10 ">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                >
                  Sign Up
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-4">
                Terms and Condition privacy policy
              </p>
            </form>
          ) : (
           
            <div className="capture-image flex flex-col justify-center items-center mt-16 ">
             <p className="text-xs mb-6 mr-32" style={{ fontFamily: 'Poppins', fontWeight: 600,  textAlign: 'left' }}>
  Please Capture our face to continue
</p>


              <div className="bg-gray-400 h-64 w-80 rounded-md flex justify-center items-center relative">
              {!image && (

                <img
                  src={cameraicon}
                  alt="Camera Icon"
                  className="h-10 w-10 absolute inset-0 m-auto"
                />
              )}

                <label htmlFor="imageInput" className="">
                  {image ? (
                    <img
                      src={image}
                      alt="Camera Icon"
                      className="h-64 w-80"
                    />
                  ) : (

                    
                    <div className="h-68 w-80">
                      <video id="video" autoPlay muted></video>
                    </div>
                  )}
                </label>
              </div>

              <div className="button-section my-8">
                {!image && (
                  <button
                    onClick={handleCaptureImage}
                    className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                    >
                    Capture
                  </button>
                )}
                {showRetakeContinue && (
                  <div className=" justify-center mt-10 flex gap-4">
                    <button
                      onClick={handleRetake}
                      className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                      >
                      Re-take
                    </button>
                    <button
                      onClick={handleContinue}
                      className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                      >
                      Continue
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-6">
                *Terms and Condition privacy policy
              </p>
            </div>
            
          )}
        </div>
      {/* </div> */}
    </section>
  );
}

export default SignUp;
