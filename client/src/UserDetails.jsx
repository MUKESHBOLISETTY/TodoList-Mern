import React, { createContext, useState } from 'react'

export const DataContext = createContext();

export const UserDetails = ({ children }) => {

    const [login, setLogin] = useState(false);
    const [userdata, setUserData] = useState([])

    return <DataContext.Provider value={{ login, setLogin, userdata, setUserData }}>
            {children}
            </DataContext.Provider>
    
}
