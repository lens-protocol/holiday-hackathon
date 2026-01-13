import React from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'

type Props = {
    children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Toaster position="top-right" />
            <Navbar />
            <div className='flex-grow bg-gradient-to-b from-white to-emerald-50'>
                {children}
            </div>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}