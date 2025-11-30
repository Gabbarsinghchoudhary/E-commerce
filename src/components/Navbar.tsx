import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogOut,
  ChevronDown,
  Package,
  UserCog,
  Menu,
  Shield,
  PlusCircle,
  Layers,
  Mail,
  Users,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from 'react-responsive';
import { Logo, LogoIcon } from './Logo';

export const Navbar: React.FC = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /** Renders admin links if user is admin */
  const renderAdminLinks = (mobile = false) => {
    if (!user?.isAdmin) return null;
    return (
      <>
        <Link
          to="/manage-admins"
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
          onClick={() => {
            setIsDropdownOpen(false);
            if (mobile) setIsHamburgerOpen(false);
          }}
        >
          <Shield className="h-4 w-4" />
          <span>Manage Admins</span>
        </Link>
        <Link
          to="/manage-users"
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
          onClick={() => {
            setIsDropdownOpen(false);
            if (mobile) setIsHamburgerOpen(false);
          }}
        >
          <Users className="h-4 w-4" />
          <span>View Users</span>
        </Link>
        <Link
          to="/manage-messages"
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
          onClick={() => {
            setIsDropdownOpen(false);
            if (mobile) setIsHamburgerOpen(false);
          }}
        >
          <Mail className="h-4 w-4" />
          <span>View Messages</span>
        </Link>
        <Link
          to="/add-product"
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
          onClick={() => {
            setIsDropdownOpen(false);
            if (mobile) setIsHamburgerOpen(false);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
        <Link
          to="/manage-products"
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
          onClick={() => {
            setIsDropdownOpen(false);
            if (mobile) setIsHamburgerOpen(false);
          }}
        >
          <Layers className="h-4 w-4" />
          <span>Manage Products</span>
        </Link>
      </>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo className={isMobile ? "scale-90" : ""} />
          </Link>

          {/* MOBILE VIEW */}
          {isMobile ? (
            <div className="flex items-center">
              {/* Cart - Hide for admins */}
              {(!user || !user.isAdmin) && (
                <Link to="/cart" className="relative group mr-2" onClick={() => setIsHamburgerOpen(false)}>
                  <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-cyan-400 transition" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}

              {/* User Dropdown */}
              {user ? (
                <div className="relative mr-2" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-cyan-400 transition"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-lg py-1 z-50">
                      {renderAdminLinks(true)}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsHamburgerOpen(false);
                        }}
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Manage Profile</span>
                      </Link>
                      <Link
                        to="/track-order"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsHamburgerOpen(false);
                        }}
                      >
                        <Package className="h-4 w-4" />
                        <span>{user.isAdmin ? 'Track All Orders' : 'Track Orders'}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                          setIsHamburgerOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-red-400 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-cyan-400 text-sm font-medium mr-2">
                  Login
                </Link>
              )}

              {/* Hamburger */}
              <button
                className="text-gray-300 hover:text-cyan-400 transition"
                onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>
          ) : (
            // DESKTOP VIEW
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-cyan-400 text-sm font-medium">
                Products
              </Link>
              {(!user || !user.isAdmin) && (
                <Link to="/contact-us" className="text-gray-300 hover:text-cyan-400 text-sm font-medium">
                  Contact Us
                </Link>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-cyan-400"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-lg py-1 z-50">
                      {renderAdminLinks()}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Manage Profile</span>
                      </Link>
                      <Link
                        to="/track-order"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-cyan-400"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        <span>{user.isAdmin ? 'Track All Orders' : 'Track Orders'}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-red-400 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-cyan-400 text-sm font-medium">
                  Login
                </Link>
              )}

              {/* Cart - Hide for admins */}
              {(!user || !user.isAdmin) && (
                <Link to="/cart" className="relative group">
                  <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-cyan-400 transition" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              )}
            </div>
          )}

          {/* MOBILE MENU DROPDOWN */}
          {isMobile && isHamburgerOpen && (
            <div className="fixed top-16 right-4 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-lg py-2 px-4 z-50 w-48">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 rounded"
                onClick={() => setIsHamburgerOpen(false)}
              >
                Products
              </Link>
              {(!user || !user.isAdmin) && (
                <Link
                  to="/contact-us"
                  className="block px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-cyan-400 rounded"
                  onClick={() => setIsHamburgerOpen(false)}
                >
                  Contact Us
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
