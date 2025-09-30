import {useState, useEffect} from 'react'
import axios from 'axios';
import { API_URL } from '../config';


import './ImgUploader.css';

const ImgUploader=() => {
    const token = localStorage.getItem('token');
    
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [text, setText]=useState('');
    const [message, setMessage]=useState('');

    const jjj=[
        {
            "description": "Pizza",
            "amount": "1500",
            "date": "2025-07-19",
            "category": "bill"
        },
        {
            "description": "MoMO",
            "amount": "100",
            "date": "2025-09-09",
            "category": "food"
        },
    ] 

    /*
    useEffect(() => {
        (async () => {
            try {                
                for (const obj in jjj) {
                    console.log(jjj[obj].description);   
                    
                    const response = await axios.post(
                        `${API_URL}/addExpense`,
                        {   
                            description: jjj[obj].description, 
                            amount: jjj[obj].total_price, 
                            category: jjj[obj].category , 
                            date: jjj[obj].date },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                    console.log(response);
                }
                
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);*/

    
     // Handle drag-and-drop events
    const handleDragOver=(e) => {
        e.preventDefault() 
        setIsDragging(true)
    }

    const handleDragLeave=(e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop= async (e) => {
        e.preventDefault() 
        setIsLoading(false)
        if (e.target.files[0].type=='application/pdf' || e.target.files[0].type.startsWith('image/')) {
            console.log(e.target.files[0]);
            await processImgFile(e.target.files[0])
            return
        }
        setError('Please drop a valid PDF file.');
        setTimeout(() => {
            setError('');
        }, 3000)
        
        
    }

    // handle file Change
    const handleFileChange= async (e) => {
        if (e.target.files[0].type=='application/pdf' || e.target.files[0].type.startsWith('image/')) {
            console.log(e.target.files[0]);
            await processImgFile(e.target.files[0])
            return
        } 
        setError('Please select a valid PDF file.');
        setTimeout(() => {
            setError('');
        }, 3000)
        
    }

    // Process the PDF file by sending it to the backend
    const processImgFile = async (file) => {
        setIsLoading(true)
        //console.log(file);
        //const imgFile = await pdfToImg(URL.createObjectURL(file));
        //console.log(imgFile);
        const formData=new FormData()
        formData.append('ImgFile', file)
        try {
            const response = await axios.post(`${API_URL}/processIMG`, formData, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                },
            );
            // Axios throws for non-2xx, so only check for data here
            console.log(response.data);
            console.log(typeof response.data.AI_Response);
            addExpenseFromAI(response.data.AI_Response)
            setText(response.data.AI_Response);
        } catch (error) {
            setError(error.response?.statusText || error.message || 'An unexpected error occurred');
            console.error('Error in the client side....', error);
        } finally {
            setIsLoading(false);
        }
    }
    
    async function addExpenseFromAI(jsonObj) {
        // Remove code block markers if present
        const cleaned = jsonObj.replace(/```json|```/g, '').trim();
        let parsed;
        let addExpenseAutomation;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            console.error('Failed to parse AI response:', err);
            addExpenseAutomation=false
            return;
        }
        try {
            for (let i in parsed) {
                //console.log(parsed[i].date);
                if (parsed[i].total_price=='' || parsed[i].date=='' ) {
                    setError('Missing fields')
                    break;
                }
                const response = await axios.post(
                    `${API_URL}/addExpense`,
                    {   
                        description: parsed[i].description, 
                        amount: parsed[i].total_price.replace(/[^\d.]/g, ''), 
                        category: parsed[i].category, 
                        date: parsed[i].date 
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                console.log(response.data.message);
                
            }
            addExpenseAutomation=true 
            if (addExpenseAutomation) setMessage('Expense Recorded👌')
        } catch(error) {
            setError(error.response.message)
        }  
    }

    return (
        <div className="pdf-uploader-container">
            <div
                className={`pdf-uploader-dropzone${isDragging ? ' dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pdf-input').click()}
            >
                <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf, image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isLoading}
                />
                {isLoading ? (
                    <div className="pdf-uploader-loading">
                        <p>Processing Image... This may take a moment.</p>
                        {/* Add a spinner or loading animation here */}
                    </div>
                ) : (
                    <div className="pdf-uploader-message">
                        <p className="pdf-uploader-message-title">
                            {isDragging ? 'Drop Image here' : 'Upload Reciepts Imgs'}
                        </p>
                        <p className="pdf-uploader-message-desc">
                            Drag and drop your IMG file here, or click to browse
                        </p>
                        <p className="pdf-uploader-message-note">
                            Supports statements from most major banks
                        </p>
                    </div>
                )}
            </div>
            {error && (
                <div className="pdf-uploader-error">
                    <p className="pdf-uploader-error-text">{error}</p>
                </div>
            )}

            {(() => {
                let parsed;
                try {
                    parsed = typeof text === 'string' ? JSON.parse(text) : text;
                } catch {
                    parsed = null;
                }
                if (parsed && Array.isArray(parsed)) {
                    // Handle array of objects
                    return (
                        <div className="ai-output">
                            <h3>AI Extracted Details</h3>
                            <ul>
                                {parsed.map((item, idx) => (
                                    <li key={idx}>
                                        {Object.entries(item).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                } else if (parsed && typeof parsed === 'object') {
                    // Handle single object
                    return (
                        <div className="ai-output">
                            <h3>AI Extracted Details</h3>
                            <ul>
                                {Object.entries(parsed).map(([key, value]) => (
                                    <li key={key}><strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}</li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                // Only use a plain <pre> with no background class when not JSON
                return <pre>{text}</pre>;
            })()}
            <h2>{message}</h2>
        </div>    
    )
}

export default ImgUploader;