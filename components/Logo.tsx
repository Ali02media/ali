
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-16" }) => {
  const [imageError, setImageError] = useState(false);

  // User provided link with export=download
  const googleDriveDirectLink = "https://drive.google.com/uc?export=download&id=1T1jN1LZ_l65dvEYlSQEwbiPEdLhwntbp";

  if (!imageError) {
    return (
      <img 
        src={googleDriveDirectLink} 
        alt="AFA Media" 
        className={`${className} object-contain`} 
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to Vector SVG if the image fails to load (e.g. blocked by browser privacy settings)
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="AFA Media Logo"
    >
      {/* Left Bracket (Blue) */}
      <path 
        d="M95 20L30 55V125L95 160V135L55 115V65L95 45V20Z" 
        fill="#3B82F6" 
      />
      
      {/* Right Bracket (Teal) */}
      <path 
        d="M105 20L170 55V125L105 160V135L145 115V65L105 45V20Z" 
        fill="#10B981" 
      />
      
      {/* The Letter 'A' (Blue) */}
      <path 
        d="M100 55L75 115H88L93 100H107L112 115H125L100 55ZM100 75L104 90H96L100 75Z" 
        fill="#3B82F6" 
      />
      
      {/* Text: AFA MEDIA */}
      <text 
        x="100" 
        y="185" 
        textAnchor="middle" 
        fill="#3B82F6" 
        fontFamily="Arial, sans-serif" 
        fontWeight="bold" 
        fontSize="24"
        letterSpacing="1"
      >
        AFA MEDIA
      </text>
    </svg>
  );
};

export default Logo;
