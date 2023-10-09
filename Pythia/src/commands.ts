// commands.ts

import * as vscode from 'vscode';



export class Commands {
    name: string;
    constructor() {
        this.name = 'Polygon';
      }


    public create_file(): void {
      // Create a new file with a specified name.

    }

    public create_file_w_location(): void{
      // Create a new file with a specified name and location.

    }
    public open_file(): void {
      // Open an existing file by its name.
    }

  
    public save_file(): void {
      // Save the currently open file.
    }
  
    public save_all_files(): void {
      // Save all open files.
    }
  
    public close_file(filename?: string): void {
        // Close the currently open file.
        const textEditors = vscode.workspace.textDocuments;

        if (filename) {
            // Find the TextEditor with the specified file name.
            const editorToClose = textEditors.find((document) =>
                document.fileName.endsWith(filename)
            );

            if (editorToClose) {
            // Close the file if found.
            vscode.commands.executeCommand('workbench.action.closeActiveEditor',{
                // viewColumn: editorToClose.viewColumn,
                preview: false,
              });
            } else {
            vscode.window.showErrorMessage(`File not found: ${filename}`);
            }
        } else {
            // Close the currently active file.
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
    }
  
    public close_all_files(): void {
      // Close all open files.

    }
  
    public search_project(): void {
      // Perform a global search in the project for a specified term.
    }
  
    public replace_project(): void {
      // Perform a global find and replace in the project.
    }
  
    public toggle_comment(): void {
      // Toggle comments on the current line or selection.
    }
  
    public format_document(): void {
      // Format the currently open document.
    }
  
    public undo(): void {
      // Undo the last action.
    }
  
    public redo(): void {
      // Redo the last action.
    }
  
    public expand_selection(): void {
      // Expand the selection to the next logical scope (e.g., from a word to a line, from a line to a block).
    }
  
    public shrink_selection(): void {
      // Shrink the selection to the previous logical scope.
    }
  
    public move_line_up(): void {
      // Move the current line or selection up by one line.
    }
  
    public move_line_down(): void {
      // Move the current line or selection down by one line.
    }
  
    public duplicate_line(): void {
      // Duplicate the current line or selection.
    }
  
    public delete_line(): void {
      // Delete the current line or selection.
    }
  
    public collapse_all(): void {
      // Collapse all code blocks in the current file.
    }
  
    public expand_all(): void {
      // Expand all code blocks in the current file.
    }
  
    public go_to_line(): void {
      // Go to a specified line in the project.
    }
  
    public show_instance(): void {
      // Show an instance of a specified function.
    }
  
    public show_next_instance(): void {
      // Show the next instance of the previously mentioned function (if exists).
    }
  
    public explain_code(): void {
      // Explain the highlighted code.
    }
  
    public comment_code(): void {
      // Comment the highlighted code.
    }
  
    public bug_hunt_code(): void {
      // Check the highlighted code for bugs or potential errors.
    }
  
    public custom_command(): void {
      // Allow the user to set their own commands with a name and a description: "spell_check: fix any misspelled words in the highlighted text"
    }
  
    public write_me(): void {
      // Produce code in the console to user specification like fizzbuzz or hit an API, etc.
    }
  }
  