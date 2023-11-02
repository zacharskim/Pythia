import * as React from 'react';
import { Message } from './MessageBaseComponent';

export interface IInputFieldProps {
  input: string;
  messsages: Message[];
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  generatingResponse: boolean;
}

export default function InputField (props: IInputFieldProps) {
  const { input, setInput, setMessages, generatingResponse } = props;
  
  const micIconRef = React.useRef<HTMLSpanElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

const handleInput = () => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    } 
  };

const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !generatingResponse) {
      e.preventDefault();
      sendmessage(); 
      if(textareaRef.current){
        textareaRef.current.style.height = '28px';
      }
    } else if(e.key === 'Enter' && generatingResponse) {
      e.preventDefault();
    }
  };

const handleMicIconClick = () => {
  console.log('clicked mic icon');
    // setMicIconFocused((prevState) => !prevState);
  };

const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = '28px';
    element.style.height = element.scrollHeight + 'px';
  };


const sendmessage = () => {
    if (input.trim() === '') {
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
      ]);
    setInput('');
  };


  return (
    <div>
      <div className="input-container">
        <div className='input-wrapper'>
            <textarea
              className="message-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onInput={handleInput}
            />
        <i ref={micIconRef} className="fas fa-microphone mic-icon" onClick={handleMicIconClick}/>
        </div>
      </div>
      
    </div>
  );
}
