
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import Reports from './components/Reports';
import Settings from './components/Settings';



import './App.css'

const App = () => {
    
    return (
        <Router>
            <div className="app">
                <Header />
                <main>
                    
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/add-expense" element={<AddExpense />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                                {/* Add catch-all route for 404s */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
            
                </main>
            </div>
        </Router>
        
    );
};

export default App;