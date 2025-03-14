import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, actions, className }) => {
  return (
    <motion.div
      className={`bg-white rounded shadow p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
