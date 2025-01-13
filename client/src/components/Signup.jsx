import React, { useState } from "react";
import { passwordStrength } from 'check-password-strength';
import { signUp } from '../api/api'
import Popup from "./Popup";
import './Auth.css'
const Signup = ({ setNavComponent }) => {
  const ImgId = ['001', '002', '003', '004', '005', '006'];
  const AvatarRandomizer = ImgId[Math.floor(Math.random() * ImgId.length)];
  const [formData, setFormData] = useState({
    username: "",
    mail: "",
    password: "",
    confirmPassword: "",
    avatarId: AvatarRandomizer
  });
  const [popupMessage, setPopupMessage] = useState(null);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");
  const [showIndicator, setShowIndicator] = useState(false);

  const handlePasswordChange = (password) => {
    setFormData({ ...formData, password });
    const strength = passwordStrength(password).id; 
    
    let label = "";
    if (strength === 0) label = "Too Weak";
    else if (strength === 1) label = "Weak";
    else if (strength === 2) label = "Medium";
    else if (strength === 3) label = "Strong";
  
    setPasswordStrengthLabel(label);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.mail || !formData.password || !formData.confirmPassword) {
      setPopupMessage("Please fill in all fields");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    if(formData.username.length > 14){
      setPopupMessage("Username length exceeded. Recommended Max Size 14");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }
    const strength = passwordStrength(formData.password).id;
      if (strength < 2) {
        setPopupMessage("Passwords is too weak!");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }
    if (formData.password !== formData.confirmPassword) {
      setPopupMessage("Passwords do not match");
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    const detailsPost = async () => {
      const response = await signUp(formData);
        if (response === "error") {
          setPopupMessage("Signup failed. Please try again.");
        } else if (response === "sent") {
          setPopupMessage("Email has been sent. Please verify...");
          setTimeout(() => {
            setNavComponent("login");
          }, 4000);
        } else if (response === "mailexists"){
          setPopupMessage("Mail already Exits...");
        }
        setTimeout(() => setPopupMessage(null), 3000); 
}

detailsPost()
  }

  return (
    <div className="h-[90vh] flex flex-col md:flex-row relative">
      {/* Left Side - Signup Form */}
      <div className="details-container">
        <h1 className="details-title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="labels" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
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
            />
          </div>
          <div className="mb-4 relative">
            <label className="labels" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onFocus={() => setShowIndicator(true)}
              onBlur={() => !formData.password && setShowIndicator(false)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            {showIndicator && (
              <div className="mt-2 text-sm">
                <span
                  className={`font-semibold ${
                    passwordStrengthLabel === "Too Weak"
                      ? "text-red-500"
                      : passwordStrengthLabel === "Weak"
                      ? "text-orange-500"
                      : passwordStrengthLabel === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {passwordStrengthLabel || "Enter a password"}
                </span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="labels" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Sign Up
          </button>
          <p className="mt-4 text-gray-500 text-sm text-center">
            Already have an account?{" "}
            <button
              onClick={() => setNavComponent("login")}
              className="text-orange-500 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>

      
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <img
          src="https://img.freepik.com/premium-vector/create-new-account-concept-illustration_269560-19.jpg?semt=ais_hybrid"
          alt="Signup Image"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Popup Box */}
      {popupMessage && (
        <Popup popupmessage={popupMessage} />
      )}
    </div>
  );
};

export default Signup;
