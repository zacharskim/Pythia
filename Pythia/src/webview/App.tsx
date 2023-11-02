import * as React from 'react';
import 'media/reset.css';
import 'media/vscode.css';
import 'media/font-awesome.css';
// import { sendInput } from '../services/gpt4';
import axios, { CancelTokenSource } from 'axios';
// import MarkdownRenderer from './components/MarkdownRenderer';
import { Interface } from 'readline';
import { Socket, io } from 'socket.io-client';
import Temp from './Temp';
import MessageBaseComponent from './components/MessageBaseComponent';
import LoadingIndicator from './components/LoadingIndicator';


export interface IAppProps {}



export interface MessageEvent {
  data: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {

  const [responseLoading, setResponseLoading] = React.useState<boolean>(false);

  // const [message, setMessage] = React.useState<string>("");
  // const [error, setError] = React.useState<string>("");
  // const [messages, setMessages] = React.useState<Message[]>([]);
  // const [inputValue, setInputValue] = React.useState<string>('');
  // const [micIconFocused, setMicIconFocused] = React.useState(false);
  // const micIconRef = React.useRef<HTMLSpanElement>(null);
  // const [userMessages, setUserMessages] = React.useState<Message[]>([]);
  // const [assistantMessages, setAssistantMessages] = React.useState<Message[]>([]);
  // const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  // const textAreaWrapperRef = React.useRef<HTMLDivElement>(null);
  // const [cancelRequest, setCancelRequest] = React.useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const [streamData, setStreamData] = React.useState<string>('');
  // const [socket, setSocket] = React.useState<Socket | null>(null);  


//   async function sendMessageBack(input: Message[]): Promise<void> {
//     console.log('sending input', input, socket);
//     // const res = socket?.emit('data', input);
//     // console.log(res, 'dawg');
//     return;
//     const { promise, cancel } = sendInput(input);
//     setIsLoading(true);
//     setCancelRequest(() => cancel);

//     try {
//       const response: string = await promise;
//       console.log(response, "the response...");
//       setIsLoading(false);
  
//       if (response) {
//         setAssistantMessages((prevMessages) => [
//           ...prevMessages,
//           { role: "assistant", content: response },
//         ]);
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {

//         setAssistantMessages((prevMessages) => [
//           ...prevMessages,
//           { role: "assistant", content: '...' },
//         ]);
//         setIsLoading(false);

//       } else {
//         setIsLoading(false);
//       }
//     }
// }

  // const sendmessage = () => {
  //   if (inputValue.trim() === '') {
  //     return;
  //   }
  //   setUserMessages((prevMessages) => [
  //     ...prevMessages,
  //     { role: "user", content: inputValue },
  //     ]);
  //   setInputValue('');
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
  //     e.preventDefault();
  //     sendmessage(); 
  //     if(textareaRef.current){
  //       textareaRef.current.style.height = '28px';
  //     }
  //   } else if(e.key === 'Enter' && isLoading) {
  //     e.preventDefault();
  //   }
  // };

  // const handleMicIconClick = () => {
  //   setMicIconFocused((prevState) => !prevState);
  // };


  // const mergeMessages = (
  //   userMessages: Message[],
  //   assistantMessages: Message[]
  // ): Message[] => {
  //   const mergedMessages: Message[] = [];
  
  //   for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
  //     if (userMessages[i]) {
  //       mergedMessages.push(userMessages[i]);
  //     }
  //     if (assistantMessages[i]) {
  //       mergedMessages.push(assistantMessages[i]);
  //     }
  //   }
  
  //   return mergedMessages;
  // };


  // const adjustHeight = (element: HTMLTextAreaElement) => {
  //   element.style.height = '28px';
  //   console.log(element.scrollHeight, inputValue);
  //   element.style.height = element.scrollHeight + 'px';
  // };
  
  // const handleInput = () => {
  //   if (textareaRef.current) {
  //     adjustHeight(textareaRef.current);
  //   } 
  // };

  // const mergedMessages = mergeMessages(userMessages, assistantMessages);

  const [socketInstance, setSocketInstance] = React.useState<Socket | null>(null);
  // const [loading, setLoading] = React.useState(true);
  // const [buttonStatus, setButtonStatus] = React.useState(false);

  // const handleClick = () => {
  //   if (buttonStatus === false) {
  //     setButtonStatus(true);
  //   } else {
  //     setButtonStatus(false);
  //   }
  // };
  
  React.useEffect(() => {
    //connect to socket, maybe make this dynamic depending on in prod or not...
      const socket = io("ws://127.0.0.1:5001/", {
        transports: ["websocket"],
      });

      setSocketInstance(socket);

      socket.on("connect", () => {
        console.log('connected to websocket');
      });
      socket.on("disconnect", (data: any) => {
        console.log(data, 'error from websocket...');
      });
      return function cleanup() {
        socket.disconnect();
      };
  }, []);

  // console.log(mergedMessages, 'merged messages');

  // React.useEffect(() => {

  //   // if(userMessages.length > 0){
  //   //   sendMessageBack(mergedMessages);
  //   // }
    
  //   let localSocet = socket;


  //   if (localSocet === null) {
  //     console.log('sheesh this boi is running...');
  //     localSocet = io("http://127.0.0.1:5001", {
  //       transports: ["websocket"],
  //     });

  //     setSocket(socket);


  //     localSocet.on("connect", () => {
  //       console.log('why?', socket);
  //     });

  //     localSocet.on('data', (data : object) => {
  //       console.log('sheesh', data);
  //     });


  //     // setLoading(false);

     
  //   } else if(userMessages.length === 5) {
  //      localSocet?.on("disconnect", (data) => {
  //       console.log(data, 'disconnected...');
  //     });

  //     return function cleanup() {
  //       localSocet?.disconnect();
  //     };
  //   }
  // }, [userMessages, socket]);




  // React.useEffect(() => {




  //   // console.log('use effect', streamData);
    
  //   // console.log(streamData, 'huh stream data');
  //   // if (mergedMessages.length > 0) {
  //   //   sendMessageBack(mergedMessages);

  //   //   const sse = new EventSource('http://127.0.0.1:5000/msgs/gpt4');
  //   //   sse.onmessage = e => {
  //   //   handleStream(e);
  //   // };

  //   //   sse.onerror = (error) => {
  //   //   console.log('oof error', error);
  //   //   sse.close();
  //   // };     
  //   // }

    
  //   // function handleStream(e: MessageEvent){
  //   //   console.log(e.data, 'e data');
  //   //   setStreamData(streamData => streamData + e.data);
  //   // }



  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (micIconRef.current && !micIconRef.current.contains(event.target as Node)) {
  //       setMicIconFocused(false);
  //     }
  //   };

  //   window.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     window.removeEventListener('mousedown', handleClickOutside);

  //   };

  // }, [userMessages]);

  return (
    <div className="app">
      <h1>Pythia</h1>
      <h5>Conduit between you and some LLM</h5>
      <MessageBaseComponent socket={socketInstance} generatingResponse={responseLoading} setResponseLoading={setResponseLoading} />
      <LoadingIndicator generatingResponse={responseLoading}/> 
      </div>
  );
};

