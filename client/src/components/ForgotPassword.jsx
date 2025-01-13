import React, { useState } from "react";
import "./Popup.css";

const ForgotPassword = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-sm mb-4">
          Enter your email address to reset your password.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
