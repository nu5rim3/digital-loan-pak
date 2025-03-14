import { createContext, useState, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoleContext = createContext<any>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedRole, setSelectedRole] = useState<string>("ADMIN"); // Default role

    return (
        <RoleContext.Provider value={{ selectedRole, setSelectedRole }}>
            {children}
        </RoleContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRole = () => useContext(RoleContext);
