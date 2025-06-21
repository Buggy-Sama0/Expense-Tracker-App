import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';


const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1>💰 Expense Tracker</h1>

                <nav>
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/add-expense"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Add Expense
                    </NavLink>
                    <NavLink 
                        to="/reports"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Reports
                    </NavLink>
                    <NavLink 
                        to="/settings"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Settings
                    </NavLink>
                    <div className="user-section">
                        <span className="username">Welcome, {user.username || 'User'}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;