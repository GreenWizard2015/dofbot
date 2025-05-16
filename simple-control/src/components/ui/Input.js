"use client";

import React from 'react';

/**
 * Input component that can be used throughout the application
 *
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder=''] - Input placeholder
 * @param {string} [props.value=''] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Input component
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  className = '',
  style = {},
  ...rest
}) => {
  // Base styles
  const baseStyles = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid var(--border-color, #ddd)',
    fontSize: '14px',
    backgroundColor: 'var(--card-background, #fff)',
    color: 'var(--text-color, #333)',
    width: '100%',
    transition: 'border-color 0.2s',
    outline: 'none',
    opacity: disabled ? 0.7 : 1,
  };

  // Combine all styles
  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  // Handle focus effect manually
  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--primary-color, #3498db)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--border-color, #ddd)';
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      style={combinedStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    />
  );
};

export default Input;
