import * as vscode from "vscode";

const siteUrl = "https://devfixes.vercel.app";

async function getDiagnosticText() {
  const editor = vscode.window.activeTextEditor;
  const selected = editor?.document.getText(editor.selection).trim();
  if (selected) return selected;

  return vscode.window.showInputBox({
    title: "DevFixes",
    prompt: "Paste an error message, stack trace, or terminal output.",
    placeHolder: "ModuleNotFoundError: No module named requests",
  });
}

async function openDevFixes(path: "search" | "debug") {
  const diagnostic = await getDiagnosticText();
  if (!diagnostic) return;

  const parameter = path === "search" ? "q" : "input";
  const url = vscode.Uri.parse(
    `${siteUrl}/${path}?${parameter}=${encodeURIComponent(diagnostic.slice(0, 30_000))}`,
  );
  await vscode.env.openExternal(url);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("devfixes.searchSelectedError", () =>
      openDevFixes("search"),
    ),
    vscode.commands.registerCommand("devfixes.debugSelectedError", () =>
      openDevFixes("debug"),
    ),
  );
}

export function deactivate() {}
