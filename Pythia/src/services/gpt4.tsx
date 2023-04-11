// gpt4.ts
import axios, { AxiosResponse } from "axios";
import { Message } from "../webview/App";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/msgs",
});

export const sendInput = (input: Message[]): { promise: Promise<string>; cancel: () => void } => {
    let cancel: () => void = () => {}; 

  const cancelToken = new axios.CancelToken((c) => {
    cancel = c;
  });

  const promise = api
    .post("/gpt4", { input }, { cancelToken })
    .then((response: AxiosResponse<string>) => response.data);

  return { promise, cancel };
};


