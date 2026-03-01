import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
    return (
        <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
            <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
                Learn anything, anytime ,anywhere
            </h1>
            <p className="text-gray-500 sm:text-sm px-20">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum corrupti sequi nihil dolore aliquid suscipit ea accusamus modi pariatur deleniti. Possimus voluptatem provident nihil eveniet minus pariatur saepe fuga eos doloremque fugit. Corporis delectus assumenda praesentium, ipsam explicabo dolores repellat aliquid illo tempore dolorum aliquam.
            </p>
            <div className="flex items-center font-medium gap-6 mt-4">
                <button className="px-6 py-3 rounded-md text-white bg-blue-600">
                    Get started
                </button>
                <button className="flex items-center gap-2">
                    Learn more 
                    <img src={assets.arrow_icon} alt="Arrow icon" />
                </button>
                
            </div>
        </div>
    );
};

export default CallToAction;
