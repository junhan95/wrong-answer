import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";

// Draggable wrapper for file items
export function DraggableFileItem({ 
  fileId, 
  isDragging,
  isMultiSelected,
  isDndActiveRef,
  lastDragEndTimeRef,
  children 
}: { 
  fileId: string; 
  isDragging: boolean;
  isMultiSelected: boolean;
  isDndActiveRef: React.MutableRefObject<boolean>;
  lastDragEndTimeRef: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-file-${fileId}`,
  });
  
  // Ghost styling for dragged items - NO pointer-events:none so drop targets still work
  const ghostStyles: React.CSSProperties = isDragging ? {
    opacity: 0.25,
    border: '2px dashed hsl(var(--primary) / 0.5)',
    borderRadius: '0.5rem',
  } : {};
  
  // Don't apply transform to original - DragOverlay handles visual drag
  const style: React.CSSProperties = ghostStyles;
  
  // Prevent click from clearing selection when multi-selected or during/after drag
  const handleClick = (e: React.MouseEvent) => {
    const timeSinceLastDrag = Date.now() - lastDragEndTimeRef.current;
    // Use refs directly to get latest values
    if (isMultiSelected || isDndActiveRef.current || timeSinceLastDrag < 500) {
      e.stopPropagation();
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      onClickCapture={handleClick}
    >
      {children}
    </div>
  );
}

// Droppable wrapper for folder items
export function DroppableFolderItem({ 
  folderId, 
  isOver,
  children 
}: { 
  folderId: string; 
  isOver: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: `droppable-folder-${folderId}`,
  });
  
  return (
    <div 
      ref={setNodeRef} 
      className={isOver ? "ring-2 ring-primary rounded-lg" : ""}
    >
      {children}
    </div>
  );
}

// Draggable wrapper for folder items
export function DraggableFolderItem({ 
  folderId, 
  isDragging,
  isMultiSelected,
  isDndActiveRef,
  lastDragEndTimeRef,
  children 
}: { 
  folderId: string; 
  isDragging: boolean;
  isMultiSelected: boolean;
  isDndActiveRef: React.MutableRefObject<boolean>;
  lastDragEndTimeRef: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-folder-${folderId}`,
  });
  
  // Ghost styling - NO pointer-events:none so drop targets still work
  const ghostStyles: React.CSSProperties = isDragging ? {
    opacity: 0.25,
    border: '2px dashed hsl(var(--primary) / 0.5)',
    borderRadius: '0.5rem',
  } : {};
  
  // Don't apply transform to original - DragOverlay handles visual drag
  const style: React.CSSProperties = ghostStyles;
  
  // Prevent click from clearing selection when multi-selected or during/after drag
  const handleClick = (e: React.MouseEvent) => {
    const timeSinceLastDrag = Date.now() - lastDragEndTimeRef.current;
    if (isMultiSelected || isDndActiveRef.current || timeSinceLastDrag < 500) {
      e.stopPropagation();
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      onClickCapture={handleClick}
    >
      {children}
    </div>
  );
}

// Draggable wrapper for conversation items
export function DraggableConversationItem({ 
  conversationId, 
  isDragging,
  isMultiSelected,
  isDndActiveRef,
  lastDragEndTimeRef,
  children 
}: { 
  conversationId: string; 
  isDragging: boolean;
  isMultiSelected: boolean;
  isDndActiveRef: React.MutableRefObject<boolean>;
  lastDragEndTimeRef: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-conversation-${conversationId}`,
  });
  
  // Ghost styling - NO pointer-events:none so drop targets still work
  const ghostStyles: React.CSSProperties = isDragging ? {
    opacity: 0.25,
    border: '2px dashed hsl(var(--primary) / 0.5)',
    borderRadius: '0.5rem',
  } : {};
  
  // Don't apply transform to original - DragOverlay handles visual drag
  const style: React.CSSProperties = ghostStyles;
  
  // Prevent click from clearing selection when multi-selected or during/after drag
  const handleClick = (e: React.MouseEvent) => {
    const timeSinceLastDrag = Date.now() - lastDragEndTimeRef.current;
    if (isMultiSelected || isDndActiveRef.current || timeSinceLastDrag < 500) {
      e.stopPropagation();
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      onClickCapture={handleClick}
    >
      {children}
    </div>
  );
}
