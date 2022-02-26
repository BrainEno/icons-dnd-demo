import {
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
} from 'react';

export type LongPressEvent<Target = Element> =
  | React.MouseEvent<Target>
  | React.TouchEvent<Target>;
export type LongPressCallback<Target = Element> = (
  event?: LongPressEvent<Target>
) => void;
export type LongPressResult<Target = Element> = {
  onMouseDown: MouseEventHandler<Target>;
  onMouseUp: MouseEventHandler<Target>;
  onMouseMove: MouseEventHandler<Target>;
  onMouseLeave: MouseEventHandler<Target>;
  onTouchStart: TouchEventHandler<Target>;
  onTouchMove: TouchEventHandler<Target>;
  onTouchEnd: TouchEventHandler<Target>;
};

function isTouchEvent<Target>(
  event: LongPressEvent<Target>
): event is React.TouchEvent<Target> {
  const { nativeEvent } = event;
  return window.TouchEvent
    ? nativeEvent instanceof TouchEvent
    : 'touches' in nativeEvent;
}

function isMouseEvent<Target>(
  event: LongPressEvent<Target>
): event is React.MouseEvent<Target> {
  return event.nativeEvent instanceof window.MouseEvent;
}

type Coordinates = {
  x: number;
  y: number;
} | null;

function getCurrentPosition<Target>(
  event: LongPressEvent<Target>
): Coordinates {
  if (isMouseEvent(event)) {
    return { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
  }

  if (isTouchEvent(event)) {
    return {
      x: event.nativeEvent.touches[0].pageX,
      y: event.nativeEvent.touches[0].pageY,
    };
  }
  return null;
}

function useLongPress<Target = Element>(
  callback: LongPressCallback<Target>,
  delay = 400 //设置长按默认延迟为400ms
): LongPressResult<Target> | {} {
  const isLongPressing = useRef(false);
  const isPressed = useRef(false);
  const cb = useRef(callback);
  const timer = useRef<NodeJS.Timeout>();
  const startPosition = useRef<Coordinates>(null);

  const start = useCallback(
    (event: LongPressEvent<Target>) => {
      if (isPressed.current) {
        return;
      }

      if (!isMouseEvent(event) && !isTouchEvent(event)) {
        return;
      }

      startPosition.current = getCurrentPosition(event);

      isPressed.current = true;
      timer.current = setTimeout(() => {
        if (cb.current) {
          cb.current(event);
          isLongPressing.current = true;
        }
      }, delay);
    },
    [delay]
  );

  const cancel = (event: LongPressEvent<Target>) => {
    if (!isMouseEvent(event) && !isTouchEvent(event)) {
      return;
    }

    startPosition.current = null;
    isLongPressing.current = false;
    isPressed.current = false;
    timer.current !== undefined && clearTimeout(timer.current);
  };

  const handleMove = useCallback(
    (event: LongPressEvent<Target>) => {
      if (!isPressed.current || !isLongPressing.current) {
        return;
      }

      if (startPosition.current) {
        const currentPosition = getCurrentPosition(event);
        if (currentPosition) {
          if (
            //如果鼠标偏移量超过25px，则认为不是长按事件
            Math.abs(currentPosition.x - startPosition.current.x) > 25 ||
            Math.abs(currentPosition.y - startPosition.current.y) > 25
          ) {
            cancel(event);
          }
        }
      }
    },
    [isPressed, isLongPressing]
  );

  //如果已存在timer，则清除
  useEffect(() => {
    return () => {
      timer.current !== undefined && clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  if (callback === null) {
    return {};
  }

  return {
    onMouseDown: start,
    onMouseMove: handleMove,
    onMouseLeave: cancel,
    onMouseUp: cancel,
    onTouchStart: start,
    onTouchMove: handleMove,
    onTouchEnd: cancel,
  };
}

export default useLongPress;
