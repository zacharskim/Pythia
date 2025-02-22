import { join } from 'path';
import * as vscode from 'vscode';
import { ExtensionContext, ExtensionMode, Uri, Webview } from 'vscode';
import { startListening, startListeningSocket } from './services/whisper';

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //consider this thing
  let statusBar: vscode.StatusBarItem;
export function activate(context: vscode.ExtensionContext) {


	const currentTheme = vscode.window.activeColorTheme;

    // Do something with the current theme
	console.log(vscode.window.activeColorTheme, 'what the heck is this');
    console.log(currentTheme.kind); // Light, Dark, or HighContrast



	


context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("pythia-sidebar", {
		  resolveWebviewView: (webviewView: vscode.WebviewView) => {
			 currentWebviewPanel = webviewView.webview;

			currentWebviewPanel.options = {
			  enableScripts: true,
			  
			};
			currentWebviewPanel.html = getWebviewContent(context, currentWebviewPanel);
		  },
		})
	  );
	console.time('Activation');

// Your activation code here

	let currentWebviewPanel: vscode.Webview | undefined;

//two new commands for indicating listengin or not...
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  statusBar.text = 'Pythia '+'$(unmute)';
  statusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');

  context.subscriptions.push(statusBar);

  // Register the start listening command
  const startListeningDisposable = vscode.commands.registerCommand('pythia.startListening', async () => {

	//start listening on the server...
	try {
		
		statusBar.show();
		vscode.window.showInformationMessage('Pythia: Now listening....');
		startListeningSocket();
		// const res = await startListening(); // Use the startListening function
		let res = null;

		if (res && res === 'Listening stopped') {
		  // Execute the desired command here
		  vscode.commands.executeCommand('pythia.stopListening');
		}
		
	  } catch (error) {
		vscode.window.showErrorMessage('Pythia: An error occurred while trying to start listening.');
		console.error(error);
	  }
	
  });

  // Register the stop listening command
  const stopListeningDisposable = vscode.commands.registerCommand('pythia.stopListening', () => {
    // Hide the ear icon from the status bar
    statusBar.hide();
	vscode.window.showInformationMessage("Pythia: Done listening....");
  });

  context.subscriptions.push(startListeningDisposable);
  context.subscriptions.push(stopListeningDisposable);

	//let's user know that pythia heard and is listening....
	let disposable = vscode.commands.registerCommand('pythia.showProgress', async () => {
		await vscode.window.withProgress(
			{
			  location: vscode.ProgressLocation.Notification,
			  title: 'Processing...',
			  cancellable: true
			},
			async (progress, token) => {
			  // Simulate a long-running task
			  const totalSteps = 10;
			  for (let step = 1; step <= totalSteps; step++) {
				// Check if the operation has been cancelled
				if (token.isCancellationRequested) {
				  break;
				}

				await sleep(500);
			}
		  }
		);
	  });
	
	context.subscriptions.push(disposable);


	let clearChatDisposable = vscode.commands.registerCommand('pythia.clearChat', async () => {
		console.log('working');
		if (currentWebviewPanel) {
			currentWebviewPanel.postMessage({ command: 'clearChat' });
		}
	});


	context.subscriptions.push(clearChatDisposable);





	  
}


export function deactivate() {
	console.log('running???');
}


const getWebviewContent = (context: ExtensionContext, webview: Webview) => {
	const jsFile = "webview.js";
	const localServerUrl = "http://localhost:9000";

	let scriptUrl = null;
	let cssUrl = null;

	const isProduction = context.extensionMode === ExtensionMode.Production;
	
	if (isProduction) {
		scriptUrl = webview.asWebviewUri(Uri.file(join(context.extensionPath, 'dist', jsFile))).toString();
	} else {
		scriptUrl = `${localServerUrl}/${jsFile}`; 
	}

	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		${isProduction ? `<link href="${cssUrl}" rel="stylesheet">` : ''}

	</head>
	<body>
		<div id="root"></div>

		<script src="${scriptUrl}" />
	</body>
	</html>`;
};

//now: make it auto-scroll or work better when new messages are added / sent etc....
//plan for this, finish it after dinner...
//make auto-scroll either look cool or just remove it tbh...
//solve by measuring the legnth of the scroller, and if it's even visible...
//dynamically calculate the stopping distance, or see if you can set it to be fixed...
//adjust if a new message was sent etc,,,
//then make sure that for the last message, and last message only, there's a css property that adds like 
//margin or padding to make it seem as if the text is not covered by the input etc, also make sure that the
//cancel button exists in this area...
//also make sure that the scroll back tracks the newly added text etc...either when a new message is sent or 
//when we are getting a stream of data back etc...

//make it function the same way that copiolt chat's does...just get's smaller etc...



//on-deck: make the copy / paste button a little more aestically pleasing... - similar to co-pilot i guess...

//next up
//make it auto-scroll or work better when new messages are added / sent etc - ehh kinda getting done not completely tho...
//auto-focus input field on open...
//make the data persist on open / close (make it fast too?)
//make the copy / paste button a little more aestically pleasing...
//make the input field a little better - border when not focused, better contrast with background, starter text etc...
//adding in light / dark mode themes etc...

//future
//voice commands
// make the mic take voice input when clicked on
// re-visit the hot word and pythia recording spoken text
// implmemnt all those commands that you outlined earlier...
//keyboard shortcuts - open and close sidebar with set keyboard shortcut...
//ability to easily point it to parts of your code 
//explain error issues etc...
//ability to determine context which the 'robot' has access to...choose files or directories etc...
//show where this is tracked as well i guess....like a secondary view or something...(tree view?)


//next steps, finish auto-scroll (this includes the cancel button covering text issue and window adjustment issue)
//...make the copy and paste button look nicer, then make the make the data persist etc...