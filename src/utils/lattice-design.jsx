import { useState, useEffect } from "react";

let lattice_grid = {};
const allowedEntryFiles = ["_app.jsx", "main.jsx", "route-loader.js"]; // Define allowed entry files

// Singleton: Creates a mini context for shared state
export function Singleton(initialState) {
    let sharedState = initialState;
    let listeners = [];

    const setSharedState = (newState) => {
        sharedState =
            typeof newState === "function" ? newState(sharedState) : newState;
        // console.log("Singleton: State updated", sharedState);
        listeners.forEach((listener) => listener(sharedState));
    };

    function useSharedContext() {
        const [state, setState] = useState(sharedState);

        useEffect(() => {
            listeners.push(setState);
            setState(sharedState);
            return () => {
                listeners = listeners.filter(
                    (listener) => listener !== setState
                );
            };
        }, []);

        return [state, setSharedState];
    }

    useSharedContext.reset = () => {
        sharedState = initialState;
        listeners.forEach((listener) => listener(sharedState));
        // listeners = [];
        // Keep Listeners active because we are only resetting values
    };

    useSharedContext.initialState = initialState;
    return useSharedContext;
}

// Nexus: Initializes app-wide mini singletons
export function Nexus(config) {
    if (lattice_grid.initialized) {
        throw new Error(
            "Nexus can only be initialized once. It should be called in an entry-level file like _app.jsx or main.jsx."
        );
    }

    const callerFile = detectCallerFile();
    if (!callerFile || !allowedEntryFiles.includes(callerFile)) {
        throw new Error(
            `Nexus can only be initialized in entry-level files: ${allowedEntryFiles.join(
                ", "
            )}. It was called from ${callerFile || "an unknown file"}.`
        );
    }

    // Initialize lattice_grid
    Object.entries(config).forEach(([key, singleton]) => {
        lattice_grid[key] = {
            hook: singleton,
            initialState: singleton.initialState,
        };
    });

    lattice_grid.initialized = true;
    return lattice_grid;
}

// loadHook: Dynamically access mini singletons by name
export function loadHook(hookName) {
    const hookEntry = lattice_grid[hookName];
    if (hookEntry) {
        return hookEntry.hook();
    }

    const initialState = hookEntry?.initialState;
    if (initialState === undefined) {
        return [undefined, () => {}];
    }
    return [initialState, () => {}];
}

// Helper: Detect caller file from stack trace
function detectCallerFile() {
    const stack = new Error().stack || "";
    const stackLines = stack.split("\n");
    let callerFile = null;

    for (const line of stackLines) {
        const match = line.match(
            /at .+?\(?(.+?\.(?:jsx|js|ts|tsx))(?:\?.*)?(?:\:\d+\:\d+)?\)?$/
        );
        if (match) {
            callerFile = match[1].split("?")[0].split("/").pop();
        }
    }

    return callerFile;
}
