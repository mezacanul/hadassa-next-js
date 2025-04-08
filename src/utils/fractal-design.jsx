import { useState, useEffect } from "react";

// MiniSingleton: Creates a mini context for shared state
export function MiniSingleton(initialState) {
  let sharedState = initialState;
  let listeners = [];

  const setSharedState = (newState) => {
    sharedState = typeof newState === "function" ? newState(sharedState) : newState;
    // console.log("MiniSingleton: State updated", sharedState);
    listeners.forEach((listener) => listener(sharedState));
  };

  function useSharedContext() {
    const [state, setState] = useState(sharedState);

    useEffect(() => {
      listeners.push(setState);
      setState(sharedState);
      return () => {
        listeners = listeners.filter((listener) => listener !== setState);
      };
    }, []);

    return [state, setSharedState];
  }

  useSharedContext.initialState = initialState;
  return useSharedContext;
}

// PortableContext: Initializes app-wide mini singletons
let fractal_hooks = {};
const allowedEntryFiles = ["_app.jsx", "main.jsx"]; // Define allowed entry files

export function PortableContext(config) {
  // Check if already initialized
  if (fractal_hooks.initialized) {
    throw new Error(
      "PortableContext can only be initialized once. It should be called in an entry-level file like _app.jsx or main.jsx."
    );
  }

  // Check the call stack to ensure it's called from an entry-level file
  const stack = new Error().stack || "";
  const callerFile = stack
    .split("\n")[2] // Get the third line of the stack (the caller)
    ?.match(/at .+ \((.+):\d+:\d+\)/)?.[1] // Extract the file path
    ?.split("/")
    .pop(); // Get the file name

  if (!callerFile || !allowedEntryFiles.includes(callerFile)) {
    throw new Error(
      `PortableContext can only be initialized in entry-level files: ${allowedEntryFiles.join(", ")}. It was called from ${callerFile || "an unknown file"}.`
    );
  }

  // Initialize fractal_hooks
  Object.entries(config).forEach(([key, singleton]) => {
    fractal_hooks[key] = { hook: singleton, initialState: singleton.initialState };
  });

  fractal_hooks.initialized = true;
  return fractal_hooks;
}

// loadHook: Dynamically access mini singletons by name
export function loadHook(hookName) {
  const hookEntry = fractal_hooks[hookName];
  if (hookEntry) {
    return hookEntry.hook();
  }

  const initialState = hookEntry?.initialState;
  if (initialState === undefined) {
    return [undefined, () => {}];
  }
  return [initialState, () => {}];
}