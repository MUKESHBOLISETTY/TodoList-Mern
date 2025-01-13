import axios from 'axios';
import dotenv from 'dotenv'
export const signUp = async (data) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/signup`, {
            data
        });
        if(response.data.email){
            return response.data.email;
        }
        return response.data.message;
    } catch (error) {
        return "error";

    }
}

export const deleteUser = async (token, pass) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/deleteUser`, {
            token: token,
            pass: pass
        });
        return response.data.message;
    } catch (error) {
        return "error";
    }
}

export const LogIn = async (data) => {
    try{
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/login`, {
            data
        });
        if (response.data.message === 'approved') {
            return response.data.details;
        }
            return response.data.message;
    } catch (error) {
        return "error";

    }
}

export const getUserData = async (token) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/logincheck`, {
            token: token,
        });
        if (response.data.message === 'userauthenticated') {
            return response.data.details;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export const updateUser = async (token, logoId, username) => {
    try {
        const payload = { token };
        if (logoId) payload.avatarId = logoId;
        if (username) payload.username = username;

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/updateUser`, {
            payload
        });
        if (response.data.flag === 'success') {
            return response.data.message;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export const changePassword = async (token, oldPassword, newPassword) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/updatePassword`, {
            token: token,
            Oldpass: oldPassword,
            Newpass: newPassword,
        });
        return response.data.message;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }

}

export const resetpassword = async(mail) => {
    try {
       const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/resetpassword`, {
        mail: mail
       });
       return response.data.message;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}