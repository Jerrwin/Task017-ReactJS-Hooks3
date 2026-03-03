# Task 17 - React Performance Optimization & Hooks

A high-performance healthcare dashboard built to demonstrate advanced React optimization techniques, focusing on minimizing re-renders and managing complex component lifecycles.

## Features

* **Render Cycle Monitoring:** Implements a custom `useRef` counter to track and visualize Virtual DOM updates, proving the efficiency of the optimization logic.
* **Memoization Mastery:** Utilizes `useMemo` for heavy data filtering and `useCallback` to prevent function recreation, ensuring the UI remains buttery smooth under load.
* **Optimized Child Components:** Features `React.memo` integration to isolate child components, preventing unnecessary renders when unrelated parent state changes.
* **Persistent DOM References:** Uses `useRef` for auto-focusing search inputs on mount and managing "Scroll to Top" navigation without re-triggering the render engine.
* **Dynamic Data & UX:** Combines Axios for real-time data fetching with a responsive Glassmorphism UI, featuring case-insensitive search highlighting and a detailed "Patient Hero" banner.