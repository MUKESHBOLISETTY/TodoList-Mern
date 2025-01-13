import React, { createRef, useState, useContext } from "react";
import Cookies from "js-cookie";
import './Auth.css';
import './Popup.css';
import { DataContext } from '../UserDetails';
import { LogIn, getUserData, resetpassword } from '../api/api'
import Popup from "./Popup";
import ForgotPassword from "./ForgotPassword";

const Login = ({ setNavComponent }) => {
  const SubmitBtn = createRef(null);
  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const { setLogin, setUserData } = useContext(DataContext);

  const handleForgotPassword = async (email) =>{
    try{
      const response = await resetpassword(email);
      if(response == 'invaliduser'){
        setPopupMessage("User Not Exist");
        setTimeout(() => setPopupMessage(null), 3000);
      } else if(response == 'mailsent'){
        setPopupMessage("Mail Sent");
        setTimeout(() => setPopupMessage(null), 3000);
        setShowForgotPasswordPopup(false)
      }
    } catch(error) {

    }

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const detailsPost = async () => {
      const res = await LogIn(formData);
      if (res === "denied") {
        setPopupMessage("Email ID or password incorrect");
        setTimeout(() => setPopupMessage(null), 3000);
      }
      if (res === "usernotfound") {
        setPopupMessage("Email ID not found,");
        setTimeout(() => setPopupMessage(null), 3000);
      }
      if (res === "verification") {
        setPopupMessage("Please verify to continue. Email has been sent.");
        setTimeout(() => setPopupMessage(null), 5000);
      }
      if (res.mail) {
        const details = res;
        Cookies.set("mail", details.mail, { expires: 365, path: "/" });
        Cookies.set("token", details.token, { expires: 365, path: "/" });
        const updateData = await getUserData(details.token);
        if (updateData) {
          setLogin(true)
          setUserData(updateData)
        }
      }
    };
    detailsPost()
  };

  return (
    <div className="h-[90vh] flex flex-col md:flex-row relative">
      {/* Left Side - Login Form */}
      <div className="details-container">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="labels" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="labels" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            ref={SubmitBtn}
            className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login
          </button>
          <p className="mt-4 text-gray-500 text-sm text-center">
            Don't have an account?{" "}
            <button
              onClick={() => setNavComponent("signup")}
              className="text-orange-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
        <a
          onClick={() => setShowForgotPasswordPopup(true)}
          className="mt-4 text-sm text-center text-orange-500 hover:underline cursor-pointer"
        >
          Forgot Password?
        </a>
      </div>

      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <img
          src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7863.jpg?t=st=1734412984~exp=1734416584~hmac=8357f3c675fcddf0272f8c314b533451b8fbd732b314d6928a48b1db77f4a454&w=1060"
          alt="Login Image"
          className="object-cover max-h-full"
        />
      </div>

      {popupMessage && (
        <Popup popupmessage={popupMessage} />
      )}

      {showForgotPasswordPopup && (
        <ForgotPassword
          onClose={() => setShowForgotPasswordPopup(false)}
          onSubmit={handleForgotPassword}
        />
      )}
    </div>
  );
};

export default Login;
