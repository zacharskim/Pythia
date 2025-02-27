import * as React from "react";
import { createRoot } from "react-dom/client";
import VsCodeApiContext from "./vscodeApiContext";
import { App } from "./App";

// declare global {
//   interface Window {
//     vscodeApi?: {
//       getState: () => unknown;
//       setState: (data: unknown) => void;
//       postMessage: (msg: unknown) => void;
//     };
//   }
// }
declare var acquireVsCodeApi: any;

// allows HMR to occur despite already calling acquireVsCodeApi
const vscode = acquireVsCodeApi();
vscode.postMessage({
  command: "alert",
  text: "🐛  on line " + 63
});

const elm = document.querySelector("#root");
if (elm) {
  createRoot(elm).render(
    <VsCodeApiContext.Provider value={vscode}>
      <App />
    </VsCodeApiContext.Provider>
  );
}

// Webpack HMR
if ((module as any).hot) {
  (module as any).hot.accept();
}
