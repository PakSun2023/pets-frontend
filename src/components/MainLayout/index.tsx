import React from 'react'
import Header from '../Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className='w-screen h-screen'>
            <Header />
            <div id="content">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout