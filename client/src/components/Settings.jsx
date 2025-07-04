import React, { useState} from 'react';
import './Settings.css';
//import axios from 'axios';


const Settings = () => {

    const [budget, setBudget]=useState('');
    const [message, setMessage]=useState('');


    async function handleSubmit(e) {
        e.preventDefault();

        try {

            // Validate budget
            if (Number(budget) <= 0) {
                setMessage('Please enter a valid budget amount');
                return;
            }

            // Save budget
            localStorage.setItem('budget', budget);
            setMessage('Budget updated successfully!');

            console.log('The total budget set to:', localStorage.getItem('budget'));
            setBudget('');
            
        } catch (err) {
            setMessage('Error saving budget: ' + err.message);
            console.error('Error:', err);
        }
    }


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };
        
    return (
        <section id="settings">
            <h1>Settings</h1>
            <h3>Set Budget</h3>
            {/* User profile and budget settings */}

            {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}

            <form id="budgetForm" onSubmit={handleSubmit}>
                <label htmlFor="totalBudget">Total Budget:</label>
                <input value={budget}  onChange={(e) => setBudget(e.target.value)} type="number" id="totalBudget" required/>
                <button type="submit">Set Budget</button>
                <button type="reset" onClick={ () => {
                    setBudget('') 
                    setMessage('');}  }>Cancel</button>
            </form>

            <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon" role="img" aria-label="logout">🔒</span>
                Logout
            </button>
        </section>
    );
};

export default Settings;









