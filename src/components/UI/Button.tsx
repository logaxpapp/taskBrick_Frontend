import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { IconType } from 'react-icons/lib';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'| 'warning' | 'success' | 'custom' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xs';

interface ButtonProps extends HTMLMotionProps<'button'> { // ✅ Extend Framer Motion button props
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconType;
  rightIcon?: IconType;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  custom : 'bg-white text-purple-600 font-bold hover:bg-purple-700',
  link: 'bg-purple-600 text-white  underline hover:bg-purple-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'text-md px-4 py-2',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  children,
  className = '',
  ...props
}) => {
  const classes = `
    inline-flex items-center justify-center 
    rounded transition-colors 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <motion.button
      {...props}
      className={classes}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <span className="animate-spin border-2 border-white border-r-transparent rounded-full w-4 h-4 mr-2" />
      ) : LeftIcon ? (
        <LeftIcon className="mr-2" />
      ) : null}

      {children}

      {RightIcon && !isLoading && <RightIcon className="ml-2" />}
    </motion.button>
  );
};

export default Button;
