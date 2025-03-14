import React from 'react';
// example placeholders for images
import heroBackground from '../../assets/images/designSystem.svg';
import user1 from '../../assets/images/fourImage.svg';




const Hero: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center"> {/* Container and responsive padding */}
      {/* Left content */}
      <div className="flex-1 md:mr-8 text-center md:text-left"> {/* Text alignment responsive */}
        <p className="text-[#192bc2] bg-blue-100 rounded-3xl py-2 px-4 inline-block font-bold mb-6"> {/* Use inline-block */}
          TaskBrick bring your office near you
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"> {/* Responsive font sizes, leading */}
          Manage your tasks and projects effectively
        </h1>
        <p className="text-gray-500 font-bold mb-8 md:mb-10 lg:mb-12"> {/* Responsive margins */}
          We help you plan and manage your meetings, sprints, and projects in one platform seamlessly.
        </p>

        {/* Stats row (Responsive) */}
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-8 mb-8 md:mb-10 lg:mb-12"> {/* Responsive layout */}
          <div className="mb-4 md:mb-0"> {/* Margin bottom for stacked layout */}
            <h3 className="text-2xl font-bold">30K+</h3>
            <p className="text-gray-500 text-sm">Active users</p>
          </div>
          <div className="border-t-2 md:border-t-0 md:border-l-2 h-0 md:h-16 w-full md:w-auto"></div> {/* Responsive border */}
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm mb-1">What our users say</p>
            <div className="flex justify-center md:justify-start space-x-2"> {/* Responsive image alignment */}
              <img src={user1} alt="user1" className="w-20 h-12 rounded-full" /> {/* Adjusted image size */}
            </div>
          </div>
        </div>

        {/* CTA buttons (Responsive) */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"> {/* Responsive layout */}
          <button className="bg-[#192bc2] text-white py-3 px-6 md:py-4 md:px-8 hover:bg-blue-600 rounded-lg font-bold w-full md:w-auto"> {/* Responsive width */}
            Start Your Free Trial
          </button>
          <button className="border border-blue-500 text-[#192bc2] py-3 px-6 md:py-4 md:px-8 hover:bg-blue-50 rounded font-[660] w-full md:w-auto"> {/* Responsive width */}
            <a href="https://www.youtube.com/watch?v=6v2L2UGZJAM" target="_blank" rel="noopener noreferrer">
              How it works
            </a>
          </button>
        </div>
      </div>

      {/* Right illustration (Responsive) */}
      <div className="flex-1 flex justify-center mt-8 md:mt-0"> {/* Margin top responsive */}
        <img src={heroBackground} alt="Hero illustration" className="max-w-full h-auto" />
      </div>
    </section>
  );
};

export default Hero;