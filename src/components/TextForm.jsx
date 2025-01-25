import React, { useState } from 'react';

export default function TextForm(props) {
    const [text, setText] = useState('Enter Text here');
    const [count, setCount] = useState(0); // State for the counter

    const handleUpClick = () => {
        let newtext = text.toUpperCase();
        setText(newtext);
    };

    const handleLoClick = () => {
        let newtext = text.toLowerCase();
        setText(newtext);
    };

    const handleEmailExtractorClick = () => {
        let emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        let extractedEmails = text.match(emailRegex); // Match emails in the text
        let newtext = extractedEmails ? extractedEmails.join(", ") : "No emails found.";
        setText(newtext);
    };

    const handleClearClick = () => {
        setText('');
    };

    const handleOnChange = (event) => {
        setText(event.target.value);
    };

    const handleCountClick = () => {
        setCount(count + 1); 
    };

    const handleMinusClick = () => {
        if(count >0){
            setCount(count - 1); 

        }
    };

    
    


    return (
        <>
            <div className="containers">
                <div className="flex text-xl px-4 w-full h-full">
                    <div className="div my-3 mt-10">
                        <h1>{props.heading}</h1>
                        <textarea
                            className="form-control mx-1 mt-3 bg-slate-200 h-[200px] w-[1200px]"
                            value={text}
                            onChange={handleOnChange}
                            id="mybox"
                            rows="8"
                        ></textarea>
                    </div>
                </div>
                <button
                    className="btn btn-primary text-white bg-blue-700 hover:bg-blue-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleUpClick}
                >
                    Convert to Uppercase
                </button>
                <button
                    className="btn btn-primary text-white bg-purple-700 hover:bg-purple-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleLoClick}
                >
                    Convert to Lowercase
                </button>
                <button
                    className="btn btn-primary text-white bg-amber-700 hover:bg-amber-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleEmailExtractorClick}
                >
                    Email Extractor
                </button>
                <button
                    className="btn btn-primary text-white bg-red-700 hover:bg-red-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleClearClick}
                >
                    Clear Text
                </button>
                
            </div>
            <div className="container mx-5 mt-3 my-2">
                <h2 className="text-xl font-bold">Your text summary</h2>
                <p>{text.split(" ").length} words and {text.length} characters</p>
                <p>{0.008 * text.split(" ").length} Minutes read</p>
                <h2>Preview</h2>
                <p>{text}</p>
            </div>
            <button
                    className="btn btn-primary text-white bg-amber-700 hover:bg-amber-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleCountClick}
                >
                    Count
                </button>

                <button
                    className="btn btn-primary text-white bg-indigo-700 hover:bg-indigo-950 rounded-full h-10 w-[190px] mx-2"
                    onClick={handleMinusClick}
                >
                   Minus Count 
                </button>    

               
            <div className="container mx-5 mt-3 my-2">
                <h2>Click Count</h2>
                <p>Number count {count} </p>
            </div>
        </>
    );
}
