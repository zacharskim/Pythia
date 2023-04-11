// vscodeApiContext.ts
import * as React from "react";

interface VsCodeApi {
  getState: () => unknown;
  setState: (data: unknown) => void;
  postMessage: (msg: unknown) => void;
}

const vsCodeApiContext = React.createContext<VsCodeApi | null>(null);

export default vsCodeApiContext;
