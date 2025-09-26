import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const ForgotPassword= () => {
    const [email, setEmail]=useState('');
    
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response=await axios.post(`${API_URL}/forgot-password`, {
                email: email
            })
            console.log(response.data);
        }catch(error) {
            console.log(error.message);
        }
    }

    return (
        <>
        <h1>Recover your account</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
                type='email' 
                name="email" 
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="Enter your email"
                required/>
            <button type="submit">Submit</button>
        </form>
        </>
    )

}

export default ForgotPassword;