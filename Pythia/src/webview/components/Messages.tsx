import * as React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Message } from './MessageBaseComponent';

export interface IMessagesProps {
  messages: Message[];
}

export default function Messages ({ messages }: IMessagesProps) {

  return (
    <div>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
            <MarkdownRenderer markdown={message.content} />
          </div> 
        ))} 
      </div>
      
    </div>
  );
}
