import React, { useState, useRef } from 'react';
import { hot } from 'react-hot-loader';
import DndItem from './components/DndItem';
import './styles/app.css';
import useLongPress from './hooks/useLongPress';
import useClickoutside from './hooks/useClickoutside';

const initialArr: number[] = [];
//生成fake data
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
      //阻止冒泡以避免父级div的onClick事件被触发
      event.stopPropagation();
      setItems(() => items.filter((n) => n !== num));
      setEditing(false);
    };

  //结束编辑状态
  const finishEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  const handleLongPress = () => {
    //长按触发编辑状态
    setEditing(true);
  };

  const onLongPress = useLongPress(handleLongPress, 400);

  useClickoutside(conRef, () => setEditing(false));

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    from: number
  ) => {
    //拖拽开始
    dragItem.current = from;
    dragNode.current = e.currentTarget;

    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    //设置拖拽状态结束
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, to: number) => {
    //防止出现残影
    e.preventDefault();

    //如果是同一个元素，则不处理
    if (dragItem.current === to) {
      return;
    }

    const currnetItem = dragItem.current;
    //判断拖拽的不是同一个元素
    if (e.currentTarget !== dragNode.current) {
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
            <DndItem
              extraClassName={getClassName(n)}
              key={n}
              text={n.toString()}
              editing={editing}
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
            每页数量
            <input
              className='page-input'
              name='pageSize'
              type='text'
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            />
            个
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
