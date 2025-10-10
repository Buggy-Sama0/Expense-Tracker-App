
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './AddExpense.css';

const AddExpense = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');    
    const [message, setMessage]=useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add logic to submit expense
 
        // Create date in YYYY-MM-DD format (timezone-neutral)
        const dateStr = new Date(date).toISOString().split('T')[0];
        const token=localStorage.getItem('token')

        try {            
            const response=await axios.post(`${API_URL}/addExpense`, 
                {description, amount, category, 
                    date: dateStr // YYYY-MM-DD
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                
            );
            console.log(response.data);

            setMessage(response.data.message);
            setDescription('');
            setAmount('');
            setCategory('');
            setDate('');
        } catch(error) {
             console.log("Error: ", error);
        }
    };

    const resetSubmit=() => {
        setDescription('');
        setAmount('');
        setCategory('');
        setDate('');
    }
    
    return (
        <section className="add-expense-container">
            <div className="add-expense-header">
                <h2 className="add-expense-title">
                    <span className="title-icon">💰</span>
                    Add New Expense
                    <span className="title-decoration">✨</span>
                </h2>
                <p className="add-expense-subtitle">Track your spending with ease</p>
            </div>
            
            {message && (
                <div className={`message-container ${message.includes('Error') ? 'error' : 'success'}`}>
                    <span className="message-icon">
                        {message.includes('Error') ? '❌' : '✅'}
                    </span>
                    <p className="message-text">{message}</p>
                </div>
            )}
            
            <form className="add-expense-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        <span className="label-icon">📝</span>
                        Description
                    </label>
                    <input 
                        id="description"
                        type="text" 
                        placeholder="What did you spend on?" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount" className="form-label">
                        <span className="label-icon">💵</span>
                        Amount
                    </label>
                    <div className="amount-input-wrapper">
                        <span className="currency-symbol-add">$</span>
                        <input 
                            id="amount"
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                            className="form-input amount-input"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="category" className="form-label">
                        <span className="label-icon">🏷️</span>
                        Category
                    </label>
                    <select 
                        id="category"
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                        className="form-select"
                    >
                        <option value="">Select a category...</option>
                        <option value="Food">🍕 Food</option>
                        <option value="Travel">✈️ Travel</option>
                        <option value="Bill">📄 Bill</option>
                        <option value="Utility">⚡ Utility</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date" className="form-label">
                        <span className="label-icon">📅</span>
                        Date
                    </label>
                    <input 
                        id="date"
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                        className="form-input"
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-primary">
                        <span className="btn-icon">➕</span>
                        Add Expense
                    </button>
                    <button type="reset" onClick={() => resetSubmit()} className="btn-secondary">
                        <span className="btn-icon">🔄</span>
                        Reset
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AddExpense;