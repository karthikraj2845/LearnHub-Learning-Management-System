import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const Sidebar = () => {
    // Check if user is an educator
    const { isEducator } = useContext(AppContext);

    // Menu items array 
    const menuItems = [
        { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
        { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
        { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
        { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon }
    ];

    // Only render sidebar if isEducator is true
    return isEducator && (
        <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
            {menuItems.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.name}
                    // Add end property specifically for the dashboard root link
                    end={item.path === '/educator'}
                    // Dynamically apply classes if the route is active
                    className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-8 gap-3 border border-transparent ${isActive ? 'bg-blue-50 border-r-blue-600 border-r-[6px]' : 'hover:bg-gray-50/90'
                        }`}
                >
                    <img src={item.icon} alt={item.name} className="w-6 h-6" />
                    <p className="md:block hidden text-center">{item.name}</p>
                </NavLink>
            ))}
        </div>
    );
};

export default Sidebar;