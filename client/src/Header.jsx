import { NavLink} from 'react-router-dom';
import {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import { API_URL } from './config';
import './Header.css';
import {ThemeContext} from './App'

const Header = () => {
    const token=localStorage.getItem('token')
    const [userName, setUserName]=useState('')
    const theme=useContext(ThemeContext)

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
                //console.log(response.data); 
            
            } catch(error) {
                console.log(error.response.data);
                
            }
        }
        fetchUser()    
    })

    return (
        <header className={`header theme-${theme}`}>
            <div className="header-content">
                <h1 className="header-title">💰 Expense Tracker</h1>

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
                        to="/add-expense-byImg" 
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span className="nav-icon" role="img" aria-label="ai-image-scanner">🤖📸</span>
                        Add Expense By Image
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
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;