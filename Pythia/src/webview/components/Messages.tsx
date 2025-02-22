import * as React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import { Message } from "../types";

export interface IMessagesProps {
  messages: Message[];
  // messageListRef: React.RefObject<HTMLDivElement>;
}

export default function Messages({ messages }: IMessagesProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
          <MarkdownRenderer markdown={message.content} />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
