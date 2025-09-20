
import React, { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { MenuIcon, XIcon, InstagramIcon, MailIcon } from './Icons';
import { SiteContext } from '../App';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logo } = useContext(SiteContext);

  const linkClasses = "text-teal-700 hover:text-teal-900 transition-colors duration-300";
  const activeLinkClasses = "text-teal-900 font-bold";

  return (
    <header className="bg-[#D1FFFC]/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-serif font-bold text-teal-900 tracking-wider">
              {logo ? (
                <img src={logo} alt="Alicia R. Photography Logo" className="h-16 w-auto" />
              ) : (
                'Alicia R.'
              )}
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            <nav className="flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <div className="ml-8 border-l border-[#B8FFA1] pl-8">
               <NavLink to="/admin" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Admin</NavLink>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-700 hover:text-teal-900 hover:bg-[#FFFF94] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B8FFA1]"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[...NAV_LINKS, { name: 'Admin', path: '/admin' }].map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${linkClasses} ${isActive ? activeLinkClasses : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#D1FFFC] border-t border-[#B8FFA1]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6">
          <a href="mailto:contact@aliciar.photo" className="text-teal-700 hover:text-teal-900 transition-colors duration-300">
            <span className="sr-only">Email</span>
            <MailIcon className="h-6 w-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-900 transition-colors duration-300">
            <span className="sr-only">Instagram</span>
            <InstagramIcon className="h-6 w-6" />
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-teal-700">
          &copy; {new Date().getFullYear()} Alicia R. Photography. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
