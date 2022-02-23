import React, { useState, useRef, useCallback } from 'react';
import { hot } from 'react-hot-loader';
import { Item } from './components/Item';
import './styles/app.css';

const initialArr: number[] = [];

for (let i = 0; i < 66; i++) {
  initialArr.push(i + 1);
}

function App() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [items, setItems] = useState(initialArr);
  const [preparing, setPreparing] = useState(false);
  const pressStart = useRef(false);
  const timer = React.useRef<NodeJS.Timer>();

  const handleDelete =
    (num: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setItems(() => items.filter((n) => n !== num));
      setPreparing(false);
    };

  const handleLongPress = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      pressStart.current = false;
    }

    timer.current = setTimeout(() => {
      pressStart.current = true;
      setPreparing(true);
    }, 1000);

    console.log('click started', preparing);
  }, [preparing]);

  const prevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page > 0) {
      setPage(page - 1);
    } else {
      setPage(0);
    }
  };

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
      <div className='container'>
        {items
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((n: number) => (
            <Item
              key={n}
              text={n.toString()}
              preparing={preparing}
              handleLongPress={handleLongPress /* TODO */}
              handleDelete={handleDelete(n)}
            />
          ))}
      </div>
      <div className='page-container'>
        <button onClick={prevPage}>prev</button>
        <button onClick={nextPage}>next</button>
      </div>
    </div>
  );
}

export default hot(module)(App);
