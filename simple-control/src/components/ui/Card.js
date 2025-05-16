"use client";

import React from 'react';

/**
 * Card component that can be used throughout the application
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Card component
 */
const Card = ({
  children,
  className = '',
  style = {},
  ...rest
}) => {
  // Base styles
  const baseStyles = {
    backgroundColor: 'var(--card-background, #fff)',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  // Combine all styles
  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <div
      className={className}
      style={combinedStyles}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
