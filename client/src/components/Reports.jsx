
import {useEffect, useState} from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file for calender
import 'react-date-range/dist/theme/default.css'; 
import { Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { API_URL } from '../config';

import './Reports.css'


const Reports = () => {

    const token = localStorage.getItem('token');
    

    const [allExpenses, setAllExpenses]=useState([]);
    const [expenses, setExpenses]=useState([]);
    const [startDate, setStartDate]= useState(new Date());
    const [endDate, setEndDate]= useState(new Date());
    const [category, setCategory]=useState('');

    /*
    const [foodExpense, setFoodExpense]=useState();
    const [travelExpense, setTravelExpense]=useState();
    const [billExpense, setBillExpense]=useState(); */

    const [labelData, setLabelData]=useState([]);
    const [lineData, setLineData]=useState([]);


    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

    function sortArray(array) {

        for (let i=0;i<array.length;i++) {
            for(let j=i+1;j<array.length;j++) {
                if (array[i].date>array[j].date) {
                    let temp=array[i];
                    array[i]=array[j]
                    array[j]=temp;
                }
            }
        }
        return array;
    }

    //console.log(dateRange);
    //console.log(allExpenses)
    //console.log(expenses);
    //console.log(category);
    
    //console.log(selectionRange);
    //console.log(selectionRange.startDate);

    // filtering function in real-time
    const applyFilters= () => {

        let filtered=allExpenses.filter((expense)=>{
            let expenseDate=new Date(expense.date);
            
            // Handle single day selection
            if (startDate.getTime() === endDate.getTime()) {
                return (
                    expenseDate.getFullYear() === startDate.getFullYear() &&
                    expenseDate.getMonth() === startDate.getMonth() &&
                    expenseDate.getDate() === startDate.getDate()
                );
            } 

            // Handle date range
            return expenseDate >= startDate && expenseDate <= endDate;
        });

        if (category==='') {
            setExpenses(sortArray(filtered));
            return;       
        } 

        // applying changes according category
        let filtered2=handleFilter(filtered)
        setExpenses(sortArray(filtered2));
    }
    
    const handleFilter= (array) => {
        let x;
        switch(category) {
            case 'Bill':
                x=array.filter((expense) => expense.category==category);
                break;
            case 'Travel':
                x=array.filter((expense) => expense.category==category);
                break;
            case 'Food':
                x=array.filter((expense) => expense.category==category);
                break;
        }

        //console.log(x); 

        return x;
    }

     // Handle date range changes
    const handleSelect = (ranges) => {
        setStartDate(ranges.selection.startDate);
        setEndDate(ranges.selection.endDate);
    };

    // for line graph plotting
    function getDataForLine() {

        let label=[]
        let data=[];

        let testList=[]
        
        /*
        for (let item of expenses) {   
            data.push(item.amount)

            label.push(item.date.slice(8,10))
        }*/

        //console.log(expenses[2]);

        for (let item of expenses) {   
            testList.push(item)
        }
        //console.log(testList);

        for (let i=0;i<testList.length;i++) {
            let total=0

            for(let j=i+1;j<testList.length;j++) {

                if(testList[i].date===testList[j].date) {
                    total+=testList[j].amount;
                    const index=testList.indexOf(testList[j])

                    if (index!==-1) {
                        testList.splice(index, 1)
                    }
                }
            }
            data.push(testList[i].amount+total)
            label.push(testList[i].date.slice(8,10))
 
        }
        //console.log(data);


        /*
        for (let i=startDate.getDate();i<endDate.getDate()+1;i++) {
            label.push(i)
        }*/
       /*
        let x=[1,4,6,2,3,10,9,8,0]

        for (let i=0;i<x.length;i++) {
            for(let j=i+1;j<x.length;j++) {
                if (x[i]>x[j]) {
                    let temp=x[i];
                    x[i]=x[j]
                    x[j]=temp;
                }
            }
        }

        console.log(x);*/
        
        setLabelData(label)
        setLineData(data);
 
        //console.log(endDate.getDate());
        //console.log(selectionRange);
    }

    // Draw Line Graph 
    const data={
       // x-axis label values
       labels: labelData,
       title:"scs",
       datasets: [
          {
              label: "Expense Over Time",
              // y-axis data plotting values
              data: lineData,
              fill: false,
              borderWidth:4,
              backgroundColor: "rgb(188, 189, 190)",
              borderColor:'rgb(75, 192, 192)',
              responsive:true
            },
        ],
    }

    const options = {
        scales: {
        x: {
            title: {
                display: true,
                text: 'Date (DD)' // X-axis label
            }
        },
        y: {
            title: {
                display: true,
                text: 'Expense Amount ($)' // Y-axis label
            },
            beginAtZero: true // Start y-axis at zero
        }
        }
    }
    
    //console.log(lineData);
    
    // for Pie and line graph render
    useEffect(() => {
        getDataForLine()
    }, [expenses]);
    

    // Re-apply filters whenever dates, category, or source data changes
    useEffect(() => {
        applyFilters();
    }, [allExpenses, startDate, endDate, category])


    // Fetch initial data
    useEffect( () => {
        async function fetchExpense() {            
            const response=await axios.get(`${API_URL}/showExpense`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                },
            );
            //console.log(response.data);
            
            setAllExpenses(response.data);
        }

        fetchExpense()
            .catch(console.error);  
    }, [])


    return (
        <section id="reports">
            <h2>Spending Reports</h2>
            
            {/* Implement charts or graphs here */}
            <DateRangePicker
                startDatePlaceholder="Start Date"
                endDatePlaceholder="End Date"
                onChange={handleSelect}
                months={1}
                inputRange={[]}
                ranges={[selectionRange]}
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bill">Bill</option>

            </select>

            <table>
                <thead>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                </thead>
                {
                expenses.map(expense => (
                    <tr>
                        <td>{expense.description}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.date.slice(0,10)}</td>
                    </tr>
                ))
                }       
            </table> <br/><br/><br/>

            <h2>Graphs</h2>

            <Line data={data} options={options} />
        </section>
    );
};

export default Reports;