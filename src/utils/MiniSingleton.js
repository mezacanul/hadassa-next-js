import { useState, useEffect } from "react";

export function MiniSingleton(initialState) {
  let sharedState = initialState;
  let listeners = [];

  const setSharedState = (newState) => {
    sharedState = typeof newState === "function" ? newState(sharedState) : newState;
    listeners.forEach((listener) => listener(sharedState));
  };

  return function useSharedContext() {
    const [state, setState] = useState(sharedState);

    useEffect(() => {
      listeners.push(setState);
      setState(sharedState); // Sync with latest shared state on mount
      return () => {
        listeners = listeners.filter((listener) => listener !== setState);
      };
    }, []);

    return [state, setSharedState];
  };
}