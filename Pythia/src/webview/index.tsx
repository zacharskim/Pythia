import * as React from "react";
import { createRoot } from "react-dom/client";
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
  console.log(window.vscodeApi.getState(), "state");
  console.log(window.vscodeApi, "api i guess");
  console.log(typeof App, "this is the indow i guess...");
  window.vscodeApi.setState({ messages: ["ooga booga"], isLoading: false, app: App });
}

const elm = document.querySelector("#root");
if (elm) {
  createRoot(elm).render(
    <VsCodeApiContext.Provider value={window.vscodeApi}>
      <App />
    </VsCodeApiContext.Provider>
  );
}

// Webpack HMR
if ((module as any).hot) {
  (module as any).hot.accept();
}
