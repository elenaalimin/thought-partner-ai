export function BrainIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Brain shape - light blue fill, divided by vertical line, with stem */}
      {/* Main brain shape (both hemispheres together) */}
      <path
        d="M12 4C9.5 4 7.5 5.5 7 7.5C6.5 7.2 6 7 5.5 7C4.1 7 3 8.1 3 9.5C3 10.2 3.3 10.8 3.7 11.2C3.3 11.6 3 12.2 3 13C3 14.4 4.1 15.5 5.5 15.5C6 15.5 6.5 15.3 7 15C7.5 16.5 9 17.5 10.5 17.5C11.2 17.5 11.8 17.2 12.2 16.8C12.6 17.2 13.2 17.5 13.9 17.5C15.4 17.5 16.9 16.5 17.4 15C17.9 15.3 18.4 15.5 18.9 15.5C20.3 15.5 21.4 14.4 21.4 13C21.4 12.2 21.1 11.6 20.7 11.2C21.1 10.8 21.4 10.2 21.4 9.5C21.4 8.1 20.3 7 18.9 7C18.4 7 17.9 7.2 17.4 7.5C16.9 5.5 14.9 4 12.4 4H12Z"
        fill="#7DD3FC"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Central vertical dividing line extending down as stem */}
      <line x1="12" y1="4" x2="12" y2="20" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Curved lines inside left hemisphere */}
      <path d="M7 9.5C7.3 9.2 7.7 9.2 8 9.5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M7 11C7.3 10.7 7.7 10.7 8 11" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M7 12.5C7.3 12.2 7.7 12.2 8 12.5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Curved lines inside right hemisphere */}
      <path d="M17 9.5C16.7 9.2 16.3 9.2 16 9.5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M17 11C16.7 10.7 16.3 10.7 16 11" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M17 12.5C16.7 12.2 16.3 12.2 16 12.5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
