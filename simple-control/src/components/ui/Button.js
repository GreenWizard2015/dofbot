"use client";

import React from 'react';

/**
 * Button component that can be used throughout the application
 *
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, danger)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
  ...rest
}) => {
  // Base styles
  const baseStyles = {
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    opacity: disabled ? 0.7 : 1,
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary-color, #3498db)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--primary-hover, #2980b9)',
      },
    },
    secondary: {
      backgroundColor: 'var(--secondary-color, #2ecc71)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--secondary-hover, #27ae60)',
      },
    },
    danger: {
      backgroundColor: 'var(--danger-color, #e74c3c)',
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--danger-hover, #c0392b)',
      },
    },
  };

  // Size styles
  const sizeStyles = {
    small: {
      padding: '4px 8px',
      fontSize: '12px',
    },
    medium: {
      padding: '6px 12px',
      fontSize: '14px',
    },
    large: {
      padding: '8px 16px',
      fontSize: '16px',
    },
  };

  // Combine all styles
  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  // Handle hover effect manually since we can't use CSS pseudo-classes in inline styles
  const handleMouseEnter = (e) => {
    if (!disabled) {
      if (variant === 'primary') {
        e.target.style.backgroundColor = 'var(--primary-hover, #2980b9)';
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = 'var(--secondary-hover, #27ae60)';
      } else if (variant === 'danger') {
        e.target.style.backgroundColor = 'var(--danger-hover, #c0392b)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      if (variant === 'primary') {
        e.target.style.backgroundColor = 'var(--primary-color, #3498db)';
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = 'var(--secondary-color, #2ecc71)';
      } else if (variant === 'danger') {
        e.target.style.backgroundColor = 'var(--danger-color, #e74c3c)';
      }
    }
  };

  return (
    <button
      style={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
