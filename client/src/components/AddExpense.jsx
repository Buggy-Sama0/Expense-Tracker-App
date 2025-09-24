
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
        <section id="add-expense">
            <h2>Add Expense</h2>
            {message && <p>{<p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bill">Bill</option>
                    <option value="Utility">Utility</option>

                </select>
                <input placeholder="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <button type="submit">Add</button>
                <button type="reset" onClick={ ()=> resetSubmit() }>Cancel</button>
            </form>
        </section>
    );
};

export default AddExpense;