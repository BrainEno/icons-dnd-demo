import React, { useState, useRef, useCallback } from 'react';
import { hot } from 'react-hot-loader';
import { Item } from './components/Item';
import './styles/app.css';
import { useLongPress } from './hooks/useLongPress';
import useClickoutside from './hooks/useClickoutside';

const initialArr: number[] = [];

for (let i = 0; i < 66; i++) {
  initialArr.push(i + 1);
}

function App() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [items, setItems] = useState(initialArr);
  const [editing, setEditing] = useState(false);
  const conRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const handleDelete =
    (num: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setItems(() => items.filter((n) => n !== num));
      setEditing(false);
    };

  const finishEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  const handleLongPress = () => {
    setEditing(true);
  };

  const onLongPress = useLongPress(handleLongPress, 400);

  useClickoutside(conRef, () => setEditing(false));

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    from: number
  ) => {
    console.log('drag start');
    dragItem.current = from;
    dragNode.current = e.currentTarget;

    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    console.log('ending drag');
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, to: number) => {
    //防止出现残影
    e.preventDefault();
    console.log('drag over');
    //如果是同一个元素，则不处理
    if (dragItem.current === to) {
      return;
    }

    const currnetItem = dragItem.current;
    if (e.currentTarget !== dragNode.current) {
      console.log('Target is not same as dragNode');
      setItems((prev: number[]) => {
        let newItems = JSON.parse(JSON.stringify(prev));
        let currentIndex = newItems.indexOf(currnetItem);
        let toInd = newItems.indexOf(to);
        newItems.splice(currentIndex, 1);
        newItems.splice(toInd, 0, currnetItem);

        dragNode.current = null;
        return newItems;
      });
    }
  };

  const getClassName = (item: number) => {
    if (dragging && item === dragItem.current) {
      return 'dnd-item dragging';
    }
    return 'dnd-item';
  };

  //切换到上一页
  const prevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page > 0) {
      setPage(page - 1);
    } else {
      setPage(0);
    }
  };

  //切换到下一页
  const nextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page < Math.floor(items.length / pageSize)) {
      setPage(page + 1);
    } else {
      setPage(page);
    }
  };

  return (
    <div className='App'>
      <div className='container' ref={conRef}>
        {items
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((n: number, ind: number) => (
            <Item
              extraClassName={getClassName(n)}
              key={n}
              text={n.toString()}
              editing={editing}
              handleClick={(e) => e.preventDefault()}
              handleDelete={handleDelete(n)}
              onLongPress={onLongPress}
              draggable={editing} //只有触发抖动时才可以拖拽
              dataIndex={ind}
              handleDragStart={(e) => handleDragStart(e, n)}
              handleDrag={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
              }}
              handleDragEnd={handleDragEnd}
              handleDragOver={(e) => handleDragOver(e, n)}
            />
          ))}
      </div>
      <div className='page-container'>
        <button className='btn' onClick={prevPage}>
          上一页
        </button>
        <div>
          <label className='label' htmlFor='pageSize'>
            跳转到
            <input
              className='page-input'
              name='pageSize'
              type='text'
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            />
            页
          </label>
        </div>
        <button className='btn' onClick={nextPage}>
          下一页
        </button>
        <button className='btn' onClick={finishEdit}>
          完成编辑
        </button>
      </div>
    </div>
  );
}

export default hot(module)(App);
