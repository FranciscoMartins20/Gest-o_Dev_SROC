import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserDetails, loginUser } from '../service/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true';
    });
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        
        if (isAuthenticated && token) {
            fetchAndSetUserDetails(token); 
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const login = async (username, password) => {
        try {
            const response = await loginUser(username, password);
            const { token } = response;
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            fetchAndSetUserDetails(token);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
           
        }
    };

    const fetchAndSetUserDetails = async (token) => {
        try {
            const userDetails = await fetchUserDetails(token);
            setUser(userDetails);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar detalhes do usuário:', error);
            setLoading(false);
        }
    };
    
    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser({});
    };

    const authContextValue = {
        isAuthenticated,
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
