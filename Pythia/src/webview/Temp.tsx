

import { List } from 'mdast-util-to-hast/lib/handlers/list';
import * as React from 'react';
import { Socket, io } from 'socket.io-client';


export interface IAppProps {
    socket: Socket | null;
}


const Temp: React.FunctionComponent<IAppProps> = ({ socket }) => {
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState<any[]>([]);
    const [currMessage, setCurrMessage] = React.useState<any>("");

    const handleText = (e: { target: { value: any; }; }) => {
        const inputMessage = e.target.value;
        setMessage(inputMessage);
    };

    const handleSubmit = () => {
        if (!message) {
            return;
        }
        socket?.emit("data", message);
        setMessage("");
    };

    const addNewMessage = (message: string): void => {
      console.log('adding this message', message);

        setMessages((prevMessages) => [
            ...prevMessages,
            message,
        ]);
        setCurrMessage("");

    };

  React.useEffect(() => {
    socket?.on("data", (data) => {
      console.log(data.data, 'data from socket');

      setMessages((prevMessages) => {
        if (data.data === 'STOP') {
          // If the incoming data is a STOP command, just add an empty array to the messages list.
          console.log('prev messages apparentl', prevMessages);
          return [...prevMessages, []];
        } else {
          // Otherwise, update the last message or append as necessary.
          // Copy the previous messages to avoid direct mutation.
          const newMessages = [...prevMessages];
          const mostRecentMsg = newMessages.length > 0 ? newMessages.pop() : ''; // handle the case where there is no last message yet
          return [newMessages, mostRecentMsg + data.data];
        }
      });
    });
    return () => {
      socket?.off("data", () => {
        console.log("data event was removed");
      });
    };
    //oooo so just updating state causes a re-render so this is why we can just add to the messages array
    //and don't need it in the useEffect dependency array??? Pretty sure at least...
  }, [socket]);


  return (
    <div>
      <h2>WebSocket Communication</h2>
      <input type="text" value={message} onChange={handleText} />
      <button onClick={handleSubmit}>submit</button>
      <ul>
        {messages.map((message, ind) => {
          return <li key={ind}>{message}</li>;
        })}
      </ul>
    </div>
  );
};

export default Temp;

//should probably get to remeber data from the convo etc...