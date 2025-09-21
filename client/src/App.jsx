import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import ImgUploader from './components/ImgUploader';
//import axios from 'axios';
import { API_URL } from './config';
import './App.css';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    if (!token) {
        // Redirect to the login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    if (token) {
        // If user is authenticated, redirect to the location they came from or dashboard
        return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
    }
    
    return children;
};

const App = () => {
    return (
        <Router>
            <Analytics />
            <div className="app">
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        
                        {/* Public Routes */}
                        <Route path="/login" element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } />
                        <Route path="/register" element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        } />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <>
                                    <Header />
                                    <Dashboard />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/add-expense" element={
                            <ProtectedRoute>
                                <>
                                    <Header />
                                    <AddExpense />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/add-expense-byImg" element={
                            <ProtectedRoute>
                                <>
                                    <Header />
                                    <ImgUploader />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <>
                                    <Header />
                                    <Reports />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <>
                                    <Header />
                                    <Settings />
                                </>
                            </ProtectedRoute>
                        } />
                        {/* Add catch-all route for 404s */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;