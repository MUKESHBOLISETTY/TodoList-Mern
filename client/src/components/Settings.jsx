import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { DataContext } from "../UserDetails";
import { DashboardContext } from "../DashboardView";
import Av1 from "../assets/Avatars/Av1.png";
import Av2 from "../assets/Avatars/Av2.png";
import Av3 from "../assets/Avatars/Av3.png";
import Av4 from "../assets/Avatars/Av4.png";
import Av5 from "../assets/Avatars/Av5.png";
import Av6 from "../assets/Avatars/Av6.png";
import { updateUser, getUserData, deleteUser, changePassword } from "../api/api";
import Popup from "./Popup";
import { passwordStrength } from 'check-password-strength';

const Settings = ({ setNavComponent }) => {
  const { setLogin, userdata, setUserData } = useContext(DataContext);
  const { setTab } = useContext(DashboardContext);

  const avatarMap = {
    "001": Av1,
    "002": Av2,
    "003": Av3,
    "004": Av4,
    "005": Av5,
    "006": Av6,
  };
  const ImgChecker = () => avatarMap[userdata.avatarId] || null;
  const [formData, setFormData] = useState({
    username: userdata.username || "",
    mail: userdata.mail || "",
    logo: ImgChecker() || "https://via.placeholder.com/100",
  });
  const [editingField, setEditingField] = useState(null);
  const [editLogo, setEditLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(formData.logo);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");

  const extractAvatarId = (logopath) => {
    const match = logopath.match(/Av\d+/);
    return match ? match[0] : null;
  };
  const selectedAvatarId = Object.keys(avatarMap).find(
    (key) => avatarMap[key].includes(extractAvatarId(selectedLogo))
  );
  const logos = [Av1, Av2, Av3, Av4, Av5, Av6];

  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");
  const [showIndicator, setShowIndicator] = useState(false);

  const handlePasswordChange = (newPassword) => {
    setPasswordData({ ...passwordData, newPassword });
    const strength = passwordStrength(newPassword).id;
    let label = "";
    if (strength === 0) label = "Too Weak";
    else if (strength === 1) label = "Weak";
    else if (strength === 2) label = "Medium";
    else if (strength === 3) label = "Strong";

    setPasswordStrengthLabel(label);
  };

  const handleLogout = () => {
    Cookies.remove("mail");
    Cookies.remove("token");
    setLogin(false);
    setUserData([]);
    setNavComponent("login");
    setTab("");
  };

  const handleSaveLogo = async () => {
    const Token = userdata.token;
    if (Token) {
      const response = await updateUser(Token, selectedAvatarId, null);
      if (response === "logo updated") {
        setEditLogo(false);
        const updateData = await getUserData(Token);
        if (updateData) setUserData(updateData);
        setPopupMessage("Logo Updated");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    }
  };

  const handleSaveField = async (field) => {
    const Token = userdata.token;
    if (Token) {
      if (formData[field].length > 14) {
        setPopupMessage("Username Max Size is 14");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }
      const response = await updateUser(Token, null, formData[field]);
      if (response === "username updated") {
        setEditingField(null);
        const updateData = await getUserData(Token);
        if (updateData) setUserData(updateData);
        setPopupMessage("Username Updated");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    }
  };

  const handleChangePassword = async () => {
    const Token = userdata.token;
    if (Token) {

      if(!passwordData.oldPassword){
        setPopupMessage("Enter Old Password.");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      } else if(!passwordData.newPassword){
        setPopupMessage("Enter New Password.");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }
      const strength = passwordStrength(passwordData.newPassword).id;
      if (strength < 2) {
        setPopupMessage("Passwords is too weak!");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPopupMessage("Passwords do not match!");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }
      const response = await changePassword(
        Token,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      if (response === "passwordchanged") {
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setPopupMessage("Password Updated Successfully");
        setTimeout(() => setPopupMessage(null), 3000);
        setShowPasswordChange(false);
      } else if (response === "passwordincorrect") {
        setPopupMessage("Old Password Incorrect");
        setTimeout(() => setPopupMessage(null), 3000);

      } else if (response === "invaliduser") {
        setPopupMessage("Invalid User");
        setTimeout(() => setPopupMessage(null), 3000);

      } else {
        setPopupMessage("Failed to update password");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const Token = userdata.token;
    if (Token) {
      if(!deletePassword){
        setPopupMessage("Enter Password.");
        setTimeout(() => setPopupMessage(null), 3000);
        return;
      }
      const response = await deleteUser(Token, deletePassword);
      if (response === "accountdeleted") {
        setPopupMessage("Account Deleted Successfully");
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else if (response == "passwordincorrect") {
        setPopupMessage("Password Incorrect.");
        setTimeout(() => setPopupMessage(null), 3000);
      } else if (response == "invaliduser") {
        setPopupMessage("User not found.");
        setTimeout(() => setPopupMessage(null), 3000);
      } else {
        setPopupMessage("Failed to delete account. Check your password.");
        setTimeout(() => setPopupMessage(null), 3000);
      }
    }
  };

  return (
    <div className="relative h-[90vh] w-full bg-gray-50">
      <button
        onClick={() => setTab("")}
        className="absolute top-[2.5vh] right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        ✖
      </button>

      <div className="flex flex-col md:flex-row h-full bg-gray-50 overflow-y-auto">
        <div
          className={`flex flex-col justify-center items-center ${editLogo ? "w-full md:w-1/2" : "w-full"
            } px-4 md:px-6 py-6 bg-white shadow-lg rounded-lg`}
        >
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
            Settings
          </h1>
          <form className="w-full max-w-sm space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={ImgChecker()}
                  alt="User Logo"
                  className="rounded-full w-20 h-20 md:w-24 md:h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setEditLogo(!editLogo)}
                  className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1 md:p-2 hover:bg-orange-600 focus:outline-none"
                >
                  ✏
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Username
              </label>
              {editingField === "username" ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField("username")}
                    className="ml-2 text-white bg-orange-500 px-2 py-1 text-xs md:text-sm rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm md:text-base">{formData.username}</p>
                  <button
                    type="button"
                    onClick={() => setEditingField("username")}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Email
              </label>
              <p className="text-sm md:text-base">{formData.mail}</p>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Change Password
            </button>

            {showPasswordChange && (
              <div className="mt-4">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-2"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setShowIndicator(true)}
                  onBlur={() => !passwordData.newPassword && setShowIndicator(false)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-2"
                  required
                />
                {showIndicator && (
                  <div className="mt-2 text-sm">
                    <span
                      className={`font-semibold ${passwordStrengthLabel === "Too Weak"
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
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-2"
                  required
                />
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Save Password
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </form>
        </div>

        {editLogo && (
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100 px-4 md:px-6 py-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">
              Choose a Logo
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg border ${selectedLogo === logo
                    ? "border-orange-500"
                    : "border-transparent"
                    }`}
                  onClick={() => setSelectedLogo(logo)}
                >
                  <img
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveLogo}
              className="mt-6 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Save
            </button>
          </div>
        )}

      </div>
      {showDeleteAccountModal && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <form className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Account Deletion
            </h2>
            <input
              type="password"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none mb-4"
            />
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => {setShowDeleteAccountModal(false); setDeletePassword("")}}
              className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {popupMessage && <Popup popupmessage={popupMessage} />}
    </div>
  );
};

export default Settings;
