import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../UserDetails";
import { DashboardContext } from "../DashboardView";
import Cookies from "js-cookie";
import Av1 from "../assets/Avatars/Av1.png";
import Av2 from "../assets/Avatars/Av2.png";
import Av3 from "../assets/Avatars/Av3.png";
import Av4 from "../assets/Avatars/Av4.png";
import Av5 from "../assets/Avatars/Av5.png";
import Av6 from "../assets/Avatars/Av6.png";
import logo from "../assets/logo.png";
import './NavBar.css'

const NavBar = ({ setNavComponent, NavComponent }) => {
  const { login, setLogin, userdata, setUserData } = useContext(DataContext);
  const { setTab } = useContext(DashboardContext);
  const [menuOpen, setMenuOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const avatarMap = {
    "001": Av1,
    "002": Av2,
    "003": Av3,
    "004": Av4,
    "005": Av5,
    "006": Av6,
  };

  const ImgChecker = () => avatarMap[userdata.avatarId] || null;

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const closeDropdown = (e) => {
    if (
      dropdownOpen &&
      !e.target.closest("#dropdown") &&
      !e.target.closest(".user-box")
    ) {
      setDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("mail");
    Cookies.remove("token");
    setLogin(false);
    setUserData([]);
    setNavComponent("login");
    setTab("");
  }

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  return (
    <nav>
      <div className="logo-container">
        <div onClick={() => setNavComponent('home')} className="flex cursor-pointer items-center space-x-4">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-white text-xl font-bold">TodoList</span>
        </div>
      </div>

      {/* Menu Button for Mobile */}
      <button
        className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0 w-full md:w-auto`}
      >
        {login ? (
          <div className="relative user-box">
            <div
              className={`${
                menuOpen ? "flex md:flex" : "hidden md:flex"
              } items-center space-x-3 cursor-pointer bg-white px-4 py-2 rounded-md shadow-lg`}
              onClick={toggleDropdown}
            >
              <img src={ImgChecker()} alt="User" className="h-10 w-10 rounded-full" />
              <span className="text-black font-medium">{userdata.username}</span>
            </div>

            {/* Dropdown Links */}
            {(menuOpen || dropdownOpen) && (
              <div
                id="dropdown"
                className="dropdown"
              >
                <button
                  onClick={() => setTab("")}
                  className="dropdown-buttons"
                >
                  My Tasks
                </button>
                <button
                  onClick={() => setTab("settings")}
                  className="dropdown-buttons"
                >
                  Settings
                </button>
                <button
                  onClick={() => {handleLogout()}}
                  className="dropdown-buttons"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 ${
              menuOpen
                ? "absolute top-16 left-4 right-4 bg-white p-4 rounded-lg shadow-lg"
                : ""
            }`}
          >
            {NavComponent === "login" ? null : (
              <button
                onClick={() => setNavComponent("login")}
                className="nav-components"
              >
                Login
              </button>
            )}
            {NavComponent === "signup" ? null : (
              <button
                onClick={() => setNavComponent("signup")}
                className="nav-components"
              >
                Sign Up
              </button>
            )}
            <button className="nav-components">Contact</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
