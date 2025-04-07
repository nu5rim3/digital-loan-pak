import { Navigate, Outlet } from "react-router-dom";
import { mainURL } from "../App";
import useUserStore from "../store/userStore";

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {

    const { currentRole } = useUserStore();

    return allowedRoles.includes(currentRole?.code ?? '') ? <Outlet /> : <Navigate to={`${mainURL}/unauthorized`} />;
};

export default PrivateRoute;
