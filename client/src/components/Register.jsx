import './Register.css';
import {useReducer, useState} from 'react'
import { API_URL } from '../config';
import axios from 'axios';


const initialState = {
    firstName: '',
    lastName: '',
    username:'',
    email: '',
    password: '',
};


function formReducer(state=initialState, action) {
    switch (action.type) {
        case 'NEW_USER':
            return {
                ...state,
                [action.field]:action.payload
            }
        default:
            return state;    
    } 
}


export default function Register() {

    const [formData, dispatch]=useReducer(formReducer, initialState);
    const [error, setError]=useState('')
    const [message, setMessage]=useState('')
    const [errorCondition, setCondition]=useState()

    const handleChange=(e) => {
        dispatch({
                type: 'NEW_USER',
                field:e.target.name,
                payload: e.target.value
            })
    }

    async function handleSubmit(e) {
        try {
            e.preventDefault()
            console.log(e.target.confirmPassword.value)

            if (formData.password!==e.target.confirmPassword.value) {
                console.log('mpt match');
                setError('Password not match')
                setCondition(true)
                return
            }

            const response = await axios.post(`${API_URL}/register`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response) {
                e.target.password.value=''
                e.target.confirmPassword.value=''
                e.target.lastName.value=''
                e.target.firstName.value=''
                e.target.email.value=''
                e.target.username.value=''
            }

            setMessage(response.data.message)
            setCondition(false)
            
            console.log(response.data);
        } catch(err) {
            console.log('error in the client side', err);            
            console.log(formData);    
        } 
    }


    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Start managing your expenses today</p>
                </div>

                 {errorCondition?error && <div className="error-message">{error}</div>:
                    message && <div className="success-message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user"></i>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user"></i>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter a username"
                                    onChange={(e) => handleChange(e)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>
                    </div>

                    <div className="terms-section">
                        <label className="checkbox-label">
                            <input type="checkbox" name="terms" required />
                            <span>I agree to the Terms & Conditions</span>
                        </label>
                    </div>

                    <button type="submit" className="register-btn">
                        Create Account
                    </button>

                    <div className="register-footer">
                        <p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}