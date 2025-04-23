"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/auth-context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [isJobsHovered, setIsJobsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsJobsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsJobsHovered(false);
    }, 200); // .5 second delay for the dropdown 
  };
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1E1E1E]/95 backdrop-blur-sm py-3 shadow-md"
          : "bg-transparent py-5"
      }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Tintern Logo"
            width={333}
            height={103}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4">
          {/* Home */}
          <Link
            href="/"
            className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9m0 0l9 9m-9-9v18"
              />
            </svg>
            Home
          </Link>

           {/* Jobs Dropdown */}
           {user ? (
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
                {/* Jobs icon */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3 13h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                </svg>
                Jobs
              </button>
              
              <div className={`absolute top-full left-0 ${isJobsHovered ? 'block' : 'hidden'} bg-[#1E1E1E]/95 backdrop-blur-sm mt-2 py-2 rounded-md shadow-lg min-w-[220px] border border-[#F5F5F5] transition-opacity duration-200`}>
                <Link
                  href="/jobs"
                  className="flex items-center px-4 py-2 hover:bg-[#4B4B4B] transition-colors duration-300 group">
                  <span className="ml-2 text-[#F5F5F5] group-hover:text-white transition-colors">
                    {/*the all jobs icon */}
                    <svg
                      className="w-5 h-5 mr-2 align-middle"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F5F5F5"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M15.75 18l-3-9m0 0l-3 9m3-9v12"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 10.5h.008v.008H6V10.5zm3 0h.008v.008H9V10.5zm3 0h.008v.008H12V10.5z"
                      />
                    </svg>
                    All Jobs
                  </span>
                </Link>
                <Link
                  href="/jobs/savedjobs"
                  className="flex items-center px-4 py-2 hover:bg-[#4B4B4B] transition-colors duration-300 group">
                  {/* Saved Jobs icon */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5F5F5"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h8.25A2.25 2.25 0 0016.5 18v-2.25m3.75 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zM12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                  <span className="ml-2 text-[#F5F5F5] group-hover:text-white transition-colors">
                    Saved Jobs
                  </span>
                </Link>
                <Link
                  href="/jobs/ATS-score"
                  className="flex items-center px-4 py-2 hover:bg-[#4B4B4B] transition-colors duration-300 group">
                  {/* ATS History icon */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F5F5F5"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                  <span className="ml-2 text-[#F5F5F5] group-hover:text-white transition-colors">
                    ATS History
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/jobs"
              className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
              {/* Jobs icon */}
              <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3 13h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                </svg>
              Jobs
            </Link>
          )}

          {/* Profile/Login */}
          {user ? (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A3 3 0 007.935 19h8.13a3 3 0 002.814-1.196A9 9 0 006.414 12h11.172A9 9 0 005.12 17.804zM15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F5F5F5]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1E1E1E] px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B]"
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {user ? (
              <div className="flex flex-col">
                <button
                  onClick={() => setJobsMenuOpen(!jobsMenuOpen)}
                  className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B] text-left flex items-center">
                  Jobs
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      jobsMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {jobsMenuOpen && (
                  <div className="ml-4 space-y-2">
                    <Link
                      href="/jobs"
                      className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B] block"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJobsMenuOpen(false);
                      }}>
                      All Jobs
                    </Link>
                    <Link
                      href="/jobs/savedjobs"
                      className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B] block"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJobsMenuOpen(false);
                      }}>
                      Saved Jobs
                    </Link>
                    <Link
                      href="/ats-history"
                      className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B] block"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJobsMenuOpen(false);
                      }}>
                      ATS History
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/jobs"
                className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B]"
                onClick={() => setMobileMenuOpen(false)}>
                Jobs
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B]"
                  onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B] text-left">
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#4B4B4B]"
                onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}