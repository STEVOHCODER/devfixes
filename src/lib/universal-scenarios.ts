export type SimulatorEnvironment =
  | "python"
  | "node"
  | "javascript"
  | "git"
  | "powershell"
  | "cmd"
  | "vscode"
  | "bash";

export type UniversalScenario = {
  id: string;
  title: string;
  environment: SimulatorEnvironment;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  fileName: string;
  language: string;
  starterCode: string;
  reproduceCommand: string;
  errorOutput: string;
  diagnosticCommands: Record<string, string>;
  fixCommand: string;
  fixPatterns: string[];
  successOutput: string;
  hints: string[];
};

export const simulatorEnvironments: Array<{
  id: SimulatorEnvironment;
  label: string;
  description: string;
}> = [
  { id: "python", label: "Python", description: "Tracebacks, packages, virtual environments" },
  { id: "node", label: "Node.js", description: "Modules, npm, ports, configuration" },
  { id: "javascript", label: "JavaScript", description: "Runtime, async, browser data" },
  { id: "git", label: "Git", description: "Branches, conflicts, remotes, recovery" },
  { id: "powershell", label: "PowerShell", description: "Policies, paths, Windows automation" },
  { id: "cmd", label: "CMD", description: "PATH, commands, Windows processes" },
  { id: "vscode", label: "VS Code", description: "Integrated terminal, interpreters, settings" },
  { id: "bash", label: "Bash", description: "Permissions, processes, shell commands" },
];

