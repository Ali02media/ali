
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-16" }) => {
  // Direct link to the image on Google Drive
  const logoUrl = "https://drive.google.com/uc?export=view&id=1T1jN1LZ_l65dvEYlSQEwbiPEdLhwntbp";

  return (
    <img 
      src={logoUrl} 
      alt="AFA Media" 
      className={`${className} object-contain`}
    />
  );
};

export default Logo;
