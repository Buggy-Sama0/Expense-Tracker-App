import { NavLink, useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react'
import axios from 'axios';
import { API_URL } from './config';
import './Header.css';


const Header = () => {
    const navigate = useNavigate();
    const token=localStorage.getItem('token')
    const [userName, setUserName]=useState('')

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(()=> {

        const fetchUser= async () => {

            try {
                const response=await axios.get(`${API_URL}/user`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
                setUserName(response.data.username)
                console.log(response.data); 
            
            } catch(error) {
                console.log(error.response.data);
                
            }
        }
        fetchUser()    
    })

    return (
        <header className="header">
            <div className="header-content">
                <h1>💰 Expense Tracker</h1>

                <nav>
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon" role="img" aria-label="dashboard">📊</span>
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/add-expense"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon" role="img" aria-label="add-expense">➕</span>
                        Add Expense
                    </NavLink>
                    <NavLink 
                        to="/reports"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon" role="img" aria-label="reports">📑</span>
                        Reports
                    </NavLink>
                    <NavLink 
                        to="/settings"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon" role="img" aria-label="settings">⚙️</span>
                        Settings
                    </NavLink>
                    <div className="user-section">
                        <span className="username">Welcome, {userName|| 'User'}</span>
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