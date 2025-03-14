// src/Router.tsx
// import React, { ReactNode } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LandingPage from '../pages/Landing';
// import GoldSmithPage from '../pages/GoldLoan/GoldSmith';
import LoginPage from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
// import DashboardLayout from '../components/layouts/DashboardLayout';
// import MarketValue from '../pages/GoldLoan/MarketValue';
// import Accounts from '../pages/AccessAndPermission/Accounts';
// import Roles from '../pages/AccessAndPermission/Roles';
// import Members from '../pages/AccessAndPermission/Members';
// import Group from '../pages/ApprovalAndRatification/Group';
// import User from '../pages/ApprovalAndRatification/User';
// import Workflow from '../pages/ApprovalAndRatification/Workflow';
// import MisReport from '../pages/Reports/mis';
// import GoldReport from '../pages/Reports/gold';

const tenet = import.meta.env.VITE_TENET;
const baseURL = import.meta.env.VITE_BASE_URL;

const mainBase = `/${tenet}-${baseURL}`;

const publicRoutes = [
    { path: `/${mainBase}/login`, component: LoginPage },
]

const authProtectedRoutes = [

]



export { publicRoutes, authProtectedRoutes }