import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';


const ResetPassword= () => {

    const [password, setPassword]=useState('')
    const [email, setEmail]=useState('');
    async function handleReset(e) {
        e.preventDefault();
        try {
            const response=await axios.post(`${API_URL}/reset-password/${email}`, {
               password: password
            })
            console.log(response.data.message);
        }catch(error) {
            console.log(error.message);
        }
    }

    return (
        <>
        <h1>Reset your password</h1>
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