import * as React from "react";
import "media/reset.css";
import "media/vscode.css";
import "media/font-awesome.css";
import { Socket, io } from "socket.io-client";
import MessageBaseComponent from "./components/MessageBaseComponent";
import LoadingIndicator from "./components/LoadingIndicator";
import InputField from "./components/InputField";

export interface IAppProps {}

export interface MessageEvent {
  data: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const App: React.FunctionComponent<IAppProps> = ({}: React.PropsWithChildren<IAppProps>) => {
  const [responseLoading, setResponseLoading] = React.useState<boolean>(false);
  const [socketInstance, setSocketInstance] = React.useState<Socket | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");

  // const vscode = acquireVsCodeApi();

  // Example structure of your state
  let state = { messages: [], isLoading: false };

  React.useEffect(() => {
    //connect to socket, maybe make this dynamic depending on in prod or not...

    const socket = io("ws://127.0.0.1:5001/", {
      transports: ["websocket"]
    });
    setSocketInstance(socket);

    socket.on("connect", () => {
      console.log("connected to websocket");
    });
    socket.on("disconnect", (data: any) => {
      console.log(data, "error from websocket...");
    });

    // const restoredState = vscode.getState();
    // console.log(restoredState, 'restored state');
    // if (restoredState) {
    //   const state = restoredState;
    //   console.log(state, 'huh');
    //   // Update your webview content based on the restored state
    // }
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <h1>Pythia</h1>
      <h5>Conduit between you and some OpenAi model</h5>
      <div>
        <MessageBaseComponent
          socket={socketInstance}
          generatingResponse={responseLoading}
          setResponseLoading={setResponseLoading}
        />
        <LoadingIndicator
          generatingResponse={responseLoading}
          setResponseLoading={setResponseLoading}
          socket={socketInstance}
        />
      </div>
    </div>
  );
};
