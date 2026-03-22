import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        // Main footer wrapper
        <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 py-4 border-t border-gray-500/20">

            {/* Left Column: Logo, Separator Line, and Copyright */}
            <div className="flex items-center gap-4">
                <img src={assets.learnhub_logo} alt="logo" className="hidden md:block w-40" />

                {/* Vertical line separator using background color */}
                <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>

                <p className="py-4 text-center text-xs md:text-sm text-gray-500">
                    Copyright 2026 © LearnHub. All Right Reserved.
                </p>
            </div>

            {/* Right Column: Social Media Links */}
            <div className="flex items-center gap-3">
                <a href="#">
                    <img src={assets.facebook_icon} alt="Facebook" />
                </a>
                <a href="#">
                    <img src={assets.twitter_icon} alt="Twitter" />
                </a>
                <a href="#">
                    <img src={assets.instagram_icon} alt="Instagram" />
                </a>
            </div>

        </footer>
    );
};

export default Footer;
