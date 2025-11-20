
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-16" }) => {
  // Updated with your ImageKit URL
  const logoUrl = "https://ik.imagekit.io/hxkb52bem/afa%20media%20logo%20no%20BG.png";

  return (
    <img 
      src={logoUrl} 
      alt="AFA Media" 
      className={`${className} object-contain`}
    />
  );
};

export default Logo;
