import React, { createContext, useState } from 'react'

export const DashboardContext = createContext();

export const DashboardView = ({ children }) => {
    const [tab, setTab] = useState('')

    return <DashboardContext.Provider value={{ tab, setTab }}>
        {children}
    </DashboardContext.Provider>

}
