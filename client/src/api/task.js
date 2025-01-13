import axios from 'axios';

export const createTask = async (title, description, notify, userid) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/createTask`, {
            title: title,
            description: description,
            notify: notify,
            userid: userid
        });
        return response.data.message;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export const getTasks = async (userid) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/getTasks`, { userid: userid });
        if (response.data.message == 'notaksfound') return response.data.message;
        if (response.data.message == 'found') {
            const Data = {
                'status': 'found',
                'details': response.data.tasks
            }
            return Data;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export const deleteTask = async (userId, taskId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/deleteTask`, { userId: userId, taskId: taskId });
        if (response.data.message == 'invaliduser') return response.data.message;
        if (response.data.message == 'notaksfound') return response.data.message;
        if (response.data.message == 'taskdeleted') return response.data.message;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export const editTask = async (userId, taskId, newTitle, newDescription, notify) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/editTask`, { userId: userId, taskId: taskId, newTitle: newTitle, newDescription: newDescription, notify: notify });
        if (response.data.message == 'notaksfound') return response.data.message;
        if (response.data.message == 'changed') return response.data.message;
        if (response.data.message == 'notchanged') return response.data.message;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}