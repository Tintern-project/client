import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-[#4B4B4B]/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 pl-5">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-[#F5F5F5] text-3xl font-bold">
                <Image src="/logo2.png" alt="Tintern Logo" width={141} height={161} />
              </span>
            </Link>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Twitter" className="text-[#F5F5F5] hover:text-[#963434] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram" className="text-[#F5F5F5] hover:text-[#963434] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link href="#" aria-label="YouTube" className="text-[#F5F5F5] hover:text-[#963434] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </Link>
              <Link href="#" aria-label="LinkedIn" className="text-[#F5F5F5] hover:text-[#963434] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Use cases</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">UI design</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">UX design</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Wireframing</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Diagramming</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Brainstorming</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Online whiteBoard</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Team collaboration</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Design</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Prototyping</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Development features</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Design systems</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Collaboration features</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Design process</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">FigJam</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Best practices</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Colors</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Color wheel</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Support</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Developers</Link></li>
              <li><Link href="#" className="text-[#F5F5F5]/80 hover:text-[#963434] transition-colors">Resource library</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#4B4B4B]/30 text-center text-[#F5F5F5]/60 text-sm">
          &copy; {new Date().getFullYear()} Tintern. All rights reserved.
        </div>
      </div>
    </footer>
  )
}