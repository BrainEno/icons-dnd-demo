import React from 'react';
import { LongPressResult } from '../hooks/useLongPress';

interface DndItemProps {
  text: string;
  editing: boolean;
  draggable: boolean;
  dataIndex: number;
  extraClassName?: string;
  handleDelete: React.MouseEventHandler<HTMLDivElement>;
  handleDrag: React.DragEventHandler<HTMLDivElement>;
  handleDragStart: React.DragEventHandler<HTMLDivElement>;
  handleDragEnd: React.DragEventHandler<HTMLDivElement>;
  handleDragOver: React.DragEventHandler<HTMLDivElement>;
  onLongPress: LongPressResult<HTMLDivElement> | {};
}

const DndItem: React.FC<DndItemProps> = ({
  text,
  editing,
  draggable,
  dataIndex,
  extraClassName,
  handleDelete,
  handleDragStart,
  handleDrag,
  handleDragEnd,
  handleDragOver,
  onLongPress,
}) => {
  return (
    <div
      draggable={draggable}
      className={`${extraClassName} ${editing && 'shake'}`}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      data-index={dataIndex}
      {...onLongPress}>
      <div>{text}</div>
      {editing && (
        <div className='x' onClick={handleDelete}>
          &times;
        </div>
      )}
    </div>
  );
};

export default DndItem;
