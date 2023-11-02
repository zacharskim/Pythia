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

	});


	context.subscriptions.push(clearChatDisposable);



context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("pythia-sidebar", {
		  resolveWebviewView: (webviewView: vscode.WebviewView) => {
			const panel = webviewView.webview;
	  
			panel.options = {
			  enableScripts: true,
			};
			panel.html = getWebviewContent(context, panel);
		  },
		})
	  );
	
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


//tomorrow
//comitt a working version of the webview to github
//fix the clear / cancel call button
//fix the input box styling
//make it auto-scroll or work better when new messages are added / sent etc
//make the data persist on open / close (make it fast too?)
//make the copy / paste button a little more aestically pleasing...

//future
//voice commands
//keyboard shortcuts
//ability to dictate
//ability to easily point it to parts of your code 
//explain error issues etc...

