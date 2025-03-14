import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from '@hello-pangea/dnd';
import { FiPlus } from 'react-icons/fi';
import { useAppSelector } from '../../app/hooks/redux';

// RTK Query
import { useGetBoardQuery } from '../../api/board/boardApi';
import {
  useListBoardColumnsQuery,
  useCreateBoardColumnMutation,
  useUpdateBoardColumnMutation,
  useDeleteBoardColumnMutation,
} from '../../api/boardColumn/boardColumnApi';
import {
  useListIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
} from '../../api/issue/issueApi';
import { useListIssueTypesQuery } from '../../api/issueType/issueTypeApi';

// Components
import Column from './Column';
import CreateIssueModal from './CreateIssueModal';
import ManageIssueTypesModal from './ManageIssueTypesModal';
import EditIssueModal from './EditIssueModal';
import RenameColumnModal from './RenameColumnModal';
import CreateColumnModal from './CreateColumnModal'; // <== NEW

// Toast manager
import { useToastManager } from '../../components/UI/Toast/useToastManager';
import Toast from '../../components/UI/Toast/Toast';

interface BoardPageProps {
  projectId: string | undefined;
}

const BoardPage: React.FC<BoardPageProps> = ({ projectId }) => {
  const { boardId } = useParams<{ boardId?: string }>();
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  const navigate = useNavigate();

  // ====== Toast Manager ======
  const { toasts, addToast, removeToast } = useToastManager();

  // ===== Queries =====
  const { data: board, isLoading: isBoardLoading, isError: isBoardError } =
    useGetBoardQuery(boardId!, { skip: !boardId });

  const {
    data: columns,
    refetch: refetchColumns,
    isLoading: isColsLoading,
  } = useListBoardColumnsQuery({ boardId }, { skip: !boardId });

  const {
    data: issues,
    refetch: refetchIssues,
    isLoading: isIssuesLoading,
  } = useListIssuesQuery({ projectId }, { skip: !projectId });

  const { data: issueTypes } = useListIssueTypesQuery(selectedOrgId || '', {
    skip: false,
  });

  // ===== Mutations =====
  const [createBoardColumn] = useCreateBoardColumnMutation();
  const [updateBoardColumn] = useUpdateBoardColumnMutation();
  const [deleteBoardColumn] = useDeleteBoardColumnMutation();

  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();

  // ===== Local UI State =====
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [createColId, setCreateColId] = useState<string | null>(null);
  const [createIssueErr, setCreateIssueErr] = useState('');

  const [isEditIssueOpen, setIsEditIssueOpen] = useState(false);
  const [editIssueId, setEditIssueId] = useState<string | null>(null);

  const [dragErr, setDragErr] = useState('');
  const [manageTypesOpen, setManageTypesOpen] = useState(false);

  // For renaming columns via a modal
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameColId, setRenameColId] = useState<string>('');
  const [renameColName, setRenameColName] = useState<string>('');

  // For creating columns via a modal
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

  // Collapsed columns
  const [collapsedCols, setCollapsedCols] = useState<{ [colId: string]: boolean }>({});

  // ===== Combine columns + issues for display =====
  const combinedColumns = useMemo(() => {
    if (!columns || !issues) return [];

    // Sort columns by order ascending
    const sortedCols = [...(columns || [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    return sortedCols.map((col) => {
      // filter issues that belong to this column
      const colIssues = (issues || [])
        .filter((iss) => iss.boardColumnId === col._id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      return {
        id: col._id,
        title: col.name ?? '',
        order: col.order ?? 0,
        collapsed: collapsedCols[col._id] ?? false,
        wipLimit: col.wipLimit ?? null,
        issues: colIssues.map((iss) => {
          let typeName = '';
          if (iss.issueTypeId && typeof iss.issueTypeId === 'object') {
            typeName = (iss.issueTypeId as { name: string }).name;
          } else if (typeof iss.issueTypeId === 'string') {
            typeName = iss.issueTypeId;
          }
          return {
            id: iss._id,
            title: iss.title,
            type: typeName,
          };
        }),
      };
    });
  }, [columns, issues, collapsedCols]);

  // ===== Early returns =====
  if (isBoardLoading || isColsLoading || isIssuesLoading) {
    return <div>Loading board data...</div>;
  }
  if (isBoardError || !boardId) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error loading board, or no boardId param.</p>
      </div>
    );
  }
  if (!board) {
    return (
      <div className="p-4">
        <p>No board found with ID: {boardId}</p>
      </div>
    );
  }

  // ===== Handlers =====

  // Instead of prompt, open a modal for creating a column
  const handleAddColumn = () => {
    setIsCreateColumnOpen(true);
  };

  // After user saves in "CreateColumnModal"
  const handleCreateColumn = async (colName: string) => {
    if (!boardId || !columns) return;

    const maxOrder = Math.max(0, ...columns.map((c) => c.order ?? 0));
    try {
      await createBoardColumn({
        boardId,
        name: colName.trim(),
        order: maxOrder + 1,
      }).unwrap();
      refetchColumns();
      addToast('Column created successfully!', 'success');
    } catch (err: any) {
      addToast(err.data?.error || err.message, 'error');
    } finally {
      setIsCreateColumnOpen(false);
    }
  };

  // This gets called by the Column context menu
  const handleColumnContextAction = async (columnId: string, action: string) => {
    if (!columns) return;
    const col = columns.find((c) => c._id === columnId);
    if (!col) return;

    switch (action) {
      case 'rename': {
        setRenameColId(col._id);
        setRenameColName(col.name || '');
        setIsRenameModalOpen(true);
        break;
      }
      case 'delete': {
        if (window.confirm(`Delete column "${col.name}"?`)) {
          try {
            await deleteBoardColumn(columnId).unwrap();
            refetchColumns();
            addToast(`Deleted column '${col.name}'`, 'success');
          } catch (err: any) {
            addToast(err.data?.error || err.message, 'error');
          }
        }
        break;
      }
      case 'moveLeft':
      case 'moveUp':
        await moveColumn(columnId, -1);
        break;
      case 'moveRight':
      case 'moveDown':
        await moveColumn(columnId, +1);
        break;
      case 'setLimit': {
        // If you want a WIP limit
        break;
      }
      default:
        break;
    }
  };

  // Actually do the rename after user hits "Save" in RenameColumnModal
  const handleRenameColumn = async (colId: string, newName: string) => {
    if (!colId || !newName.trim()) return;
    try {
      await updateBoardColumn({
        id: colId,
        updates: { name: newName.trim() },
      }).unwrap();
      refetchColumns();
      addToast(`Renamed column to "${newName}"`, 'success');
    } catch (err: any) {
      addToast(err.data?.error || err.message, 'error');
    } finally {
      setIsRenameModalOpen(false);
    }
  };

  // Move columns left/right
  const moveColumn = async (columnId: string, direction: number) => {
    if (!columns) return;
    const sortedCols = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sortedCols.findIndex((c) => c._id === columnId);
    if (idx === -1) return;

    const newIndex = idx + direction;
    if (newIndex < 0 || newIndex >= sortedCols.length) return;

    const colA = sortedCols[idx];
    const colB = sortedCols[newIndex];
    const tempOrder = colA.order ?? 0;
    colA.order = colB.order ?? 0;
    colB.order = tempOrder;

    try {
      await updateBoardColumn({ id: colA._id, updates: { order: colA.order } }).unwrap();
      await updateBoardColumn({ id: colB._id, updates: { order: colB.order } }).unwrap();
      refetchColumns();
      addToast('Columns reordered', 'info');
    } catch (err: any) {
      addToast(err.data?.error || err.message, 'error');
    }
  };

  const handleToggleCollapse = (colId: string) => {
    setCollapsedCols((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  // Create issue
  const handleOpenCreateIssue = (colId: string) => {
    setCreateColId(colId);
    setIsCreateIssueOpen(true);
  };

  const handleCreateIssueFn = async (title: string, issueTypeId: string) => {
    if (!projectId || !createColId) return;
    try {
      const colIssues = issues?.filter((i) => i.boardColumnId === createColId) || [];
      const maxOrder = Math.max(0, ...colIssues.map((i) => i.order ?? 0));

      await createIssue({
        projectId,
        boardColumnId: createColId,
        title,
        issueTypeId,
        order: maxOrder + 1,
        status: getStatusForColumn(createColId),
      }).unwrap();

      refetchIssues();
      addToast('Issue created!', 'success');
    } catch (err: any) {
      addToast(err.data?.error || err.message, 'error');
      setCreateIssueErr(err.data?.error || err.message);
    }
  };

  const getStatusForColumn = (colId: string) => {
    const col = columns?.find((c) => c._id === colId);
    if (!col) return 'TO_DO';
    const lowerName = (col.name ?? '').toLowerCase();
    if (lowerName.includes('progress')) return 'IN_PROGRESS';
    if (lowerName.includes('done')) return 'DONE';
    if (lowerName.includes('review')) return 'REVIEW';
    return 'TO_DO';
  };

  const handleEditIssue = (issueId: string) => {
    navigate(`/dashboard/issues/${issueId}`);
  };

  const handleUpdateIssue = async (
    id: string,
    updates: Partial<{ title: string; description: string; priority: string }>
  ) => {
    try {
      await updateIssue({ id, updates }).unwrap();
      refetchIssues();
      addToast('Issue updated', 'success');
    } catch (err: any) {
      addToast(err.data?.error || err.message, 'error');
    }
  };

  // Drag & Drop
  const onDragEnd = async (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (type === 'COLUMN') {
      // reorder columns
      if (!columns) return;
      const { index: startIndex } = source;
      const { index: endIndex } = destination;
      if (startIndex === endIndex) return;

      const sortedCols = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const colA = sortedCols[startIndex];
      sortedCols.splice(startIndex, 1);
      sortedCols.splice(endIndex, 0, colA);

      try {
        for (let i = 0; i < sortedCols.length; i++) {
          await updateBoardColumn({
            id: sortedCols[i]._id,
            updates: { order: i },
          }).unwrap();
        }
        refetchColumns();
        addToast('Columns reordered', 'info');
      } catch (err: any) {
        setDragErr(err.data?.error || err.message);
        addToast(err.data?.error || err.message, 'error');
      }
      return;
    }

    if (type === 'TASK') {
      if (!issues || !columns) return;
      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;
      const sourceIndex = source.index;
      const destIndex = destination.index;

      if (sourceColId === destColId && sourceIndex === destIndex) return;

      // get issues in source
      const sourceColIssues = issues
        .filter((iss) => iss.boardColumnId === sourceColId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((iss) => ({ ...iss })); // make them mutable

      const draggedIssue = sourceColIssues[sourceIndex];
      if (!draggedIssue) return;

      if (sourceColId === destColId) {
        // reorder in same col
        const reordered = [...sourceColIssues];
        reordered.splice(sourceIndex, 1);
        reordered.splice(destIndex, 0, draggedIssue);

        try {
          for (let i = 0; i < reordered.length; i++) {
            await updateIssue({ id: reordered[i]._id, updates: { order: i } }).unwrap();
          }
          refetchIssues();
          addToast('Issue reordered in same column', 'info');
        } catch (err: any) {
          setDragErr(err.data?.error || err.message);
          addToast(err.data?.error || err.message, 'error');
        }
      } else {
        // reorder across columns
        const destColIssues = issues
          .filter((iss) => iss.boardColumnId === destColId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((iss) => ({ ...iss }));

        sourceColIssues.splice(sourceIndex, 1);
        for (let i = 0; i < sourceColIssues.length; i++) {
          sourceColIssues[i].order = i;
        }

        destColIssues.splice(destIndex, 0, { ...draggedIssue });
        for (let i = 0; i < destColIssues.length; i++) {
          destColIssues[i].order = i;
        }

        try {
          // update source col
          for (const iss of sourceColIssues) {
            await updateIssue({ id: iss._id, updates: { order: iss.order } }).unwrap();
          }
          // update dest col
          for (const iss of destColIssues) {
            if (iss._id === draggedIssue._id) {
              const newStatus = getStatusForColumn(destColId);
              await updateIssue({
                id: iss._id,
                updates: { boardColumnId: destColId, order: iss.order, status: newStatus },
              }).unwrap();
            } else {
              await updateIssue({ id: iss._id, updates: { order: iss.order } }).unwrap();
            }
          }
          refetchIssues();
          addToast('Issue moved to new column', 'info');
        } catch (err: any) {
          setDragErr(err.data?.error || err.message);
          addToast(err.data?.error || err.message, 'error');
        }
      }
    }
  };

  return (
    <div className="p-2">
      {/* Board Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 mb-4 p-2 rounded">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{board.name}</h2>
          <p className="text-sm text-gray-600">
            Board Type: <span className="font-medium">{board.type || 'KANBAN'}</span>
          </p>
        </div>

        <div className="flex gap-3 mt-2 md:mt-0">
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setManageTypesOpen(true)}
          >
            Manage Issue Types
          </button>
        </div>
      </div>

      {dragErr && (
        <p className="text-red-600 text-sm mb-2" onClick={() => setDragErr('')}>
          {dragErr} (click to dismiss)
        </p>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div className="flex space-x-2" ref={provided.innerRef} {...provided.droppableProps}>
              {combinedColumns.map((col, index) => (
                <Draggable key={col.id} draggableId={col.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      style={dragProvided.draggableProps.style}
                    >
                      <Column
                        column={col}
                        dragHandleProps={dragProvided.dragHandleProps}
                        onContextMenuAction={handleColumnContextAction}
                        onCreateIssue={handleOpenCreateIssue}
                        onToggleCollapse={handleToggleCollapse}
                        onIssueDoubleClick={handleEditIssue}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add Column */}
              <button
                className="w-20 h-16 border border-gray-300 rounded 
                           flex items-center justify-center text-gray-400 
                           hover:text-gray-600 hover:bg-gray-50"
                onClick={handleAddColumn}
              >
                <FiPlus />
              </button>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateIssueOpen}
        onClose={() => setIsCreateIssueOpen(false)}
        issueTypes={issueTypes || []}
        columnId={createColId}
        onCreate={handleCreateIssueFn}
      />
      {createIssueErr && <p className="text-red-500 text-sm">{createIssueErr}</p>}

      {/* Edit Issue Modal */}
      <EditIssueModal
        isOpen={isEditIssueOpen}
        issueId={editIssueId}
        onClose={() => setIsEditIssueOpen(false)}
        onUpdate={handleUpdateIssue}
      />

      {/* Manage Issue Types Modal */}
      <ManageIssueTypesModal isOpen={manageTypesOpen} onClose={() => setManageTypesOpen(false)} />

      {/* Rename Column Modal */}
      <RenameColumnModal
        isOpen={isRenameModalOpen}
        columnId={renameColId}
        initialName={renameColName}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={handleRenameColumn}
      />

      {/* Create Column Modal */}
      <CreateColumnModal
        isOpen={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        onCreateColumn={handleCreateColumn}
      />

      {/* Toast container */}
      <div className="fixed bottom-5 right-5 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
