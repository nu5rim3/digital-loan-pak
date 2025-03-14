import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "../hooks/RoleContext";
import { mainURL } from "../App";

interface PrivateRouteProps {
    allowedRoles: string[];
    userRole: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ userRole }) => {
    const { selectedRole } = useRole();
    return [selectedRole].includes(userRole) ? <Outlet /> : <Navigate to={`${mainURL}/unauthorized`} />;
};

export default PrivateRoute;
