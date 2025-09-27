import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const ForgotPassword= () => {
    const [email, setEmail]=useState('');
    const [message, setMessage]=useState('')
    
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response=await axios.post(`${API_URL}/forgot-password`, {
                email: email
            })
            console.log(response.data);
            setMessage(response.data)
        }catch(error) {
            console.log(error.message);
            setMessage('This email is not registered')
        } finally {
            setTimeout(()=> setMessage(''), 4000)
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
        <h3>{message}</h3>
        </>
    )

}

export default ForgotPassword;