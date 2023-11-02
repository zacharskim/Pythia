import * as React from 'react';
import { Socket } from 'socket.io-client';
import InputField from './InputField';
import Messages from './Messages';

export interface IMessageBaseComponentProps {
    socket: Socket | null;
    generatingResponse: boolean;
    setResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBaseComponent (props: IMessageBaseComponentProps) {
  const { socket, generatingResponse, setResponseLoading } = props;
  //going to need a way to track messages 

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [userMsgs, setUserMessages] = React.useState<Message[]>([]);
  const [assistantMsgs, setAssistantMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');


  React.useEffect(() => {
    //messages changes, so we can emit some data prolly
    const mostRecentMsg : Message = messages[messages.length - 1];
    if(messages.length > 0 && mostRecentMsg['role'] === 'user'){
      console.log('sending this message');
      socket?.emit('data', messages);
      setResponseLoading(true);
    } 

  }, [messages]);


  React.useEffect(() => {
    socket?.on("data", (data) => {
      //do something with the msg data being streamed back etc...
      //process new chunk of the stream....
      if (data.data === 'STOP') {
        setResponseLoading(false);
        setMessages((prevMessages) => [...prevMessages]);
        } else {
          setMessages((prevMessages) => {
            // Otherwise, update the last message or append as necessary.
            // Copy the previous messages to avoid direct mutation.
            const newMessages : Message[] = [...prevMessages];
            const mostRecentMsg : Message = newMessages[newMessages.length - 1]['role'] === 'user' ? {role: 'assistant', content: ''} : newMessages.pop()!; // handle the case where there is no last message yet
            if (mostRecentMsg['content'] !== undefined) {
              mostRecentMsg['content'] += data.data;
            }
            return [...newMessages, mostRecentMsg];
          });
        }
    });
    return () => {
      socket?.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket]);

  return (
    <div>
      <Messages messages={messages}/>
      <InputField input={inputValue} setInput={setInputValue} generatingResponse={generatingResponse} messsages={messages} setMessages={setMessages}/>
    </div>
  );
}


