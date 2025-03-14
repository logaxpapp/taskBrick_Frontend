import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Modern icons


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  return (
    <header className="bg-[#ffffff] shadow px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <p className="ml-2 font-extrabold text-2xl text-[#002962] transition-all duration-300 hover:text-[#0f1a91]">
                Task<span className="text-[#7ae582] transition-all duration-300 hover:text-[#0f1a91]">Brick</span>
                </p>

          </Link>
        </div>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex space-x-6 text-gray-700">
          <NavItem to="/home" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/services" label="Services" />
          <NavItem to="/contact-us" label="Contact" />
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex space-x-4">
          <Link to="/login">
            <button className="border border-gray-700 px-5 py-2 rounded-md text-[#192bc2] font-semibold hover:bg-gray-100 transition duration-300">
              Login
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="bg-[#192bc2] text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300">
              Start Free Trial
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white  shadow-md py-4 absolute top-16 left-0 w-full z-50">
          <nav className="flex flex-col space-y-4 items-center text-lg">
            <NavItem to="/home" label="Home" onClick={() => setIsOpen(false)} />
            <NavItem to="/about" label="About" onClick={() => setIsOpen(false)} />
            <NavItem to="/services" label="Services" onClick={() => setIsOpen(false)} />
            <NavItem to="/contact-us" label="Contact" onClick={() => setIsOpen(false)} />
            <div className="flex flex-col space-y-2 w-full items-center mt-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="border border-gray-700 px-5 py-2 rounded-md text-[#192bc2] hover:bg-gray-100 transition duration-300 w-full">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <button className="bg-[#192bc2] text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

// ✅ Reusable Nav Item Component
const NavItem: React.FC<{ to: string; label: string; onClick?: () => void }> = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-700 hover:text-blue-500 transition duration-300 focus:outline-none focus:ring focus:ring-blue-300 px-3 py-2"
  >
    {label}
  </Link>
);

export default Header;
