import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoute";

import { AuthProvider } from "./pages/AuthContext";
function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
    </AuthProvider>
  );
}

export default App;
