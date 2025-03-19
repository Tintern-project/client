export default function Logo() {
    return (
      <div className="logo">
        <div className="logo-letter t-letter">
          <span>T</span>
          <div className="t-accent">
            <svg viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 0C6 0 9 3 9 7C9 9 7 11 4 11C1 11 0 8 0 6C0 4 1 3 3 3C4 3 5 4 5 5"
                stroke="#FF6868"
                strokeWidth="1"
                fill="#FF6868"
              />
            </svg>
          </div>
        </div>
        <div className="logo-letter i-letter">
          <span>I</span>
          <div className="i-accent"></div>
        </div>
      </div>
    )
  }
  
  