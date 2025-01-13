import React, { useEffect, useState } from 'react'
import { passwordStrength } from 'check-password-strength';
import { useParams } from 'react-router-dom'
import Popup from './Popup';
import './Popup.css'
import axios from 'axios';

const ResetPassword = () => {
    const [isValid, setisValid] = useState(false);
    const params = useParams();
    const [popupMessage, setPopupMessage] = useState(null);
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const LinkChecker = async () => {
            const url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/reset/${params.userid}/${params.token}`;
            const response = await axios.get(url);
            if (response.data.message == 'invaliduser') {
                setisValid(false);
            } else if (response.data.message == 'validlink') {
                setisValid(true);
            }
        }
        LinkChecker()
    }, [params])
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setPopupMessage("Confirm Password Not Matched.");
                setTimeout(() => setPopupMessage(null), 3000);
                return;
            }
            const strength = passwordStrength(passwordData.newPassword).id;
            if (strength < 2) {
                setPopupMessage("Password is too weak.");
                setTimeout(() => setPopupMessage(null), 3000);
                return;
            }

            const url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/reset/${params.userid}/${params.token}`;
            const response = await axios.post(url, {
                newPassword: passwordData.newPassword
            });
            console.log(response)
            if (response.data.message == 'changed') {
                setPopupMessage("Password Reset Successfully.");
                setTimeout(() => setPopupMessage(null), 3000);
                return;
            }
            if (response.data.message == 'Invalid Link') {
                setisValid(false);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {isValid ?
                <div className='w-full h-screen flex justify-center items-center'>
                    <div className="reset-password-container">
                        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                        <form onSubmit={handleSubmit} className="max-w-md w-full">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    onFocus={() => setShowIndicator(true)}
                                    onBlur={() => !passwordData.newPassword && setShowIndicator(false)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                type='submit'
                                className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                    {popupMessage && <Popup popupmessage={popupMessage} />}

                </div>
                :
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                        <p className="text-lg text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
                        <a
                            href="/"
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                        >
                            Go to Homepage
                        </a>
                    </div>
                </div>
            }
        </>
    )
}

export default ResetPassword