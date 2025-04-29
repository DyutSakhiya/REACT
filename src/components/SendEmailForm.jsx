import React from 'react'

function SendEmailForm() {
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 pb-52"> 
        <form className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Send Email</h1>
            <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded p-2 mb-4 w-80"
            />
            <textarea
            
            placeholder="Enter your message"
            className="border border-gray-300 rounded p-2 mb-4 w-80 h-32"
            ></textarea>
            <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
            Send Email
            </button>
        </form>
    </div>
  )
}

export default SendEmailForm