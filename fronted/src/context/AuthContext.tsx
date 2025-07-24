import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserData }   from '../types'; // Import the UserData type
import type {ReactNode} from 'react'

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    token: string | null;
    loading: boolean; // Indicates if the initial authentication check is still ongoing
    loginAuth: (token: string, userData: UserData) => void;
    logout: () => void;
    // You might add a signup function here if it directly updates auth state
    // signup: (token: string, userData: UserData) => void;
}

// The props that AuthProvider component will accept
interface AuthProviderProps {
    children: ReactNode; // ReactNode allows any valid React child (components, elements, etc.)
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = AuthContext.Provider
// React.FC<> React Funciontal Component that accepts <>
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null)
    const [token, setToken] = useState<string | null> (null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadAuthData = () => {
            try {
                // Prefer HTTP-only cookies for JWTs
                // For the moment use localStorage
                const storedToken = localStorage.getItem('authToken')
                const storedUser = localStorage.getItem('authUser')

                if (storedToken && storedUser) {
                    const parsedUser: UserData = JSON.parse(storedUser);
                    setIsAuthenticated(true);
                    setToken(storedToken);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Failed to load auth data from storage:", error);
                // Clear any corrupted data
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
            } finally {
                setLoading(false); // Authentication check is complete
            }
        }
        loadAuthData();
    }, []);
    // Function to handle user login
    const loginAuth = (newToken: string, userData: UserData) => {
        // Store token and user data in local storage (or secure cookies)
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(userData));

        setIsAuthenticated(true);
        setToken(newToken);
        setUser(userData);
    };

    // Function to handle user logout
    const logout = () => {
        // Remove token and user data from local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');

        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
    };

    // The value provided to consumers of the context
    const authContextValue: AuthContextType = {
        isAuthenticated,
        user,
        token,
        loading,
        loginAuth,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

