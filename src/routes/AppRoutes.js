import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Attendance from '../pages/employee/Attendance';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import LeaveRequests from '../pages/admin/LeaveRequests';

// Manager Pages
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import TeamLeaveManagement from '../pages/manager/TeamLeaveManagement';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import LeaveApplication from '../pages/employee/LeaveApplication';
import LeaveHistory from '../pages/employee/LeaveHistory';

import DashboardLayout from '../layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route element={<DashboardLayout />}>
                
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={[1]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={[1]}>
                        <UserManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/leave-requests" element={
                    <ProtectedRoute allowedRoles={[1]}>
                        <LeaveRequests />
                    </ProtectedRoute>
                } />
                


                
                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={
                    <ProtectedRoute allowedRoles={[2]}>
                        <ManagerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/manager/team-leave" element={
                    <ProtectedRoute allowedRoles={[2]}>
                        <TeamLeaveManagement />
                    </ProtectedRoute>
                } />
                




                {/* Employee Routes */}
                <Route path="/employee/dashboard" element={
                    <ProtectedRoute allowedRoles={[3]}>
                        <EmployeeDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/employee/apply-leave" element={
                    <ProtectedRoute allowedRoles={[3]}>
                        <LeaveApplication />
                    </ProtectedRoute>
                } />
                <Route path="/employee/leave-history" element={
                    <ProtectedRoute allowedRoles={[3]}>
                        <LeaveHistory />
                    </ProtectedRoute>
                } />
                <Route path="/attendance" element={
                    <ProtectedRoute allowedRoles={[3]}>
                        <Attendance />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
