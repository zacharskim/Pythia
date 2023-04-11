import * as React from "react";
import { createRoot } from 'react-dom/client';
import VsCodeApiContext from "./vscodeApiContext";
import { App } from "./App";

declare global {
  interface Window {
    vscodeApi?: {
      getState: () => unknown;
      setState: (data: unknown) => void;
      postMessage: (msg: unknown) => void;
    }; 
  }
}

// allows HMR to occur despite already calling acquireVsCodeApi 
if (!window.vscodeApi) {
  window.vscodeApi = acquireVsCodeApi();
}

const elm = document.querySelector("#root");
if (elm) {
  createRoot( elm).render(    
  <VsCodeApiContext.Provider value={window.vscodeApi}>
    <App />
  </VsCodeApiContext.Provider>);
}

// Webpack HMR
if ((module as any).hot){
  (module as any).hot.accept();
} 