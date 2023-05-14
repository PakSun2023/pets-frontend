import React from 'react'

const ErrorPage = () => {
    return (
        <div id="error-page" className='w-screen h-screen flex justify-center items-center'>
            <div className='card items-center space-y-8'>
                <h1 className='font-bold text-5xl'>Oops!</h1>
                <p className='text-3xl'>Sorry, You Are Visit Invalid Page.</p>
                <div>
                    <a href="/" className='btn btn-accent'>Back to Home</a>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage