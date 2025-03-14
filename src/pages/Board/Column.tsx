import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FiMoreVertical, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ColumnContextMenu from './ColumnContextMenu';
import IssueCard, { IssueCardData } from './IssueCard';

export interface ColumnPropsData {
  id: string;
  title: string;
  issues: IssueCardData[];
  order: number;
  collapsed?: boolean;
  wipLimit?: number | null;
}

interface ColumnProps {
  column: ColumnPropsData;
  dragHandleProps?: any;
  onCreateIssue?: (columnId: string) => void;
  onContextMenuAction?: (columnId: string, action: string) => void;
  onToggleCollapse?: (columnId: string) => void;
  onIssueDoubleClick?: (issueId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  dragHandleProps,
  onCreateIssue,
  onContextMenuAction,
  onToggleCollapse,
  onIssueDoubleClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ x: rect.left, y: rect.bottom });
    setMenuOpen(!menuOpen);
  };

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse(column.id);
    }
  };

  const columnWidth = column.collapsed ? 'w-[36px]' : 'w-52';

  return (
    <div
      className={`
        ${columnWidth} bg-gray-50 rounded p-2 mr-2 flex flex-col
        transition-all duration-200
      `}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-2" {...dragHandleProps}>
        <div className="flex items-center">
          {!column.collapsed && (
            <h3 className="text-sm font-semibold text-gray-700 mr-2">
              {column.title}
              {column.wipLimit != null && (
                <span className="ml-1 text-xs text-gray-500">
                  (WIP={column.wipLimit})
                </span>
              )}
            </h3>
          )}
          {column.collapsed ? (
            <FiChevronUp onClick={handleToggle} className="cursor-pointer" />
          ) : (
            <FiChevronDown onClick={handleToggle} className="cursor-pointer" />
          )}
        </div>

        {!column.collapsed && onContextMenuAction && (
          <button
            onClick={handleMenuClick}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiMoreVertical />
          </button>
        )}
        {onContextMenuAction && (
          <ColumnContextMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            x={menuPos.x}
            y={menuPos.y}
            onRename={() => onContextMenuAction(column.id, 'rename')}
            onMoveLeft={() => onContextMenuAction(column.id, 'moveLeft')}
            onMoveRight={() => onContextMenuAction(column.id, 'moveRight')}
            onMoveUp={() => onContextMenuAction(column.id, 'moveUp')}
            onMoveDown={() => onContextMenuAction(column.id, 'moveDown')}
            onSetLimit={() => onContextMenuAction(column.id, 'setLimit')}
            onDelete={() => onContextMenuAction(column.id, 'delete')}
          />
        )}
      </div>

      {/* If collapsed, we don't show Droppable */}
      {column.collapsed ? (
        <div className="flex-1" />
      ) : (
        <Droppable droppableId={column.id} type="TASK">
          {(provided, droppableSnapshot) => {
            console.log(
              '[Droppable Render]',
              `Column ID = ${column.id}`,
              'droppableSnapshot.isDraggingOver =',
              droppableSnapshot.isDraggingOver
            );

            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 overflow-y-auto min-h-[50px]"
              >
                {column.issues.map((issue, idx) => (
                  <Draggable key={issue.id} draggableId={issue.id} index={idx}>
                    {(dragProvided, dragSnapshot) => {
                      console.log('[Draggable Render]', {
                        issueId: issue.id,
                        isDragging: dragSnapshot.isDragging,
                      });
                      return (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          style={dragProvided.draggableProps.style}
                        >
                          <IssueCard
                            issue={issue}
                            isDragging={dragSnapshot.isDragging}
                            onDoubleClick={() => onIssueDoubleClick?.(issue.id)}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      )}

      {/* "Create issue" button */}
      {!column.collapsed && onCreateIssue && (
        <button
          className="mt-2 text-sm text-gray-600 hover:underline"
          onClick={() => onCreateIssue(column.id)}
        >
          + Create issue
        </button>
      )}
    </div>
  );
};

export default Column;
