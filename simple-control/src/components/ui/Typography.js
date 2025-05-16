"use client";

import React from 'react';

/**
 * Typography component that can be used throughout the application
 *
 * @param {Object} props - Component props
 * @param {string} [props.variant='body'] - Typography variant (h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, caption)
 * @param {React.ReactNode} props.children - Typography content
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @returns {JSX.Element} Typography component
 */
const Typography = ({
  variant = 'body1',
  children,
  className = '',
  style = {},
  ...rest
}) => {
  // Variant styles
  const variantStyles = {
    h1: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      lineHeight: 1.2,
      marginBottom: '0.5em',
      color: 'var(--primary-color, #3498db)',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      lineHeight: 1.3,
      marginBottom: '0.5em',
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      lineHeight: 1.4,
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      lineHeight: 1.4,
      marginBottom: '0.5em',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 'bold',
      lineHeight: 1.4,
      marginBottom: '0.5em',
    },
    h6: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      lineHeight: 1.4,
      marginBottom: '0.5em',
    },
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 'medium',
      lineHeight: 1.5,
      marginBottom: '0.25em',
    },
    subtitle2: {
      fontSize: '0.8rem',
      fontWeight: 'medium',
      lineHeight: 1.5,
      marginBottom: '0.25em',
    },
    body1: {
      fontSize: '0.85rem',
      lineHeight: 1.5,
      marginBottom: '0.5em',
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      marginBottom: '0.5em',
    },
    caption: {
      fontSize: '0.65rem',
      lineHeight: 1.5,
      color: 'var(--text-secondary, #666)',
      fontStyle: 'italic',
    },
  };

  // Combine all styles
  const combinedStyles = {
    ...variantStyles[variant],
    ...style,
  };

  // Map variant to HTML element
  const Component = variant.startsWith('h') ? variant :
                    variant.startsWith('subtitle') ? 'h6' :
                    variant === 'caption' ? 'span' : 'p';

  return (
    <Component
      className={className}
      style={combinedStyles}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Typography;
