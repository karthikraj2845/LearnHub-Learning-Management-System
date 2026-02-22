import React from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser} from '@clerk/clerk-react'
const Navbar = () => {
    const location = useLocation()
    const isCourseListPage = location.pathname.includes('/course-list')
    const {openSignIn} = useClerk()
    const {user} = useUser()
    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-orange-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-orange-100/70'}`}>
            <img src={assets.learnhub_logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
            <div className='hidden md:flex items-center gap-5 text-gray-500'>
                <div className='flex items-center gap-5'>
                    <button className='mx-10'>Become Educator</button>
                    <Link to='/my-enrollments'>My Enrollments</Link>
                </div>
                <button onClick={() => openSignIn()} className='bg-orange-600 text-white px-5 py-2 rounded-full cursor-pointer'>Create Account</button>
            </div>
            <div className='md:hidden flex items-center gap-5 text-gray-500'>
                <div>
                    <button className='mx-10'>Become Educator</button>
                    <Link to='/my-enrollments'>My Enrollments</Link>
                </div>
                <button><img src={assets.user_icon} alt="" /></button>
            </div>
        </div>
    )
}

export default Navbar
