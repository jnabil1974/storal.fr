export default function Logo() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 120" 
      className="h-16 w-auto"
      style={{ backgroundColor: 'white' }}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1A2B4C', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1A2B4C', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <g transform="translate(20, 20)">
        <path 
          d="M 10,40 Q 10,0 50,0 T 90,40 L 75,40 Q 75,20 50,20 T 25,40 Z" 
          fill="#1A2B4C" 
        />
        
        <path 
          d="M 90,45 Q 90,85 50,85 T 10,45 L 25,45 Q 25,65 50,65 T 75,45 Z" 
          fill="#007BFF" 
        />
      </g>

      <text 
        x="130" 
        y="80" 
        fontFamily="Arial, Helvetica, sans-serif" 
        fontWeight="900" 
        fontSize="60" 
        fill="#1A2B4C" 
        letterSpacing="-2"
      >
        STOR
      </text>
      
      <text 
        x="305" 
        y="80" 
        fontFamily="Arial, Helvetica, sans-serif" 
        fontWeight="100" 
        fontSize="60" 
        fill="#1A2B4C" 
        letterSpacing="2"
      >
        AL
      </text>
      
      <text 
        x="135" 
        y="105" 
        fontFamily="Arial, sans-serif" 
        fontSize="12" 
        fill="#007BFF" 
        letterSpacing="3" 
        style={{ textTransform: 'uppercase' }}
      >
        CONFORT & ACCESS
      </text>
    </svg>
  );
}
