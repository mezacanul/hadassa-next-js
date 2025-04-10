import { MiniSingleton } from "@/utils/--MiniSingleton";

// Object to store hooks and their initial states
let hooks = {};

// PortableContext factory function
export function PortableContext(config) {
    if (hooks.initialized) {
        return hooks; // Return existing hooks if already initialized
    }

    // Initialize hooks from config, using the initialState from MiniSingleton
    Object.entries(config).forEach(([key, singleton]) => {
        hooks[key] = { hook: singleton, initialState: singleton.initialState };
    });

    hooks.initialized = true;
    return hooks;
}

// Dynamically access hooks by name with type-appropriate fallback
export function loadHook(hookName) {
    const hookEntry = hooks[hookName];
    if (hookEntry) {
        return hookEntry.hook();
    }

    // Fallback based on initial state type
    const initialState = hookEntry?.initialState;
    if (initialState === undefined) {
        return [undefined, () => {}]; // Default fallback if hook not found
    }
    return [initialState, () => {}]; // Use initial state as fallback
}
