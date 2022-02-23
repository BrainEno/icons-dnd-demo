import React, { useState } from 'react';

interface ItemProps {
  text: string;
  preparing: boolean;
  handleDelete: React.MouseEventHandler<HTMLDivElement>;
  handleLongPress: () => void;
}

export const Item: React.FC<ItemProps> = ({
  text,
  preparing,
  handleDelete,
  handleLongPress,
}) => {
  return (
    <div className={`item ${preparing && 'shake'}`} onClick={handleLongPress}>
      <div>{text}</div>
      {preparing && (
        <div className='x' onClick={handleDelete}>
          &times;
        </div>
      )}
    </div>
  );
};
