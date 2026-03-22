import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { assets, dummyEducatorData } from '../../assets/assets';

const Navbar = () => {
    // 1. Get educator dummy data from assets
    const educatorData = dummyEducatorData;[1, 2]

    // 2. Get user data from Clerk's useUser hook
    const { user } = useUser();[2]

    return (
        // Parent Div 
        <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-500/20"> {/* [4] */}

            {/* Logo wrapped in a Link routing back to the homepage */}
            <Link to="/"> {/* [2] */}
                <img src={assets.learnhub_logo} alt="logo" className="w-28 lg:w-32" /> {/* [2] */}
            </Link>

            {/* User Profile Area */}
            <div className="flex items-center gap-5 text-gray-500 relative"> {/* [4] */}

                {/* Dynamic Greeting */}
                <p>
                    Hi! {user ? user.fullName : 'Developers'} {/* [3] */}
                </p>

                {/* Profile Icon (Clerk UserButton if logged in, fallback image if not) */}
                {user ? (
                    <UserButton /> /* [3] */
                ) : (
                    <img
                        className="w-8 h-8 rounded-full"
                        src={assets.profile_img}
                        alt="profile"
                    /> /* [3] */
                )}
            </div>
        </div>
    );
};

export default Navbar;