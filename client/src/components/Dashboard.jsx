import {useState, useEffect} from 'react'
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { API_URL } from '../config';

import './Dashboard.css'

const Dashboard = () => {

    const [amount, setAmount]=useState(0);
    const [foodExpense, setFoodExpense]=useState(0);
    const [travelExpense, setTravelExpense]=useState(0);
    const [billExpense, setBillExpense]=useState(0);
    const [transaction, setTransaction] = useState([]);
    async function fetchJson() {

        const request=await axios.get(`${API_URL}/showExpense`);
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

        const response=await fetchJson();
        const jsonObj=await response.data;

        if (!Array.isArray(jsonObj)) {
            throw new Error('API response is not an array');
        }
        const transactionList=jsonObj.map(expense => ({
            ...expense
        }));
        
        setTransaction(transactionList)

        //console.log("Fetched Transaction", transactionList);

        // Re calling it for real time update data
        fetchApiData();
        getDataForPie() ;
        
    }    // delete expense function
    async function deleteExpense(name) {

        try {
            await axios.delete(`${API_URL}/deleteExpense/${encodeURIComponent(name)}`);
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

            let bill = 0, food = 0, travel = 0;
            
            // Calculate totals
            jsonObj.forEach(item => {
                switch(item.category) {
                    case 'Bill': bill += item.amount; break;
                    case 'Food': food += item.amount; break;
                    case 'Travel': travel += item.amount; break;
                }
            });

            // Update state
            setBillExpense(bill);
            setFoodExpense(food);
            setTravelExpense(travel);

            /*console.log('Expense Totals:', {
                OTT: ottExpense,
                Food: foodExpense,
                Travel: travelExpense,
                Array: expenseArray
            });*/
            
        } catch (error) {
            console.error('Error in getDataForPie:', error);
            return [0, 0, 0]; // Return default empty values on error
        }
    }


    // Update the data object for better pie chart configuration
    const data = {
        labels: ['Food', 'Travel', 'Bill'],
        datasets: [
            {
                data: [foodExpense, travelExpense, billExpense],
                backgroundColor: [
                    'rgb(239, 68, 68)',  // Red for Food
                    'rgb(59, 130, 246)', // Blue for Travel
                    'rgb(245, 158, 11)'  // Orange for Bill
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
        <section id="dashboard">
            <h2>Budget: ${localStorage.getItem('budget')-amount}</h2><br/>
            <h2>Total Expenses: ${amount}</h2>
            <div className="budget-overview">
                <h3>Expense Overview</h3>
                <div className="chart-container">
                    <Pie data={data} options={chartOptions} />
                </div>
                <div className="chart-legend">
                    <div className="chart-legend-item">
                        <span style={{ color: 'rgb(239, 68, 68)' }}>●</span>
                        <span>Food: ${foodExpense}</span>
                    </div>
                    <div className="chart-legend-item">
                        <span style={{ color: 'rgb(59, 130, 246)' }}>●</span>
                        <span>Travel: ${travelExpense}</span>
                    </div>
                    <div className="chart-legend-item">
                        <span style={{ color: 'rgb(245, 158, 11)' }}>●</span>
                        <span>Bill: ${billExpense}</span>
                    </div>
                </div>
            </div>
            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <button className="byyn" onClick={() => showExpenseList() }>Click Me</button>
                <button className="byyn" onClick={() => setTransaction([]) }>Clear</button>
                
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                        
                    </thead>
                    {transaction.map((data, index) => (
                    <tr key={index}>
                            <td>{data.description}</td> 
                            <td>{data.category}</td> 
                            <td>{data.amount}</td> 
                            <td><button onClick={() => deleteExpense(data.description)}>delete</button></td>
                    </tr>   
                        
                    ))}
                </table>
                    
                
            </div>
        </section>
    );

};


export default Dashboard;