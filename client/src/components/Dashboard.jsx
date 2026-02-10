import {useState, useEffect, useRef, useContext} from 'react'
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { API_URL } from '../config';
import DialoBox from './DialogBox';
import {ThemeContext} from '../App'

import './Dashboard.css'

const Dashboard = () => {
    const [amount, setAmount]=useState(0);
    const [foodExpense, setFoodExpense]=useState(0);
    const [travelExpense, setTravelExpense]=useState(0);
    const [billExpense, setBillExpense]=useState(0);
    const [utilityExpense, setUtilityExpense]=useState(0);
    const [transaction, setTransaction] = useState([]);
    const dialogRef=useRef();

    const [loading, setLoading] = useState(true)
    const [hasLoaded, setHasLoaded] = useState(false);

    const theme= useContext(ThemeContext)

    const token=localStorage.getItem('token')
    
    async function fetchJson() {
        const request=await axios.get(`${API_URL}/showExpense`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return request; 
    }

    // to show the total expense spent
    const fetchApiData= async () => {

        const response=await fetchJson();
        //console.log(response.data);

        const array= await response.data
        let totalAmount=0;

        array.map((data) => {
            // console.log(data.amount); 
            totalAmount+=data.amount;

        })  
        setAmount(totalAmount);  
               
    }

    // Display the last few transactions
    async function showExpenseList() {
        setLoading(true);
        try {
            const response=await fetchJson();
            const jsonObj=await response.data;

            if (!Array.isArray(jsonObj)) {
                throw new Error('API response is not an array');
            }
            const transactionList=jsonObj.map(expense => ({
                ...expense
            }));
            
            setTransaction(transactionList)
            // console.log("Fetched Transaction", transactionList);
            setHasLoaded(true); // Mark that we've loaded data at least once

            // Re calling it for real time update data
            fetchApiData();
            getDataForPie() ;
            setLoading(false);
        } catch(error) {
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false)
        }
    }   

    // Pop up dialog to confirm delete function
    const openDialog = (name) => {
        dialogRef.current.returnValue=name
        dialogRef.current.showModal()
    }

    // if 'Close' || 'Cancel' button is pressed will run this function
    const closeDialog = (e) => {
        dialogRef.current.close(e.target.textContent) 
        //console.log(dialogRef.current.returnValue);
    }

    // if 'Delete' button is pressed then deletes the record and closes the dialog
    function handleDelete(e) {;
        //console.log('Return Value:', dialogRef.current.returnValue);
        deleteExpense(dialogRef.current.returnValue)
        closeDialog(e)
    }
    
    // delete expense function
    async function deleteExpense(name) {

        try {
            const response=await axios.delete(`${API_URL}/deleteExpense/${encodeURIComponent(name)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                },
            );
            
            console.log(response.data);
            showExpenseList();

        } catch(err) {
            console.log("Error:", err.message);
            
        } 
    }

    // to divide expense by categories
    async function getDataForPie() {
        
        try {
            const response = await fetchJson();
            const jsonObj = await response.data;

            let bill = 0, food = 0, travel = 0, utility=0;
            
            // Calculate totals
            jsonObj.forEach(item => {
                switch(item.category) {
                    case 'Bill': bill += item.amount; break;
                    case 'Food': food += item.amount; break;
                    case 'Travel': travel += item.amount; break;
                    case 'Utility': utility += item.amount; break;
                }
            });

            // Update state
            setBillExpense(bill);
            setFoodExpense(food);
            setTravelExpense(travel);
            setUtilityExpense(utility)

            /*console.log('Expense Totals:', {
                OTT: ottExpense,
                Food: foodExpense,
                Travel: travelExpense,
                Array: expenseArray
            });*/
            
        } catch (error) {
            console.error('Error in getDataForPie:', error);
            return [0, 0, 0]; // Return default empty values on error
        } finally {
            setLoading(false)
        }
    }


    // Update the data object for better pie chart configuration
    const data = {
        labels: ['Food', 'Travel', 'Bill'],
        datasets: [
            {
                data: [foodExpense, travelExpense, billExpense, utilityExpense],
                backgroundColor: [
                    'rgb(239, 68, 68)',  // Red for Food
                    'rgb(59, 130, 246)', // Blue for Travel
                    'rgb(245, 158, 11)',  // Orange for Bill
                    'rgb(63, 193, 30)'  // Orange for Bill
                ],
                borderColor: 'white',
                borderWidth: 2,
            },
        ],
    };
    
    // Add chart options for better visualization
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false, // We'll create our own legend
            }
        }
    };
    
    useEffect(() => {
        fetchApiData();
        
    }, [])


    useEffect(() => {
        getDataForPie();
    }, [])


    // Checking DATES
    /*
    useEffect(() => {
        transaction.forEach(exp => {
            console.log({
            stored: exp.date,
            asDate: new Date(exp.date),
            local: new Date(exp.date).toLocaleDateString()
            });
        });
    }, [transaction]);
    */

    // UI Design
    return (
        <section className={`dashboard-container-${theme}`}>
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <span className="title-icon">📊</span>
                    Financial Overview
                    <span className="title-decoration">✨</span>
                </h1>
                <p className="dashboard-subtitle">Track your spending and stay within budget</p>
            </div>

            <div className="dashboard-stats-grid">
                <div className="stat-card budget-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-wrapper budget-icon">
                            <div className="icon-glow"></div>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20 7V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1h-7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h7Zm-7 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9v-4h-9Zm7 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                            </svg>
                        </div>
                        <div className="stat-trend budget-trend">
                            <span className="trend-indicator">📈</span>
                            <span className="trend-text">Available</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Budget Remaining</div>
                        <div className="stat-value budget-value">
                            <span className="currency-symbol">$</span>
                            <span className="amount">{Math.floor((localStorage.getItem('budget')-amount)*100)/100}</span>
                        </div>
                        <div className="stat-description">https://extensions.lilianbischung.fr/http://localhost:5173/
                            Out of ${localStorage.getItem('budget')} budget
                        </div>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill budget-progress" 
                                style={{
                                    width: `${Math.max(0, Math.min(100, ((localStorage.getItem('budget')-amount) / localStorage.getItem('budget')) * 100))}%`
                                }}
                            ></div>
                        </div>
                        <div className="progress-label">
                            {Math.round(((localStorage.getItem('budget')-amount) / localStorage.getItem('budget')) * 100)}% remaining
                        </div>
                    </div>
                </div>

                <div className="stat-card expense-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-wrapper expense-icon">
                            <div className="icon-glow"></div>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19 2H5a2 2 0 0 0-2 2v18l3-3 3 3 3-3 3 3 3-3 3 3V4a2 2 0 0 0-2-2Zm-2 14H7v-2h10v2Zm0-4H7V8h10v4Z"/>
                            </svg>
                        </div>
                        <div className="stat-trend expense-trend">
                            <span className="trend-indicator">📉</span>
                            <span className="trend-text">Spent</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Expenses</div>
                        <div className="stat-value expense-value">
                            <span className="currency-symbol">$</span>
                            <span className="amount">{Math.floor(amount*100)/100}</span>
                        </div>
                        <div className="stat-description">
                            {((amount / localStorage.getItem('budget')) * 100).toFixed(1)}% of budget used
                        </div>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill expense-progress" 
                                style={{
                                    width: `${Math.min(100, (amount / localStorage.getItem('budget')) * 100)}%`
                                }}
                            ></div>
                        </div>
                        <div className="progress-label">
                            {Math.round((amount / localStorage.getItem('budget')) * 100)}% of budget
                        </div>
                    </div>
                </div>

                <div className="stat-card summary-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-wrapper summary-icon">
                            <div className="icon-glow"></div>
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4H4v12h16V7zM7 9h10v2H7V9zm0 4h7v2H7v-2z"/>
                            </svg>
                        </div>
                        <div className="stat-trend summary-trend">
                            <span className="trend-indicator">📋</span>
                            <span className="trend-text">Summary</span>
                        </div>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Financial Health</div>
                        <div className="stat-value summary-value">
                            <span className="health-score">
                                {amount <= localStorage.getItem('budget') * 0.7 ? '🟢' : 
                                 amount <= localStorage.getItem('budget') * 0.9 ? '🟡' : '🔴'}
                            </span>
                            <span className="health-text">
                                {amount <= localStorage.getItem('budget') * 0.7 ? 'Excellent' : 
                                 amount <= localStorage.getItem('budget') * 0.9 ? 'Good' : 'Warning'}
                            </span>
                        </div>
                        <div className="stat-description">
                            {amount <= localStorage.getItem('budget') * 0.7 ? 'Great spending control!' : 
                             amount <= localStorage.getItem('budget') * 0.9 ? 'Watch your expenses' : 'Budget exceeded!'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="expense-breakdown-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="section-icon">🥧</span>
                        Expense Breakdown
                    </h3>
                    <div className="total-amount-badge">
                        Total: ${Math.floor(amount*100)/100}
                    </div>
                </div>
                
                <div className="breakdown-content">
                    
                    {loading ? (
                        <span colSpan="4" className="loading-cell">
                            <div className="spinner"></div>
                            Loading data...
                        </span>
                    ): (
                        <div className="chart-container">
                            <Pie data={data} options={chartOptions} />
                        </div>
                    )}

                    
                    
                    <div className="category-stats">
                        <div className="category-item food-category">
                            <div className="category-header">
                                <div className="category-color food-color"></div>
                                <span className="category-name">🍕 Food</span>
                            </div>
                            <div className="category-amount">${foodExpense}</div>
                            <div className="category-percentage">
                                {amount > 0 ? ((foodExpense/amount)*100).toFixed(1) : 0}%
                            </div>
                        </div>
                        
                        <div className="category-item travel-category">
                            <div className="category-header">
                                <div className="category-color travel-color"></div>
                                <span className="category-name">✈️ Travel</span>
                            </div>
                            <div className="category-amount">${travelExpense}</div>
                            <div className="category-percentage">
                                {amount > 0 ? ((travelExpense/amount)*100).toFixed(1) : 0}%
                            </div>
                        </div>
                        
                        <div className="category-item bill-category">
                            <div className="category-header">
                                <div className="category-color bill-color"></div>
                                <span className="category-name">📄 Bill</span>
                            </div>
                            <div className="category-amount">${billExpense}</div>
                            <div className="category-percentage">
                                {amount > 0 ? ((billExpense/amount)*100).toFixed(1) : 0}%
                            </div>
                        </div>
                        
                        <div className="category-item utility-category">
                            <div className="category-header">
                                <div className="category-color utility-color"></div>
                                <span className="category-name">⚡ Utility</span>
                            </div>
                            <div className="category-amount">${utilityExpense}</div>
                            <div className="category-percentage">
                                {amount > 0 ? ((utilityExpense/amount)*100).toFixed(1) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <dialog ref={dialogRef}> 
                <h2>Delete Transaction?</h2>
                <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                <div className="dialog-actions">
                    <button className="cancel" onClick={closeDialog} autoFocus>Cancel</button>
                    <button className="confirm" onClick={handleDelete}>Delete</button>
                </div>
            </dialog>


                                    
            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <button className="byyn" onClick={() => showExpenseList() }>Click Me</button>
                <button className="byyn" onClick={() => setTransaction([]) }>Clear</button>
                
                
                <dialog> 
                    <button autofocus>Close</button>
                    <p>This modal dialog has a groovy backdrop!</p>
                </dialog>

                <table>

                    {transaction.length===0 ? (
                        // Initial state - table is blank
                        <tbody>
                            <tr>
                                <td colSpan="4" className="empty-state">
                                Click to load transactions
                                </td>
                            </tr>
                        </tbody>
                    ): loading ? (
                        <tbody>
                            <tr>
                                <td colSpan="4" className="loading-cell">
                                    <div className="spinner"></div>
                                    Loading transactions...
                                </td>
                            </tr>
                        </tbody>
                    ): transaction.length === 0 ? (
                        // Loaded but no data
                        <tbody>
                            <tr>
                                <td colSpan="4" className="empty-state">
                                No transactions found
                                </td>
                            </tr>
                        </tbody>
                    ) :(
                        // Has data to display
                        <>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.map((data, index) => (
                            <tr key={index}>
                                    <td>{data.description}</td> 
                                    <td>{data.category}</td> 
                                    <td>{data.amount}</td> 
                                    <td><button onClick={() => openDialog(data.description)}>delete</button></td>
                            </tr>    
                            ))}
                        </tbody>
                        </>
                    )}
                </table>
                
                    
                
            </div>
        </section>
    );

};


export default Dashboard;