export const universalScenarios: UniversalScenario[] = [
  {
    id: "python-missing-requests", title: "ModuleNotFoundError: requests", environment: "python", category: "Dependency", difficulty: "Beginner", estimatedTime: "8 min", fileName: "requirements.txt", language: "text", starterCode: "# project dependencies\n", reproduceCommand: "python app.py", errorOutput: "Traceback (most recent call last):\n  File \"app.py\", line 1, in <module>\n    import requests\nModuleNotFoundError: No module named 'requests'", diagnosticCommands: { "python -m pip --version": "pip 24.2 from C:\\devfixes\\.venv\\Lib\\site-packages", "python -c \"import sys; print(sys.executable)\"": "C:\\devfixes\\.venv\\Scripts\\python.exe" }, fixCommand: "python -m pip install requests", fixPatterns: ["python -m pip install requests", "requests>=2"], successOutput: "Successfully installed requests-2.32.3\n$ python app.py\n200 OK\n\n✓ Environment healthy", hints: ["Check which interpreter owns pip.", "Use python -m pip to target the active interpreter.", "Record requests in requirements.txt."],
  },
  {
    id: "python-indent", title: "IndentationError: unexpected indent", environment: "python", category: "Syntax", difficulty: "Beginner", estimatedTime: "6 min", fileName: "report.py", language: "python", starterCode: "def build_report():\n    rows = []\n      return rows\n", reproduceCommand: "python report.py", errorOutput: "  File \"report.py\", line 3\n    return rows\nIndentationError: unexpected indent", diagnosticCommands: { "python -m py_compile report.py": "Sorry: IndentationError: unexpected indent (report.py, line 3)" }, fixCommand: "fix indentation", fixPatterns: ["fix indentation", "return rows"], successOutput: "$ python -m py_compile report.py\nexit 0\n\n✓ Syntax verified", hints: ["Python uses indentation as syntax.", "Compare line 3 with the function body.", "Align return with rows."],
  },
  {
    id: "node-module", title: "ERR_MODULE_NOT_FOUND", environment: "node", category: "Dependency", difficulty: "Beginner", estimatedTime: "10 min", fileName: "server.js", language: "javascript", starterCode: "import config from './config';\nconsole.log(config.port);\n", reproduceCommand: "node server.js", errorOutput: "Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/workspace/config' imported from server.js\ncode: 'ERR_MODULE_NOT_FOUND'", diagnosticCommands: { "ls": "config.js  package.json  server.js", "cat package.json": "{ \"type\": \"module\" }" }, fixCommand: "add .js extension", fixPatterns: ["add .js extension", "./config.js"], successOutput: "$ node server.js\nlistening on http://localhost:3000\n\n✓ Module resolution verified", hints: ["The file exists, so inspect module mode.", "ES modules require explicit local extensions.", "Import ./config.js."],
  },
  {
    id: "node-port", title: "EADDRINUSE: port already in use", environment: "node", category: "Runtime", difficulty: "Beginner", estimatedTime: "8 min", fileName: "server.js", language: "javascript", starterCode: "server.listen(3000);\n", reproduceCommand: "npm start", errorOutput: "Error: listen EADDRINUSE: address already in use :::3000\ncode: 'EADDRINUSE'\nport: 3000", diagnosticCommands: { "netstat -ano | findstr :3000": "TCP  0.0.0.0:3000  LISTENING  18420", "lsof -i :3000": "node 18420 user 23u IPv6 TCP *:3000 (LISTEN)" }, fixCommand: "set PORT=3001", fixPatterns: ["port=3001", "kill 18420", "taskkill /pid 18420"], successOutput: "$ npm start\nlistening on http://localhost:3001\n\n✓ Port is available", hints: ["Find the process that owns port 3000.", "Stop it or choose another port.", "Set PORT=3001 for this run."],
  },
  {
    id: "js-undefined", title: "Cannot read properties of undefined", environment: "javascript", category: "Runtime", difficulty: "Beginner", estimatedTime: "7 min", fileName: "profile.js", language: "javascript", starterCode: "const user = {};\nconsole.log(user.profile.name);\n", reproduceCommand: "node profile.js", errorOutput: "TypeError: Cannot read properties of undefined (reading 'name')\n    at profile.js:2:26", diagnosticCommands: { "node --trace-uncaught profile.js": "Thrown at profile.js:2:26\nuser.profile is undefined" }, fixCommand: "use optional chaining", fixPatterns: ["optional chaining", "?.name", "?? 'guest'", "?? \"guest\""], successOutput: "$ node profile.js\nGuest\n\n✓ Missing data state handled", hints: ["The user object exists; profile does not.", "Guard the nullable boundary.", "Use ?. and a fallback."],
  },
  {
    id: "js-promise", title: "Unhandled promise rejection", environment: "javascript", category: "Async", difficulty: "Intermediate", estimatedTime: "12 min", fileName: "sync.js", language: "javascript", starterCode: "syncAccount();\nconsole.log('done');\n", reproduceCommand: "node sync.js", errorOutput: "UnhandledPromiseRejection: Error: API returned 503\nThe promise rejection was not handled", diagnosticCommands: { "node --unhandled-rejections=strict sync.js": "Error: API returned 503\n    at syncAccount (sync.js:8:9)" }, fixCommand: "await and catch", fixPatterns: ["await and catch", "try", ".catch("], successOutput: "$ node sync.js\nRetry scheduled\ndone\n\n✓ Rejection handled", hints: ["The async function returns a promise.", "The caller must await or attach catch.", "Handle the rejected path explicitly."],
  },
  {
    id: "git-not-repo", title: "fatal: not a git repository", environment: "git", category: "Repository", difficulty: "Beginner", estimatedTime: "5 min", fileName: "terminal", language: "shell", starterCode: "$ git status\n", reproduceCommand: "git status", errorOutput: "fatal: not a git repository (or any of the parent directories): .git", diagnosticCommands: { "pwd": "/home/dev/downloads/project-copy", "ls -la": ".  ..  src  package.json" }, fixCommand: "git init", fixPatterns: ["git init", "cd /home/dev/project"], successOutput: "Initialized empty Git repository in /home/dev/downloads/project-copy/.git/\n$ git status\nOn branch main\n\n✓ Repository ready", hints: ["Check the current directory.", "Look for a .git folder.", "Move to the repo or initialize one."],
  },
  {
    id: "git-rejected", title: "git push rejected: fetch first", environment: "git", category: "Remote", difficulty: "Intermediate", estimatedTime: "14 min", fileName: "terminal", language: "shell", starterCode: "$ git push origin main\n", reproduceCommand: "git push origin main", errorOutput: "! [rejected] main -> main (fetch first)\nerror: failed to push some refs\nhint: Updates were rejected because the remote contains work", diagnosticCommands: { "git log --oneline --all --graph -5": "* a42d local change\n| * c19f remote change\n|/\n* 991a base", "git status": "On branch main\nYour branch and 'origin/main' have diverged" }, fixCommand: "git pull --rebase", fixPatterns: ["git pull --rebase", "git fetch", "git rebase origin/main"], successOutput: "$ git pull --rebase origin main\nSuccessfully rebased\n$ git push origin main\nmain -> main\n\n✓ Remote synchronized", hints: ["Do not force push immediately.", "Inspect how local and remote diverged.", "Rebase local work onto origin/main."],
  },
  {
    id: "git-conflict", title: "Merge conflict in config file", environment: "git", category: "Merge", difficulty: "Intermediate", estimatedTime: "15 min", fileName: "src/config.js", language: "diff", starterCode: "<<<<<<< HEAD\nexport const API='/api';\n=======\nexport const API='https://api.test';\n>>>>>>> feature\n", reproduceCommand: "git merge feature", errorOutput: "CONFLICT (content): Merge conflict in src/config.js\nAutomatic merge failed; fix conflicts and then commit the result.", diagnosticCommands: { "git status": "both modified: src/config.js", "git diff --check": "src/config.js:1: leftover conflict marker" }, fixCommand: "resolve markers and git add", fixPatterns: ["git add src/config.js", "resolve markers"], successOutput: "$ git diff --check\n$ git commit -m \"resolve config conflict\"\n[main 7ca2] resolve config conflict\n\n✓ Merge completed", hints: ["Open the file Git named.", "Choose or combine both sides.", "Remove markers, add, then commit."],
  },
  {
    id: "powershell-policy", title: "Running scripts is disabled", environment: "powershell", category: "Permission", difficulty: "Beginner", estimatedTime: "8 min", fileName: "setup.ps1", language: "powershell", starterCode: "Write-Host 'Setup complete'\n", reproduceCommand: ".\\setup.ps1", errorOutput: ".\\setup.ps1 cannot be loaded because running scripts is disabled on this system.\nPSSecurityException", diagnosticCommands: { "Get-ExecutionPolicy -List": "CurrentUser Undefined\nLocalMachine Restricted" }, fixCommand: "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser", fixPatterns: ["set-executionpolicy remotesigned -scope currentuser", "powershell -executionpolicy bypass"], successOutput: "Execution Policy Change\n$ .\\setup.ps1\nSetup complete\n\n✓ Script executed", hints: ["Inspect policy by scope.", "Avoid weakening the entire machine.", "Use CurrentUser with RemoteSigned."],
  },
  {
    id: "powershell-command", title: "The term npm is not recognized", environment: "powershell", category: "PATH", difficulty: "Beginner", estimatedTime: "9 min", fileName: "$PROFILE", language: "powershell", starterCode: "$env:Path\n", reproduceCommand: "npm --version", errorOutput: "npm : The term 'npm' is not recognized as the name of a cmdlet, function, script file, or operable program.", diagnosticCommands: { "Get-Command node -ErrorAction SilentlyContinue": "", "$env:Path -split ';'": "C:\\Windows\\System32\nC:\\Windows" }, fixCommand: "add Node.js to PATH", fixPatterns: ["add node.js to path", "c:\\program files\\nodejs", "refreshenv"], successOutput: "$ npm --version\n10.8.2\n\n✓ Node.js is available in PowerShell", hints: ["Check whether node is discoverable.", "Inspect PATH entries.", "Add the Node installation directory and reopen the shell."],
  },
  {
    id: "cmd-python", title: "'python' is not recognized", environment: "cmd", category: "PATH", difficulty: "Beginner", estimatedTime: "8 min", fileName: "Command Prompt", language: "cmd", starterCode: "C:\\project> python app.py\n", reproduceCommand: "python app.py", errorOutput: "'python' is not recognized as an internal or external command,\noperable program or batch file.", diagnosticCommands: { "where python": "INFO: Could not find files for the given pattern(s).", "py --version": "Python 3.12.4" }, fixCommand: "py app.py", fixPatterns: ["py app.py", "add python to path"], successOutput: "C:\\project> py app.py\nApplication started\n\n✓ Python launcher resolved", hints: ["Windows may have the py launcher even when python is absent.", "Run py --version.", "Use py or fix PATH."],
  },
  {
    id: "cmd-access", title: "Access is denied", environment: "cmd", category: "Permission", difficulty: "Intermediate", estimatedTime: "10 min", fileName: "Command Prompt", language: "cmd", starterCode: "C:\\project> del build\\app.exe\n", reproduceCommand: "del build\\app.exe", errorOutput: "Access is denied.\nThe process cannot access the file because it is being used by another process.", diagnosticCommands: { "tasklist | findstr app.exe": "app.exe  14280 Console  1  48,112 K", "handle build\\app.exe": "app.exe pid: 14280 type: File" }, fixCommand: "taskkill /PID 14280 /F", fixPatterns: ["taskkill /pid 14280 /f", "stop app.exe"], successOutput: "SUCCESS: The process with PID 14280 has been terminated.\nC:\\project> del build\\app.exe\n\n✓ Locked file removed", hints: ["The message names a file lock.", "Find the process using the file.", "Stop PID 14280, then retry."],
  },
  {
    id: "vscode-interpreter", title: "Pylance cannot resolve installed import", environment: "vscode", category: "Configuration", difficulty: "Beginner", estimatedTime: "10 min", fileName: ".vscode/settings.json", language: "json", starterCode: "{\n  \"python.defaultInterpreterPath\": \"C:/Python311/python.exe\"\n}\n", reproduceCommand: "Python: Run Current File", errorOutput: "Pylance: Import 'requests' could not be resolved\nTerminal shows requests 2.32.3 is installed in .venv", diagnosticCommands: { "Python: Select Interpreter": "Current: C:\\Python311\\python.exe\nAvailable: .venv\\Scripts\\python.exe", "python -c \"import sys; print(sys.executable)\"": "C:\\project\\.venv\\Scripts\\python.exe" }, fixCommand: "select .venv interpreter", fixPatterns: ["select .venv interpreter", "${workspacefolder}/.venv", ".venv/scripts/python.exe"], successOutput: "Python interpreter changed to .venv\\Scripts\\python.exe\nPylance: 0 unresolved imports\n\n✓ Editor and terminal aligned", hints: ["The package is installed somewhere.", "Compare editor and terminal interpreters.", "Select the project .venv in VS Code."],
  },
  {
    id: "vscode-code-command", title: "code: command not found", environment: "vscode", category: "PATH", difficulty: "Beginner", estimatedTime: "7 min", fileName: "VS Code terminal", language: "shell", starterCode: "$ code .\n", reproduceCommand: "code .", errorOutput: "bash: code: command not found", diagnosticCommands: { "which code": "", "echo $PATH": "/usr/local/bin:/usr/bin:/bin" }, fixCommand: "install code command in PATH", fixPatterns: ["install code command in path", "shell command: install 'code' command"], successOutput: "$ code .\nOpening workspace...\n\n✓ VS Code CLI available", hints: ["The editor may be installed while its CLI is not on PATH.", "Use the Command Palette.", "Run Shell Command: Install 'code' command in PATH."],
  },
  {
    id: "bash-permission", title: "Permission denied running deploy.sh", environment: "bash", category: "Permission", difficulty: "Beginner", estimatedTime: "6 min", fileName: "deploy.sh", language: "bash", starterCode: "#!/usr/bin/env bash\necho 'Deploy complete'\n", reproduceCommand: "./deploy.sh", errorOutput: "bash: ./deploy.sh: Permission denied", diagnosticCommands: { "ls -l deploy.sh": "-rw-r--r-- 1 dev dev 42 Aug 8 10:00 deploy.sh" }, fixCommand: "chmod u+x deploy.sh", fixPatterns: ["chmod u+x deploy.sh", "chmod +x deploy.sh"], successOutput: "$ chmod u+x deploy.sh\n$ ./deploy.sh\nDeploy complete\n\n✓ Execute permission verified", hints: ["Read the owner permission bits.", "The script has read and write, but no execute.", "Add execute permission for the owner."],
  },
  {
    id: "bash-command", title: "command not found after install", environment: "bash", category: "PATH", difficulty: "Intermediate", estimatedTime: "11 min", fileName: ".bashrc", language: "bash", starterCode: "export PATH=\"/usr/bin:/bin\"\n", reproduceCommand: "devfixes-cli", errorOutput: "bash: devfixes-cli: command not found", diagnosticCommands: { "find ~/.local/bin -name devfixes-cli": "/home/dev/.local/bin/devfixes-cli", "echo $PATH": "/usr/bin:/bin" }, fixCommand: "export PATH=$HOME/.local/bin:$PATH", fixPatterns: [".local/bin:$path", "source ~/.bashrc"], successOutput: "$ source ~/.bashrc\n$ devfixes-cli --version\n1.0.0\n\n✓ User binary path loaded", hints: ["Find where the binary was installed.", "Compare that directory with PATH.", "Add ~/.local/bin and reload the shell."],
  },
];

export function getUniversalScenario(id: string) {
  return universalScenarios.find((scenario) => scenario.id === id);
}
