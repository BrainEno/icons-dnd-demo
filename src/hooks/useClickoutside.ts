import React, { useCallback, useEffect, useRef } from 'react';

export type ClickoutsideEvent<Target = Element> =
  | React.MouseEvent<Target>
  | React.TouchEvent<Target>;
export type ClickoutsideCallback<Target = Element> = (
  event: ClickoutsideEvent<Target>
) => void;

function useClickoutside<Target = Element>(
  elRef: React.RefObject<Element>,
  callback: ClickoutsideCallback<Target>
) {
  const savedCallback = useRef(callback);

  const handler = useCallback(
    (e) => {
      if (
        elRef.current &&
        savedCallback.current &&
        !elRef.current.contains(e.target)
      ) {
        callback(e);
      }
    },
    [elRef, callback]
  );

  useEffect(() => {
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [handler]);
}

export default useClickoutside;
