// gpt4.ts
import axios, { AxiosResponse } from "axios";
import { Message, MessageEvent } from "../webview/App";


const api = axios.create({
  baseURL: "http://127.0.0.1:5000/msgs",
});

export const sendInput = (input: Message[]): { promise: Promise<string>; cancel: () => void } => {
    let cancel: () => void = () => {}; 

  const cancelToken = new axios.CancelToken((c) => {
    cancel = c;
  });

  console.log('hello, sending input', input);

  const promise = api
    .post("/sendMessages", { input }, { cancelToken })
    .then((response: AxiosResponse<string>) => response.data);

  return { promise, cancel };
};

// import { EventSourcePolyfill } from 'event-source-polyfill';

// // Create an EventSource to listen for SSE messages
// const eventSource = new EventSourcePolyfill('http://127.0.0.1:5000/msgs/gpt4', {
//   withCredentials: false, // Adjust as needed based on your CORS settings
// });

// // Define a callback function to handle SSE messages
// eventSource.addEventListener('message', (event) => {
//   console.log('SHEESH', event);

//    const data = JSON.parse(event.data);

//   // Handle the SSE message here
//   console.log('Received SSE message:', data.message);

//   // Update your UI with the dynamic response
//   // You can add your code here to update the user interface
// });

// // Handle errors
// eventSource.addEventListener('error', (error) => {
//   console.error('SSE Error:', error);

//   // Handle SSE errors, if needed
// });

// // Function to close the SSE connection when it's no longer needed
// function closeSSEConnection() {
//   eventSource.close();
// }

// // Export the closeSSEConnection function for use in your application
// export { closeSSEConnection };

