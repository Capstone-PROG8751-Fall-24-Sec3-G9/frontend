import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="h-auto lg:h-[75vh] flex flex-col lg:flex-row px-4 lg:px-8">
            {/* Text Section */}
            <div className="w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-yellow-100">
                    Discover, Imagine, and Grow with Every Page
                </h1>
                <p className="mt-4 text-base md:text-lg lg:text-xl text-zinc-300">
                    From thrilling mysteries to insightful nonfiction, find your perfect book here.
                </p>
                <div className="mt-8">
                    <Link to="/all-books">
                        <button className="px-6 py-3 text-yellow-100 text-lg md:text-xl lg:text-2xl font-semibold border border-yellow-100 rounded-full transition-all duration-300 hover:bg-yellow-100 hover:text-zinc-800">
                            Discover Books
                        </button>
                    </Link> 
                </div>
            </div>
            
            {/* Image Section */}
            <div className="w-full lg:w-3/6 flex items-center justify-center mt-8 lg:mt-0">
                <img 
                    src="./hero.jpg" 
                    alt="hero" 
                    className="w-full h-auto lg:h-full object-contain" 
                />
            </div>
        </div>
    );
};

export default Hero;
