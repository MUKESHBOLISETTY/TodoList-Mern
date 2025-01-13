import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../UserDetails';
import NavBar from '../components/NavBar';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import Home from '../components/Home';
import Cookies from 'js-cookie';
import { getUserData } from '../api/api';

const UserChecker = () => {

    const { login, setLogin, userdata, setUserData } = useContext(DataContext);

    const [NavComponent, setNavComponent] = useState('home');

    useEffect(() => {
        const checkUserAuthentication = async () => {
            const Token = Cookies.get('token');
            const localToken = (Token !== undefined) ? { token: Token } : null;
            if (localToken) {
                const data = await getUserData(Token);
                data ? (setLogin(true), setUserData(data)) : (setLogin(false), setUserData([]))
            }
        }
        checkUserAuthentication();
    }, [setLogin, setUserData])

    const TabView = () => {
        switch (NavComponent) {
            case 'home':
                return <Home setNavComponent={setNavComponent} />
            case 'login':
                return <Login setNavComponent={setNavComponent} />;
            case 'signup':
                return <Signup setNavComponent={setNavComponent} />;
        }
    }

    return (
        <>
            <NavBar setNavComponent={setNavComponent} NavComponent={NavComponent} />
            {login ?
            <Dashboard setNavComponent={setNavComponent} />
             : TabView()}
        </>
    )
}

export default UserChecker