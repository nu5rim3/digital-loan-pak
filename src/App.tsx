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
import Customers from './pages/Users/Customers';
import Guarantors from './pages/Users/Guarantors';
import Witnesses from './pages/Users/Witnesses';
import themeConfig from './utils/themeConfig';
import GeneralAppraisalList from './pages/ApprovalFlow/Components/TableSearch/TableSearch';
import AppraisalPreviewPage from './pages/ApprovalFlow/FirstFlow/AppraisalPreviewPage';

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
const LoanDashboard = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard'))
const CustomerOnboarding = lazy(() => import('./pages/Users/Customers/CustomerOnboarding'))
const GuarantorOnboarding = lazy(() => import('./pages/Users/Guarantors/GuarantorOnboarding'))
const CustomerDetails = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Customer/CustomerDetails'))
const GuarantorDetail = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Guarantor/GuarantorDetails'))
const WitnessDetails = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/Witness/WitnessDetails'))
const BusinessIntroducers = lazy(() => import('./pages/AccessAndPermission/BusinessIntroducer'))
const LoanFormApplication = lazy(() => import('./pages/Loan/LoanApplication/LoanDashboard/LoanApplication/LoanFormApplication'))


const tenet = import.meta.env.VITE_TENET;
const baseURL = import.meta.env.VITE_BASE_URL;

export const mainURL = `/${tenet}-${baseURL}/auth`;

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, tokenData, loginInProgress } = useContext<IAuthContext>(AuthContext);
  const { user, fetchUserByUserName } = useUserStore();


  useEffect(() => {
    if (token && tokenData) {
      localStorage.setItem("token", token);
      fetchUserByUserName(tokenData.sub);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loginInProgress) {
    return <PageLoader />;
  }

  if (!token) {
    return <LandingPage />;
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
    <ConfigProvider theme={themeConfig}>
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
                        } />
                        <Route path="roles" element={
                          <UnderConstruction />
                        } />
                        <Route path="business-introducers" element={
                          <BusinessIntroducers />
                        } />
                      </Routes>
                    }
                  />
                  {/* <Route
                    path="approval/*"
                    element={
                      <Routes>
                        <Route path="group" element={
                          <UnderConstruction />
                        } />
                        <Route path="user" element={
                          <UnderConstruction />
                        } />
                        <Route path="workflow" element={
                          <UnderConstruction />
                        } />
                      </Routes>
                    }
                  /> */}
                  <Route
                    path="gold/*"
                    element={
                      <Routes>
                        <Route path="goldsmith" element={
                          <UnderConstruction />
                        } />
                        <Route path="marketvalue" element={
                          <UnderConstruction />
                        } />
                      </Routes>
                    }
                  />

                  <Route
                    path="users/*"
                    element={
                      <PrivateRoute allowedRoles={
                        ["ADMIN"]
                      } />}>
                    <Route path="customer" element={<CustomerOnboarding />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customer/:id" element={<UnderConstruction />} />

                    <Route path="guarantor" element={<GuarantorOnboarding />} />
                    <Route path="guarantors" element={<Guarantors />} />
                    <Route path="guarantor/:id" element={<UnderConstruction />} />

                    <Route path="witnesses" element={<Witnesses />} />
                    <Route path="witness" element={<UnderConstruction />} />
                    <Route path="witness/:id" element={<UnderConstruction />} />
                  </Route>

                  <Route
                    path="approval/*"
                    element={
                      <PrivateRoute allowedRoles={
                        ["ADMIN", "CO", "BHO", "CC", "IBU", "IMD", "CR", "CA", "CAD", "AM", "RBH", "COO", "CEO", "CD"]
                      } />}>
                    <Route path="list/:flow" element={<GeneralAppraisalList />} />
                    <Route path="preview/:flow/:appraisalId" element={<AppraisalPreviewPage />} />
                  </Route>

                  <Route
                    path="loan/*"
                    element={
                      <PrivateRoute allowedRoles={
                        ["ADMIN", "BHO", "CRO"]
                      } />}>
                    <Route path="application" element={<LoanApplication />} />
                    {/* <Route path="application/:appId" element={<LoanDashboard />} /> */}
                    {/* <Route path="application/:appId" element={<CustomerOnboarding />} /> */}
                    <Route path="application/:appId" element={<LoanDashboard />} />
                    <Route path="application/:appId/customer" element={<CustomerDetails />} />
                    <Route path="application/:appId/guarantor/set" element={<GuarantorOnboarding />} />
                    <Route path="application/:appId/guarantor" element={<GuarantorDetail />} />
                    <Route path="application/:appId/witness" element={<WitnessDetails />} />
                    <Route path="application/:appId/loan-application" element={<LoanFormApplication />} />
                  </Route>
                </Route>
              </Routes>
            </AuthWrapper>
          </RoleProvider>
        </Suspense>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;