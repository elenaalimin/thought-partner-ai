export function BrainIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left hemisphere - black fill with black outline */}
      <path
        d="M12 3C9 3 7 5 7 7.5C7 8.5 7.5 9.3 8.2 9.8C7.8 10.3 7.5 11 7.5 11.8C7.5 13.5 8.8 14.8 10.5 14.8C11.2 14.8 11.8 14.5 12.2 14C12.6 14.5 13.2 14.8 13.9 14.8C15.6 14.8 16.9 13.5 16.9 11.8C16.9 11 16.6 10.3 16.2 9.8C16.9 9.3 17.4 8.5 17.4 7.5C17.4 5 15.4 3 12.4 3H12Z"
        fill="black"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Left hemisphere thick curved lines (gyri) */}
      <path d="M8 9C8.3 8.7 8.7 8.7 9 9" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 10.5C8.3 10.2 8.7 10.2 9 10.5" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 12C8.3 11.7 8.7 11.7 9 12" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Right hemisphere - light blue fill with black outline */}
      <path
        d="M12 3C15 3 17 5 17 7.5C17 8.5 16.5 9.3 15.8 9.8C16.2 10.3 16.5 11 16.5 11.8C16.5 13.5 15.2 14.8 13.5 14.8C12.8 14.8 12.2 14.5 11.8 14C11.4 14.5 10.8 14.8 10.1 14.8C8.4 14.8 7.1 13.5 7.1 11.8C7.1 11 7.4 10.3 7.8 9.8C7.1 9.3 6.6 8.5 6.6 7.5C6.6 5 8.6 3 11.6 3H12Z"
        fill="#7DD3FC"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Right hemisphere thick curved lines (gyri) */}
      <path d="M16 9C15.7 8.7 15.3 8.7 15 9" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 10.5C15.7 10.2 15.3 10.2 15 10.5" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M16 12C15.7 11.7 15.3 11.7 15 12" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Central vertical dividing line */}
      <line x1="12" y1="3" x2="12" y2="21" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
