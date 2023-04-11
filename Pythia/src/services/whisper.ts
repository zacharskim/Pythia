import axios from 'axios';
import { io } from "socket.io-client";


const api = axios.create({
    baseURL: "http://127.0.0.1:5000/audio",
  });

export const startListening = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    console.log("trying??");
    try {
      const response = await api.post('/start_listening');

      if (response.status === 200) {
        console.log("server is listening...");
        resolve(response.data.message);
      } else {
        reject(new Error('Failed to start listening.'));
      }
    } catch (error) {
      reject(error);
    }
  });
};


interface MessageData {
  text: string;
}

export const startListeningSocket = () => {
  const socket = io("http://127.0.0.1:5000/", {
    hostname: '127.0.0.1',
    port: '5000',
    secure: false
  });

  console.log("socket trying to connect maybe..");

  console.log(socket);

socket.on("connect", () => {
  console.log("Connected to server", socket);

  // Send the 'start_listening' event to the server
  console.log("emitting now...");
  socket.emit("start_listening"); 

  // Listen for 'message' events from the server
  socket.on("message", (data: MessageData) => {
    console.log("Received message:", data.text);
  });
});

};
