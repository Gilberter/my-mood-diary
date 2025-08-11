import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserData }   from '../types'; // Import the UserData type
import type {ReactNode} from 'react'
import { profile, login, logout} from '../services/userServices';

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    loading: boolean; // Indicates if the initial authentication check is still ongoing
    loginAuth: (email: string, password: string) => void;
    logoutAuth: () => void;
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
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                // We are using HTTP-only cookies for JWTs
            
                const user = await profile()

                if (user) {
                    const parsedUser: UserData = user;
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                } else {
                    setIsAuthenticated(false);
                    setUser(null); 
                }
            } catch (error) {
                throw new Error("Failed to login")
     
            } finally {
                setLoading(false); // Authentication check is complete
            }
        }
        loadAuthData();
    }, []);
    // Function to handle user login
    const loginAuth = async (email: string,password:string) => {
        try {
            await login(email,password)
            const user = await profile()
            setIsAuthenticated(true);
            setUser(user);
        } catch {
            throw new Error("Login unsuccessfull")
        } finally {
            setLoading(false);
        }
        
    };

    // Function to handle user logout
    const logoutAuth = async () => {
        // Remove token and user data from local storage
        const message = await logout()
        if(message){
            setIsAuthenticated(false);
            setUser(null);
        }else {
            throw new Error("Logout Unsuccessfull")
        }
        
    };

    // The value provided to consumers of the context
    const authContextValue: AuthContextType = {
        isAuthenticated,
        user,
        loading,
        loginAuth,
        logoutAuth,
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

