'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1E1E1E]/95 backdrop-blur-sm py-3 shadow-md'
          : 'bg-transparent py-5'
      }`}
    >
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
            className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300"
          >
            {/* Home Icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9m0 0l9 9m-9-9v18"
              />
            </svg>
            Home
          </Link>

          {/* Jobs */}
          <Link
            href="/jobs"
            className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300"
          >
            {/* Briefcase Icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7V5a2 2 0 00-2-2h-4a2 
                2 0 00-2 2v2M3 13h18M5 7h14a2 
                2 0 012 2v10a2 2 0 01-2 2H5a2 
                2 0 01-2-2V9a2 2 0 012-2z"
              />
            </svg>
            Jobs
          </Link>

          {/* Sign Up */}
          <Link
            href="/signup"
            className="inline-flex items-center border border-[#F5F5F5] text-[#F5F5F5] px-3 py-2 rounded-md hover:bg-[#4B4B4B] transition-colors duration-300"
          >
            {/* User Icon */}
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A3 
                3 0 007.935 19h8.13a3 3 0 
                002.814-1.196A9 9 0 006.414 
                12h11.172A9 9 0 005.12 
                17.804zM15 7a3 3 0 
                11-6 0 3 3 0 
                016 0z"
              />
            </svg>
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#F5F5F5]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
