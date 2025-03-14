import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColumnContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSetLimit: () => void;
  onDelete: () => void;
  x: number;
  y: number;
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({
  isOpen,
  onClose,
  onRename,
  onMoveLeft,
  onMoveRight,
  onMoveUp,
  onMoveDown,
  onSetLimit,
  onDelete,
  x,
  y,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          className="fixed bg-white border border-gray-200 rounded shadow-lg text-sm text-gray-700 z-[999]"
          style={{ top: y, left: x }}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onRename();
              onClose();
            }}
          >
            Rename column
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onMoveLeft();
              onClose();
            }}
          >
            Move column left
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onMoveRight();
              onClose();
            }}
          >
            Move column right
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onMoveUp();
              onClose();
            }}
          >
            Move column up
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onMoveDown();
              onClose();
            }}
          >
            Move column down
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSetLimit();
              onClose();
            }}
          >
            Set column limit
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete column
          </li>
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default ColumnContextMenu;
