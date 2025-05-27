
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AddExpense = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');    


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add logic to submit expense
 
        // Create date in YYYY-MM-DD format (timezone-neutral)
        const dateStr = new Date(date).toISOString().split('T')[0];

        try {            
            await axios.post(`${API_URL}/addExpense`, 
                {description, amount, category, 
                    date: dateStr // YYYY-MM-DD
                }, 
            );
            //console.log(response.data);

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
            {description}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bill">Bill</option>

                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <button type="submit">Add</button>
                <button type="reset" onClick={ ()=> resetSubmit() }>Cancel</button>
            </form>
        </section>
    );
};

export default AddExpense;