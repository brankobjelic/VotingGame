import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
}

// Create a context with an undefined initial value
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Create a provider component to wrap the application
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

    // Function to log in a user by setting the username
    const login = (username: string) => {
        setUser(username);
    };

    // Function to log out the user by clearing the username
    const logout = () => {
        setUser(null);
    };

    // Provide the context value to children components
    return (
        <SessionContext.Provider value={{ user, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook to use the SessionContext
export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};