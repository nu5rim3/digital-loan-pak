import { ConfigProvider } from 'antd';
import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from './components/common/loaders/PageLoader';
import LayoutContainer from './components/layouts/LayoutContainer';
import { RoleProvider } from './hooks/RoleContext';
import PrivateRoute from './routes/PrivateRoute';
import { AuthContext, AuthProvider, IAuthContext } from 'react-oauth2-code-pkce';
import { authConfig2 } from './authorization/authConfig';
import useUserStore from './store/userStore';

const LoginPage = lazy(() => import('./pages/Login'))
const LandingPage = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
// const Accounts = lazy(() => import('./pages/AccessAndPermission/Accounts'))
// const Members = lazy(() => import('./pages/AccessAndPermission/Members'))
// const Roles = lazy(() => import('./pages/AccessAndPermission/Roles'))
// const Group = lazy(() => import('./pages/ApprovalAndRatification/Group'))
// const User = lazy(() => import('./pages/ApprovalAndRatification/User'))
// const Workflow = lazy(() => import('./pages/ApprovalAndRatification/Workflow'))
// const GoldSmith = lazy(() => import('./pages/GoldLoan/GoldSmith'))
// const MarketValue = lazy(() => import('./pages/GoldLoan/MarketValue'))
const SelectUser = lazy(() => import('./pages/SelectUser/SelectUser'))
const DashboardSelection = lazy(() => import('./pages/DashboardSelection'))
const LoanApplication = lazy(() => import('./pages/Loan/LoanApplication'))
const UnderConstruction = lazy(() => import('./pages/UnderConstroction'))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage/UnauthorizedPage'))
const LoanDaashboard = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard'))
const CustomerOnboarding = lazy(() => import('./pages/Loan/LoanApplication/CustomerOnboarding'))
const CustomerDetails = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Customer/CustomerDetails'))
const GuarantorDetail = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Guarantor/GuarantorDetail'))
const WitnessDetails = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Witness/WitnessDetails'))

const tenet = import.meta.env.VITE_TENET;
const baseURL = import.meta.env.VITE_BASE_URL;

export const mainURL = `/${tenet}-${baseURL}/auth`;


const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // localStorage.clear();
  const { token, tokenData, loginInProgress } = useContext<IAuthContext>(AuthContext);
  const { user, fetchUserByUserName } = useUserStore()

  console.log("token", token);
  useEffect(() => {
    if (token && tokenData) {
      localStorage.setItem("token", token);
      fetchUserByUserName(tokenData.sub)
    }
  }, [token]);

  if (loginInProgress) {
    return <PageLoader />;
  }

  if (!token) {
    return (
      <LandingPage />
    );
  }

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div>
      {children}
    </div>
  );
};

const App: React.FC = () => {


  return (
    <ConfigProvider
    // theme={{
    //   token: {
    //     // Seed Token
    //     colorPrimary: '#87282b',
    //     borderRadius: 5,

    //     // Alias Token
    //     colorBgContainer: '#f6ffed',
    //   },
    // }}
    >
      <AuthProvider authConfig={authConfig2}>
        <Suspense fallback={<PageLoader />}>
          <RoleProvider>
            <AuthWrapper>
              <Routes>
                <Route path={`/`} element={<Navigate to={`${mainURL}/land`} />} />
                <Route path={`${mainURL}/unauthorized`} element={<UnauthorizedPage />} />
                <Route path={`${mainURL}/underconstruction`} element={<UnderConstruction />} />
                <Route path={`${mainURL}/land`} element={<LandingPage />} />
                <Route path={`${mainURL}/login`} element={<LoginPage />} />
                <Route path={`${mainURL}/*`} element={<Navigate to={`${mainURL}/dashboard-selection`} />} />
                <Route path={`${mainURL}/select-user`} element={<SelectUser />} />
                <Route path={`${mainURL}/dashboard-selection`} element={<DashboardSelection />} />
                <Route
                  path={`${mainURL}/*`}
                  element={
                    <LayoutContainer />
                  }
                >
                  <Route
                    path={`dashboard/*`}
                    element={<Dashboard />
                    }
                  />
                  <Route
                    path="permission/*"
                    element={
                      <Routes>
                        <Route path="accounts" element={
                          <UnderConstruction />
                          // <Accounts />
                        } />
                        <Route path="roles" element={
                          <UnderConstruction />
                          // <Roles />
                        } />
                        <Route path="members" element={
                          <UnderConstruction />
                          // <Members />
                        } />
                      </Routes>
                    }
                  />
                  <Route
                    path="approval/*"
                    element={

                      <Routes>
                        <Route path="group" element={
                          <UnderConstruction />
                          // <Group />
                        } />
                        <Route path="user" element={
                          <UnderConstruction />
                          // <User />
                        } />
                        <Route path="workflow" element={
                          <UnderConstruction />
                          // <Workflow />
                        } />
                      </Routes>

                    }
                  />
                  <Route
                    path="gold/*"
                    element={

                      <Routes>
                        <Route path="goldsmith" element={
                          <UnderConstruction />
                          // <GoldSmith />
                        } />
                        <Route path="marketvalue" element={
                          <UnderConstruction />
                          // <MarketValue />
                        } />
                      </Routes>

                    }
                  />
                  <Route
                    path="loan/*"
                    element={
                      <PrivateRoute allowedRoles={
                        ["ADMIN", "EDITOR", "VIEWER"]
                      } userRole={'ADMIN'} />}>
                    <Route path="application" element={<LoanApplication />} />
                    <Route path="application/new" element={<CustomerOnboarding />} />
                    <Route path="application/:id" element={<LoanDaashboard />} />
                    <Route path="application/:id/customer" element={<CustomerDetails />} />
                    <Route path="application/:id/guarantor" element={<GuarantorDetail />} />
                    <Route path="application/:id/witness" element={<WitnessDetails />} />
                    <Route path="marketvalue" element={
                      <UnderConstruction />
                      // <MarketValue />
                    } />
                  </Route>
                </Route>
              </Routes>
            </AuthWrapper>
          </RoleProvider>
        </Suspense>

      </AuthProvider>
    </ConfigProvider>
  )
}

export default App;