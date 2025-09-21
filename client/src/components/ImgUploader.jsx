import {useState} from 'react'
import axios from 'axios';
import { API_URL } from '../config';


import './ImgUploader.css';

const ImgUploader=() => {
    const token = localStorage.getItem('token');
    
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [text, setText]=useState('');

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
            setText(response.data.paramText);
        } catch (error) {
            setError(error.response?.statusText || error.message || 'An unexpected error occurred');
            console.error('Error in the client side....', error);
        } finally {
            setIsLoading(false);
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

            {text}
        </div>    
    )
}

export default ImgUploader;