import * as React from 'react';
import 'media/reset.css';
import 'media/vscode.css';
import 'media/font-awesome.css';
import { sendInput } from '../services/gpt4';
import axios, { CancelTokenSource } from 'axios';
import MarkdownRenderer from './MarkdownRenderer';
import { Interface } from 'readline';

export interface IAppProps {}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface MessageEvent {
  data: string;
}

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {

  const [message, setMessage] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [micIconFocused, setMicIconFocused] = React.useState(false);
  const micIconRef = React.useRef<HTMLSpanElement>(null);
  const [userMessages, setUserMessages] = React.useState<Message[]>([]);
  const [assistantMessages, setAssistantMessages] = React.useState<Message[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const textAreaWrapperRef = React.useRef<HTMLDivElement>(null);
  const [cancelRequest, setCancelRequest] = React.useState<(() => void) | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [streamData, setStreamData] = React.useState<string>('');


  async function sendMessageBack(input: Message[]): Promise<void> {
    console.log('sending input');
    const { promise, cancel } = sendInput(input);
    setIsLoading(true);
    setCancelRequest(() => cancel);

    try {
      const response: string = await promise;
      console.log(response, "the response...");
      setIsLoading(false);
  
      if (response) {
        setAssistantMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: response },
        ]);
      }
    } catch (error) {
      if (axios.isCancel(error)) {

        setAssistantMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: '...' },
        ]);
        setIsLoading(false);

      } else {
        setIsLoading(false);
      }
    }
}

  const sendmessage = () => {
    if (inputValue.trim() === '') {
      return;
    }
    setUserMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputValue },
      ]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendmessage(); 
      if(textareaRef.current){
        textareaRef.current.style.height = '28px';
      }
    } else if(e.key === 'Enter' && isLoading) {
      e.preventDefault();
    }
  };

  const handleMicIconClick = () => {
    setMicIconFocused((prevState) => !prevState);
  };


  const mergeMessages = (
    userMessages: Message[],
    assistantMessages: Message[]
  ): Message[] => {
    const mergedMessages: Message[] = [];
  
    for (let i = 0; i < Math.max(userMessages.length, assistantMessages.length); i++) {
      if (userMessages[i]) {
        mergedMessages.push(userMessages[i]);
      }
      if (assistantMessages[i]) {
        mergedMessages.push(assistantMessages[i]);
      }
    }
  
    return mergedMessages;
  };


  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '28px';
    console.log(element.scrollHeight, inputValue);
    element.style.height = element.scrollHeight + 'px';
  };
  
  const handleInput = () => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    } 
  };

  const mergedMessages = mergeMessages(userMessages, assistantMessages);
  // console.log(mergedMessages, 'merged messages');
  React.useEffect(() => {

    console.log('use effect', streamData);
    
    console.log(streamData, 'huh stream data');
    if (mergedMessages.length > 0) {
      sendMessageBack(mergedMessages);

      const sse = new EventSource('http://127.0.0.1:5000/msgs/gpt4');
      sse.onmessage = e => {
      handleStream(e);
    };

      sse.onerror = (error) => {
      console.log('oof error', error);
      sse.close();
    };     
    }

    
    function handleStream(e: MessageEvent){
      console.log(e.data, 'e data');
      setStreamData(streamData => streamData + e.data);
    }



    const handleClickOutside = (event: MouseEvent) => {
      if (micIconRef.current && !micIconRef.current.contains(event.target as Node)) {
        setMicIconFocused(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);

    };
  }, [userMessages]);

  return (
    <div className="app">
      <h1>Pythia</h1>
      <h5>Conduit between you and some LLM</h5>
      <div className="message-list">
        {mergedMessages.map((message, index) => (
          <div key={index} className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
            <MarkdownRenderer markdown={message.content} />
          </div> 
        ))} 
      </div>
      <div className="input-container">
        <div className='input-wrapper'>
            <textarea
              className="message-input"
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onInput={handleInput}
            />
        <i ref={micIconRef} className="fas fa-microphone mic-icon" onClick={handleMicIconClick}/>
        </div>
      </div>
      {isLoading && (
          <button className="cancelRequet" onClick={() => cancelRequest && cancelRequest()}>
            <i className="fa-solid fa-circle-notch fa-spin"></i>Cancel Request
          </button>
        )}
    </div>
  );
};

