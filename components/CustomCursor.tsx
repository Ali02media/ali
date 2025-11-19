
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use refs for smooth animation of the follower
  const followerPos = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    
    // Animation loop for the lagging follower
    let animationFrameId: number;
    
    const animateFollower = () => {
      if (followerRef.current) {
        // Linear interpolation (LERP) for smooth lag
        followerPos.current.x += (position.x - followerPos.current.x) * 0.15;
        followerPos.current.y += (position.y - followerPos.current.y) * 0.15;
        
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
      }
      animationFrameId = requestAnimationFrame(animateFollower);
    };
    
    animateFollower();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isHovering]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main dot */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-neon-blue rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)` 
        }}
      />
      {/* Lagging ring */}
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-neon-blue rounded-full pointer-events-none z-[9998] transition-opacity duration-300 ${isHovering ? 'opacity-50 bg-neon-blue/10' : 'opacity-30'}`}
      />
    </>
  );
};

export default CustomCursor;
