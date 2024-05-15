import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import coverImg from "../assets/background-cover.png";
import brandLogo from "../assets/capture-logo.png";
import cameraicon from "../assets/camera-icon.png";
import validate from '../components/validationSignup';

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
  const [errors, setErrors] = useState({});

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
          setErrors({ submit: "Police Station Name or Email already exists" });

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
  
    // Validate form data
    const validationData = {
      psname,
      address,
      email,
      phno,
      city,
      areaofaction,
      state,
      officerno,
      pincode,
      createPassword,
      password,
    };
  
    const validationErrors = validate(validationData);
    setErrors(validationErrors);
  
    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return; // Prevent form submission if there are errors
    }
  
    // Check if passwords match
    if (password !== createPassword) {
      alert("Passwords do not match");
      return;
    }
  
    // Proceed with capturing image
    setVideoCam(true);
    startCamera();
  }
  

  return (
    <section className="flex  flex-row ">
      {/* <div className="flex w-[700px] bg-white"> */}
        <div className="side-img flex-none w-30">
          <img src={coverImg} alt="" className="object-cover h-screen w-[500px]" />
        </div>
        <div className="flex flex-col  justify-center w-full items-center  ">
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
                  <form
                  className="flex flex-col justify-start mr-40 w-1/2 mt-10"
                  onSubmit={registerUser}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="psname"
                        value={psname}
                        onChange={(e) => setPsname(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Police Station Name"
                        required
                      />
                      {errors.psname && (
                        <span className="text-red-500 text-[11px]">
                          {errors.psname}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Email ID"
                        required
                      />
                      {errors.email && (
                        <span className="text-red-500 text-[11px]">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Address"
                        required
                      />
                      {errors.address && (
                        <span className="text-red-500 text-[11px]">
                          {errors.address}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="number"
                        name="phno"
                        value={phno}
                        onChange={(e) => setPhno(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Phone Number"
                        required
                      />
                      {errors.phno && (
                        <span className="text-red-500 text-[11px]">
                          {errors.phno}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="City"
                        required
                      />
                      {errors.city && (
                        <span className="text-red-500 text-[11px]">
                          {errors.city}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="area"
                        value={areaofaction}
                        onChange={(e) => setAreaofaction(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Area of Action"
                        required
                      />
                      {errors.areaofaction && (
                        <span className="text-red-500 text-[11px]">
                          {errors.areaofaction}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="State"
                        required
                      />
                      {errors.state && (
                        <span className="text-red-500 text-[11px]">
                          {errors.state}
                        </span>
                      )}
                    </div>
                    <div className="max-w-60">
                      <input
                        type="text"
                        name="office"
                        value={officerno}
                        onChange={(e) => setOfficerno(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Officers'In-Charges' Number"
                        required
                      />
                      {errors.officerno && (
                        <span className="text-red-500 text-[11px]">
                          {errors.officerno}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-10 mt-9 max-w-60">
                    <div className="">
                      <input
                        type="number"
                        name="pincode"
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                      />
                      {errors.pincode && (
                        <span className="text-red-500 text-[11px]">
                          {errors.pincode}
                        </span>
                      )}
                    </div>
                    <div className="">
                      <input
                        type="password"
                        name="create-password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Create Password"
                        required
                      />
                      {errors.createPassword && (
                        <span className="text-red-500 text-[11px]">
                          {errors.createPassword}
                        </span>
                      )}
                    </div>
                    <div className="">
                      <input
                        type="password"
                        name="confirm-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-0  text-[11px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Confirm Password"
                        required
                      />
                      {errors.password && (
                        <span className="text-red-500 text-[11px]">
                          {errors.password}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="">

{errors.submit && <span className="text-red-500 text-[12px]">{errors.submit}</span>}
 
</span>     
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
