import * as React from "react";
import { Socket } from "socket.io-client";
import InputField from "./InputField";
import Messages from "./Messages";
import { Message } from "../types";

export interface IMessageBaseComponentProps {
  socket: Socket | null;
  generatingResponse: boolean;
  setResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// export interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

export interface clearMsg {
  command: string;
}

export default function MessageBaseComponent(props: IMessageBaseComponentProps) {
  const { socket, generatingResponse, setResponseLoading } = props;
  // let tmp = "Certainly! Since you have an interest in software engineering and mathematics, let's delve into a fascinating aspect that combines both: the concept of algorithms in computer science.Algorithms are fundamental to computer science and software engineering. They are step-by-step procedures or formulas for solving a problem or accomplishing a task. The beauty of algorithms lies in their versatility and efficiency. They're used in everything from simple tasks like sorting a list of numbers to complex operations like image processing or running search engines.One of the classic algorithms in computer science is the sorting algorithm. There are many types of sorting algorithms, each with its own strengths and weaknesses. For instance, the Bubble Sort is one of the simplest sorting algorithms, but it's not very efficient for large datasets. On the other hand, Quick Sort and Merge Sort are much more efficient for large datasets but are more complex in their implementation.Another fascinating area is the field of algorithms for machine learning and artificial intelligence. These algorithms, such as neural networks and decision trees, are designed to learn from data and make predictions or decisions. They're the backbone of many modern technologies, from recommendation systems in online shopping to autonomous vehicles.Algorithms also play a crucial role in cryptography, which is vital for secure communication in the digital world. Cryptographic algorithms like RSA and AES ensure that our online transactions and communications are secure."

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");

  // const messageListRef = React.useRef<HTMLDivElement>(null);

  // const updateScroll = () => {
  //   if (messageListRef.current) {
  //     console.log(messageListRef.current.scrollHeight, 'scroll height');
  //     window.scroll(0, messageListRef.current.scrollHeight);
  //   }
  // };

  //   window.addEventListener('scroll', function() {
  //     // Get the fixed element
  //     let element = document.querySelector('.input-container') as HTMLElement; // Assuming '.input-container' is your class

  //     // Check if the element exists to avoid errors
  //     if (element) {
  //         // Get the offset height of the element
  //         let offsetHeight = element.getBoundingClientRect().height;
  //         console.log(offsetHeight, 'offsetHeight');

  //         // Calculate the maximum scroll position
  //         // It's the document height minus the viewport height and the fixed element's height
  //         let windowHeight = window.innerHeight;
  //         let documentHeight = document.documentElement.scrollHeight;
  //         let maxScroll = documentHeight - windowHeight - offsetHeight - 80;

  //         // Get the current scroll position
  //         var currentScroll = window.scrollY;

  //         // If we've scrolled past the max scroll position, reset to max scroll position
  //         if (currentScroll > maxScroll) {
  //             window.scrollTo(0, maxScroll);
  //         }
  //     }
  // });

  React.useEffect(() => {
    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (event: { data: clearMsg }) => {
    const message = event.data; // The JSON data our extension sent
    if (message.command === "clearChat") {
      setMessages([]);
    }
  };

  React.useEffect(() => {
    //messages changes, so we can emit some data prolly
    const mostRecentMsg: Message = messages[messages.length - 1];
    if (messages.length > 0 && mostRecentMsg["role"] === "user") {
      socket?.emit("data", messages);
      setResponseLoading(true);
    }
  }, [messages]);

  React.useEffect(() => {
    socket?.on("data", (data) => {
      if (data.data === "STOP") {
        setResponseLoading(false);
        setMessages((prevMessages) => [...prevMessages]);
      } else {
        setMessages((prevMessages) => {
          const newMessages: Message[] = [...prevMessages];
          const mostRecentMsg: Message =
            newMessages[newMessages.length - 1]["role"] === "user"
              ? { role: "assistant", content: "" }
              : newMessages.pop()!; // handle the case where there is no last message yet
          if (mostRecentMsg["content"] !== undefined) {
            mostRecentMsg["content"] += data.data;
          }
          return [...newMessages, mostRecentMsg];
        });
        // updateScroll();
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
      <Messages messages={messages} />
      <InputField
        input={inputValue}
        setInput={setInputValue}
        generatingResponse={generatingResponse}
        messsages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
