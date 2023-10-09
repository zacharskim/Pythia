
// import VsCodeApiContext from "./vscodeApiContext";
// import * as React from 'react';

// const vscode = React.useContext(VsCodeApiContext);


// const sendMessage = () => { 
//     vscode?.postMessage({
//       command: 'POST_DATA',
//       payload: { msg: 'Hello from the webview' },
//     });
//   };

//   const requestData = () => {
//     vscode?.postMessage({ command: 'GET_DATA' });

//   };


//   const requestWithErrorData = () => {
//     vscode?.postMessage({ command: 'GET_DATA_ERROR' });
//   };


//   const messageListener = (event: MessageEvent) => {
//     const { data } = event;
//     const { command, payload, error } = data;
//     console.log("an event!", payload, command);

//     if (command === 'GET_DATA') {
//       setMessage(payload);
//     } else if (command === 'GET_DATA_ERROR') {
//       setError(error);
//     }
//   };

//   const handleWrapperClick = () => {
//     console.log("running...");
//     textAreaWrapperRef.current?.focus();
//   };


//   window.addEventListener('message', messageListener);

//   window.removeEventListener('message', messageListener);


//   panel.webview.onDidReceiveMessage(message => {
//     const { command, requestId, payload } = message;

//     if (command === "GET_DATA") {
//         // Do something with the payload

//         // Send a response back to the webview
//         panel.webview.postMessage({
//             command,
//             requestId, // The requestId is used to identify the response
//             payload: `Hello from the extension!`
//         });
//     } else if (command === "GET_DATA_ERROR" ) {
//         panel.webview.postMessage({
//             command,
//             requestId, // The requestId is used to identify the response
//             error: `Oops, something went wrong!`
//         });
//     } else if (command === "POST_DATA") {
//         vscode.window.showInformationMessage(`Received data from the webview: ${payload.msg}`);
//     }
// }, undefined, context.subscriptions);



// panel.onDidReceiveMessage(
//     (message) => {
//       const { command, requestId, payload } = message;

//       if (command === "GET_DATA") {
//         // Do something with the payload

//         // Send a response back to the webview
//         panel.postMessage({
//           command,
//           requestId, // The requestId is used to identify the response
//           payload: `Hello from the extension!`,
//         });
//       } else if (command === "GET_DATA_ERROR") {
//         panel.postMessage({
//           command,
//           requestId, // The requestId is used to identify the response
//           error: `Oops, something went wrong!`,
//         });
//       } else if (command === "POST_DATA") {
//         vscode.window.showInformationMessage(
//           `Received data from the webview: ${payload.msg}`
//         );
//       }
//     },
//     undefined,
//     context.subscriptions
//   );


//   //refactor code at some point?? Post lunch etc refactor code substantially...fix up app.tsx, fix up extension.tsx
// //test to make sure things still work alright....reduce complexity and cognitive load...

 
// // audio epic 

// //TODO: listen for "hey pythia etc"
// //TODO: write out all the commands etc...
// //TODO: write out all the shortcuts etc...
// //TODO: figure out link between chat and audio portion etc...

// // Commands
// // Run Pythia: Start Listening 
// // Run Pythia: End Listen

// // “Hey Pythia, Go to line 42 in the main.css file”
// // “Hey Pythia, Show me an instance of getSum”, “show me the next getSum instance”
// // “Hey Pythia, Show me the definition of getSum”
// // “Hey Pythia, write me a function to solve fizz buzz” (shows up in the text convo) 
// // “Hey Pythia, blah blah blah” - throw an error message…’


// //when in 'verbal mode' microphone will flash when recording you, stop when you click away...

// // Have the ability for it to respond verbally, at different speeds…..
// // When I highlight text and and hit some key strokes, the bot will explain the code
// // When I highlight text and and hit some key strokes, the bot will suggest an optimized or refactored version of the code
// // When I highlight text and and hit some key strokes, the bot will replace it with an optimized or refactored version of the code
