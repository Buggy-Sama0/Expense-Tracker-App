import { NavLink } from 'react-router-dom';
import './Header.css';


const Header = () => {
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
                </nav>
            </div>
        </header>
    );
};

export default Header;