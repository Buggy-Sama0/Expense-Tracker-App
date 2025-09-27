import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';


const ResetPassword= () => {

    const [password, setPassword]=useState('');
    const [email, setEmail]=useState('');
    const [message, setMessage]=useState('');

    async function handleReset(e) {
        e.preventDefault();
        try {
            const response=await axios.post(`${API_URL}/reset-password/${email}`, {
               password: password
            })
            console.log(response.data.message);
            setMessage('response.data.message')
        }catch(error) {
            console.log(error.message);
            setMessage(error.message);
        } finally {
            setTimeout(()=> setMessage(''), 4000)
        }
    }

    return (
        <>
        <h1>Reset your password</h1>
        <h2>{message}</h2>
        <form onSubmit={handleReset}>
            <label htmlFor="email">Email</label>
            <input 
                type='email' 
                name="email" 
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="Enter your email"
                required/>
            <label htmlFor="password">Password</label>
            <input 
                type='password' 
                name="password" 
                onChange={(e)=> setPassword(e.target.value)}
                placeholder="Enter a new password"
                required/>
            <button type="submit">Submit</button>
        </form>

        <a href='/login'>Back to Log In</a>
        </>
    )

}

export default ResetPassword;