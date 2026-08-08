export type LabLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type LabChallenge = {
  id: string;
  title: string;
  level: LabLevel;
  estimatedTime: string;
  objective: string;
  skills: string[];
  fileName: string;
  language: string;
  initialCode: string;
  fixedCode: string;
  errorOutput: string;
  successOutput: string;
  fixTokens: string[];
  forbiddenTokens?: string[];
  hints: string[];
  rootCause: string;
  professionalDiagnosis: string;
  prevention: string;
  commands: Record<string, string>;
};

export type LabDefinition = {
  slug: string;
  name: string;
  icon: string;
  group: "Languages" | "Systems" | "Tools" | "Cloud" | "AI";
  description: string;
  difficulty: LabLevel;
  estimatedTime: string;
  skills: string[];
  challengeCount: number;
  challenges: LabChallenge[];
};

const pythonChallenge: LabChallenge = {
  id: "python-missing-package",
  title: "The package that exists in the wrong environment",
  level: "Beginner",
  estimatedTime: "12 min",
  objective: "Diagnose why the import fails and repair the project without using a global install.",
  skills: ["Traceback reading", "pip", "virtual environments"],
  fileName: "requirements.txt",
  language: "text",
  initialCode: `# dependencies for checkout
# add the project packages here`,
  fixedCode: `# dependencies for checkout
requests>=2.32.0`,
  errorOutput: `Traceback (most recent call last):
  File "checkout.py", line 1, in <module>
    import requests
ModuleNotFoundError: No module named 'requests'

Simulator: the active interpreter has no requests package.`,
  successOutput: `$ python -m pip install requests
Successfully installed requests

$ python checkout.py
200

Mission complete. The dependency is installed into the interpreter that runs the project.`,
  fixTokens: ["requests>=2.32.0"],
  hints: [
    "Start with the first project-owned line in the traceback, not the final exception name.",
    "The import is valid Python. The active environment is missing the dependency.",
    "Use python -m pip so the installer is tied to the interpreter running checkout.py.",
  ],
  rootCause: "The project runs with an interpreter that does not contain requests.",
  professionalDiagnosis: "A professional compares the Python executable and pip target before changing application code.",
  prevention: "Create a .venv per project and record dependencies in requirements.txt.",
  commands: {
    "python -m pip --version": "pip 24.2 from .venv\\Lib\\site-packages (python 3.12)",
    "python -c \"import sys; print(sys.executable)\"": "C:\\projects\\checkout\\.venv\\Scripts\\python.exe",
    "python -m pip install requests": "Successfully installed requests",
  },
};

const reactChallenge: LabChallenge = {
  id: "react-render-loop",
  title: "The component that updates itself forever",
  level: "Beginner",
  estimatedTime: "10 min",
  objective: "Stop a render loop while preserving the counter behavior.",
  skills: ["React state", "effects", "render diagnostics"],
  fileName: "Counter.jsx",
  language: "jsx",
  initialCode: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <button>{count}</button>;
}`,
  fixedCode: `import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount((value) => value + 1);
  }, []);
  return <button>{count}</button>;
}`,
  errorOutput: `Error: Too many re-renders. React limits the number of renders
to prevent an infinite loop.

Problem line: setCount(count + 1)
The state update runs during every render.`,
  successOutput: `$ npm run dev
compiled successfully

Counter mounted once.
Rendered count: 1

Mission complete. The state update now runs in a controlled effect.`,
  fixTokens: ["useEffect", "}, []"],
  hints: [
    "A render should describe the UI. Ask which line causes a state update while React is rendering.",
    "Move the update into a lifecycle boundary that runs after the first render.",
    "An empty dependency array makes this setup effect run once.",
  ],
  rootCause: "setCount runs during render, triggering another render before the current one can finish.",
  professionalDiagnosis: "React render loops are diagnosed by locating state setters in the render path and checking effect dependencies.",
  prevention: "Keep render functions pure and test effect dependencies with the React Hooks lint rules.",
  commands: {
    "npm run dev": "ready - started server on http://localhost:3000",
    "npm run lint": "0 problems found",
  },
};

const javascriptChallenge: LabChallenge = {
  id: "javascript-undefined-property",
  title: "The API response that is not ready yet",
  level: "Beginner",
  estimatedTime: "8 min",
  objective: "Make the UI safe when the profile response has not arrived.",
  skills: ["JavaScript guards", "optional chaining", "data states"],
  fileName: "profile.js",
  language: "javascript",
  initialCode: `const user = {};

console.log(user.profile.name);
console.log("Profile rendered");`,
  fixedCode: `const user = {};

console.log(user.profile?.name ?? "Guest");
console.log("Profile rendered");`,
  errorOutput: `TypeError: Cannot read properties of undefined (reading 'name')
    at profile.js:3:27

The API object is empty during the loading state.`,
  successOutput: `$ node profile.js
Guest
Profile rendered

Mission complete. The loading state no longer crashes the render.`,
  fixTokens: ["?.name", "?? \"Guest\""],
  hints: [
    "The object exists, but the nested profile value does not.",
    "Guard the nested access at the point where data may still be loading.",
    "Optional chaining prevents the read; nullish coalescing supplies a useful fallback.",
  ],
  rootCause: "The code reads name before profile exists on the response object.",
  professionalDiagnosis: "A professional identifies the first nullable boundary and makes the UI explicit about loading, empty, and ready states.",
  prevention: "Model API states instead of assuming every response is complete.",
  commands: {
    "node profile.js": "Guest\nProfile rendered",
  },
};

const nodeChallenge: LabChallenge = {
  id: "node-missing-port",
  title: "The server listening on an undefined port",
  level: "Beginner",
  estimatedTime: "10 min",
  objective: "Make the service start locally and in production when PORT is optional.",
  skills: ["Node.js", "environment variables", "safe defaults"],
  fileName: "server.js",
  language: "javascript",
  initialCode: `import http from "node:http";

const PORT = process.env.APP_PORT;

http.createServer((_request, response) => {
  response.end("ok");
}).listen(PORT);`,
  fixedCode: `import http from "node:http";

const PORT = Number(process.env.PORT ?? process.env.APP_PORT ?? 3000);

http.createServer((_request, response) => {
  response.end("ok");
}).listen(PORT, () => {
  console.log(\`listening on \${PORT}\`);
});`,
  errorOutput: `RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and < 65536.
Received undefined.

npm ERR! code ELIFECYCLE
npm ERR! command failed`,
  successOutput: `$ npm start
listening on 3000

GET / 200
Service healthy.`,
  fixTokens: ["Number(process.env.PORT ?? process.env.APP_PORT ?? 3000)", "listening on"],
  hints: [
    "Inspect the value passed into listen. Which environment variable is guaranteed to exist locally?",
    "Production platforms usually provide PORT. Your local shell may provide neither name.",
    "Normalize the value to a number and keep a safe local default.",
  ],
  rootCause: "The server passes an undefined environment variable to listen instead of using a default port.",
  professionalDiagnosis: "A professional treats environment variables as untrusted input and validates them at startup.",
  prevention: "Validate configuration once during boot and fail with a clear message when a required value is missing.",
  commands: {
    "npm start": "listening on 3000",
    "echo $PORT": "3000",
  },
};

const dockerChallenge: LabChallenge = {
  id: "docker-port-conflict",
  title: "The container that cannot claim the host port",
  level: "Beginner",
  estimatedTime: "12 min",
  objective: "Resolve a host port collision without changing the container port.",
  skills: ["Docker", "port mapping", "compose diagnostics"],
  fileName: "docker-compose.yml",
  language: "yaml",
  initialCode: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    command: npm start`,
  fixedCode: `services:
  api:
    build: .
    ports:
      - "3001:3000"
    command: npm start`,
  errorOutput: `docker: Error response from daemon:
Bind for 0.0.0.0:3000 failed: port is already allocated.

Hint: another local service already owns host port 3000.`,
  successOutput: `$ docker compose up
[+] Running 1/1
 ✔ Container api-1  Started

api-1 | listening on 3000
Host URL: http://localhost:3001`,
  fixTokens: ["3001:3000"],
  hints: [
    "The application still listens on port 3000 inside its container.",
    "Only the host side of the mapping is colliding with another process.",
    "Change the first number in the mapping and keep the second number unchanged.",
  ],
  rootCause: "The host port 3000 is already occupied, so Docker cannot bind it twice.",
  professionalDiagnosis: "A professional separates host networking from container networking before changing the application.",
  prevention: "Document local port assignments and use environment-driven compose overrides.",
  commands: {
    "docker ps": "checkout-api   0.0.0.0:3000->3000/tcp",
    "docker compose up": "Container api-1 Started",
  },
};

const gitChallenge: LabChallenge = {
  id: "git-conflict-resolution",
  title: "The merge conflict in the release branch",
  level: "Intermediate",
  estimatedTime: "15 min",
  objective: "Resolve the conflict, preserve both intended changes, and verify the merge.",
  skills: ["Git", "conflict markers", "verification"],
  fileName: "src/config.js",
  language: "diff",
  initialCode: `<<<<<<< HEAD
export const API_URL = "/api";
=======
export const API_URL = "https://api.devfixes.test";
>>>>>>> feature/remote-api

export const RETRIES = 3;`,
  fixedCode: `export const API_URL = process.env.API_URL ?? "/api";

export const RETRIES = 3;`,
  errorOutput: `Auto-merging src/config.js
CONFLICT (content): Merge conflict in src/config.js
Automatic merge failed; fix conflicts and then commit the result.

Git is waiting for conflict markers to be removed.`,
  successOutput: `$ git add src/config.js
$ git commit -m "Resolve API configuration merge"
[main 4d2f7a1] Resolve API configuration merge

Merge verified. Both local defaults and deployment configuration are preserved.`,
  fixTokens: ["process.env.API_URL ?? \"/api\"", "RETRIES = 3"],
  forbiddenTokens: ["<<<<<<<", "=======", ">>>>>>>"],
  hints: [
    "Conflict markers are instructions for you, not valid JavaScript.",
    "Keep the local default and allow deployment configuration to override it.",
    "After editing, verify no conflict marker remains before staging the file.",
  ],
  rootCause: "Two branches changed the same configuration line and Git could not choose a winner.",
  professionalDiagnosis: "A professional resolves intent, not text: preserve behavior for each environment, then stage and verify.",
  prevention: "Keep environment configuration separate from source defaults and merge small changes frequently.",
  commands: {
    "git status": "both modified: src/config.js",
    "git add src/config.js": "staged src/config.js",
    "git diff --check": "clean",
  },
};

const vscodeChallenge: LabChallenge = {
  id: "vscode-interpreter-mismatch",
  title: "The editor using the wrong Python",
  level: "Beginner",
  estimatedTime: "9 min",
  objective: "Point the editor at the project virtual environment so analysis matches the terminal.",
  skills: ["VS Code", "Python interpreter", "editor diagnostics"],
  fileName: ".vscode/settings.json",
  language: "json",
  initialCode: `{
  "python.defaultInterpreterPath": "C:/Python311/python.exe",
  "python.analysis.typeCheckingMode": "basic"
}`,
  fixedCode: `{
  "python.defaultInterpreterPath": "\${workspaceFolder}/.venv/Scripts/python.exe",
  "python.analysis.typeCheckingMode": "basic"
}`,
  errorOutput: `Pylance: Import "requests" could not be resolved
Terminal: requests 2.32.3 is installed

The terminal and editor are using different Python interpreters.`,
  successOutput: `Python: Select Interpreter
✓ .venv\\Scripts\\python.exe

Pylance: 0 unresolved imports
Problems panel cleared.`,
  fixTokens: ["${workspaceFolder}/.venv/Scripts/python.exe"],
  hints: [
    "The terminal already proves the package is installed. Compare the interpreter paths.",
    "The setting points to a machine-specific global Python installation.",
    "Use the workspace variable so the setting follows the project.",
  ],
  rootCause: "VS Code analyzes the project with a global interpreter instead of .venv.",
  professionalDiagnosis: "A professional checks runtime, editor, test runner, and language server paths as separate configuration surfaces.",
  prevention: "Commit workspace settings that select the project environment without embedding a personal absolute path.",
  commands: {
    "code --status": "Visual Studio Code 1.104\nworkspace: checkout",
  },
};

const linuxChallenge: LabChallenge = {
  id: "linux-script-permission",
  title: "The deploy script that cannot execute",
  level: "Beginner",
  estimatedTime: "8 min",
  objective: "Diagnose a permission failure and make the script executable without changing its contents.",
  skills: ["Linux", "file permissions", "shell"],
  fileName: "terminal.sh",
  language: "bash",
  initialCode: `$ ./deploy.sh
bash: ./deploy.sh: Permission denied

$ ls -l deploy.sh
-rw-r--r-- 1 deploy devfixes 312 Jul 31 09:10 deploy.sh`,
  fixedCode: `$ chmod u+x deploy.sh
$ ./deploy.sh
Deploy complete`,
  errorOutput: `bash: ./deploy.sh: Permission denied

The owner can read the file but does not have execute permission.`,
  successOutput: `$ chmod u+x deploy.sh
$ ./deploy.sh
Deploy complete
Health check: 200`,
  fixTokens: ["chmod u+x deploy.sh", "Deploy complete"],
  hints: [
    "Read the permission bits from left to right. Which permission is missing for the owner?",
    "The script content is fine; the filesystem controls whether it can run.",
    "Add execute permission for the owner instead of opening the file to everyone.",
  ],
  rootCause: "The file mode does not include the execute bit for its owner.",
  professionalDiagnosis: "A professional changes the smallest permission scope needed and checks the resulting mode.",
  prevention: "Set executable bits in version control and avoid broad chmod 777 fixes.",
  commands: {
    "ls -l deploy.sh": "-rw-r--r-- 1 deploy devfixes 312 Jul 31 09:10 deploy.sh",
    "chmod u+x deploy.sh": "permission updated",
  },
};

const databaseChallenge: LabChallenge = {
  id: "database-missing-migration",
  title: "The API querying a table that was never migrated",
  level: "Intermediate",
  estimatedTime: "14 min",
  objective: "Repair the migration path and verify the API query against the new table.",
  skills: ["PostgreSQL", "migrations", "schema diagnosis"],
  fileName: "migrations/004_users.sql",
  language: "sql",
  initialCode: `-- deploy the users table before the API starts
SELECT * FROM users;

-- TODO: create the table`,
  fixedCode: `CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE
);

SELECT * FROM users;`,
  errorOutput: `ERROR: relation "users" does not exist
STATEMENT: SELECT * FROM users;

Migration 004 failed. The API cannot boot against an incomplete schema.`,
  successOutput: `$ psql -f migrations/004_users.sql
CREATE TABLE
 id | email
----+-------
(0 rows)

Migration complete. API health check: 200`,
  fixTokens: ["CREATE TABLE IF NOT EXISTS users", "email text NOT NULL UNIQUE"],
  hints: [
    "The database is reachable. This is a schema state problem, not an authentication problem.",
    "Create the relation before selecting from it.",
    "Make the migration safe to run more than once with IF NOT EXISTS.",
  ],
  rootCause: "The deployment runs a query before the users table exists.",
  professionalDiagnosis: "A professional separates connectivity, permissions, migration order, and query correctness.",
  prevention: "Run migrations as a release step and make schema changes observable and repeatable.",
  commands: {
    "select current_database();": "devfixes",
    "psql -f migrations/004_users.sql": "CREATE TABLE\n(0 rows)",
  },
};

const cloudChallenge: LabChallenge = {
  id: "cloud-lambda-timeout",
  title: "The function that times out on a large batch",
  level: "Advanced",
  estimatedTime: "16 min",
  objective: "Bound the work performed in one invocation so the health check completes.",
  skills: ["AWS Lambda", "timeouts", "bounded work"],
  fileName: "handler.mjs",
  language: "javascript",
  initialCode: `export async function handler(event) {
  const pages = await loadAllPages(event.accountId);
  for (const page of pages) {
    await indexPage(page);
  }
  return { statusCode: 200 };
}`,
  fixedCode: `export async function handler(event) {
  const pages = await loadAllPages(event.accountId);
  for (const page of pages.slice(0, 100)) {
    await indexPage(page);
  }
  return { statusCode: 200 };
}`,
  errorOutput: `START RequestId: 2f81
Task timed out after 3.00 seconds
END RequestId: 2f81

The account contains 4,812 pages. One invocation tries to process all of them.`,
  successOutput: `START RequestId: 2f81
Indexed 100 pages
END RequestId: 2f81
REPORT Duration: 842 ms

Mission complete. The remaining work can continue through queued invocations.`,
  fixTokens: ["pages.slice(0, 100)"],
  hints: [
    "The function is healthy until the input grows. Inspect the unbounded loop.",
    "A serverless invocation has a hard execution budget.",
    "Bound one batch and move the remaining work to a queue or continuation.",
  ],
  rootCause: "The function performs unbounded work inside a fixed-time serverless invocation.",
  professionalDiagnosis: "A professional turns workload size into an explicit limit and designs a continuation path.",
  prevention: "Track duration percentiles and load-test with production-sized inputs before deployment.",
  commands: {
    "sam logs -n IndexerFunction": "Task timed out after 3.00 seconds",
    "aws lambda invoke --function-name indexer response.json": "StatusCode: 200",
  },
};

const aiCodingChallenge: LabChallenge = {
  id: "ai-model-not-found",
  title: "The local coding assistant cannot find its model",
  level: "Beginner",
  estimatedTime: "10 min",
  objective: "Inspect the installed models and launch the assistant with an available tag.",
  skills: ["Ollama", "local models", "AI tooling"],
  fileName: "assistant.config.json",
  language: "json",
  initialCode: `{
  "provider": "ollama",
  "model": "llama3.2",
  "baseUrl": "http://localhost:11434"
}`,
  fixedCode: `{
  "provider": "ollama",
  "model": "qwen2.5:7b",
  "baseUrl": "http://localhost:11434"
}`,
  errorOutput: `Error: model "llama3.2" not found
Run "ollama list" to see available models.

The Ollama service is reachable, but the configured model tag is not installed.`,
  successOutput: `$ ollama list
qwen2.5:7b    4.7 GB

Assistant connected to qwen2.5:7b
Ready for inline completion.`,
  fixTokens: ["qwen2.5:7b"],
  hints: [
    "The service is reachable, so do not reinstall Ollama yet.",
    "Model names are tags. Inspect the local list before choosing a configuration value.",
    "Replace the unavailable tag with the installed qwen2.5:7b model.",
  ],
  rootCause: "The assistant requests a model tag that is not installed locally.",
  professionalDiagnosis: "A professional checks service health, inventory, configuration, and permissions in that order.",
  prevention: "Pin model tags in setup documentation and validate them during startup.",
  commands: {
    "ollama list": "qwen2.5:7b    4.7 GB",
    "ollama ps": "NAME           STATUS\nqwen2.5:7b     running",
  },
};

export const labs: LabDefinition[] = [
  {
    slug: "python",
    name: "Python Lab",
    icon: "python",
    group: "Languages",
    description: "Tracebacks, imports, environments, and the habits that make Python failures predictable.",
    difficulty: "Beginner",
    estimatedTime: "45 min",
    skills: ["Tracebacks", "pip", "virtual environments"],
    challengeCount: 12,
    challenges: [pythonChallenge],
  },
  {
    slug: "react",
    name: "React Lab",
    icon: "react",
    group: "Languages",
    description: "Find render loops, state mistakes, hydration mismatches, and data-loading bugs.",
    difficulty: "Beginner",
    estimatedTime: "50 min",
    skills: ["State", "effects", "components"],
    challengeCount: 10,
    challenges: [reactChallenge],
  },
  {
    slug: "javascript",
    name: "JavaScript Lab",
    icon: "javascript",
    group: "Languages",
    description: "Debug runtime exceptions, async boundaries, and unsafe assumptions in browser code.",
    difficulty: "Beginner",
    estimatedTime: "40 min",
    skills: ["Runtime errors", "async code", "data states"],
    challengeCount: 11,
    challenges: [javascriptChallenge],
  },
  {
    slug: "node",
    name: "Node.js Lab",
    icon: "node",
    group: "Languages",
    description: "Repair package scripts, environment variables, ports, and broken service startup.",
    difficulty: "Beginner",
    estimatedTime: "55 min",
    skills: ["npm", "configuration", "servers"],
    challengeCount: 12,
    challenges: [nodeChallenge],
  },
  {
    slug: "docker",
    name: "Docker Lab",
    icon: "docker",
    group: "Systems",
    description: "Investigate images, containers, networks, volumes, compose, and deployment failures.",
    difficulty: "Intermediate",
    estimatedTime: "60 min",
    skills: ["Compose", "ports", "containers"],
    challengeCount: 10,
    challenges: [dockerChallenge],
  },
  {
    slug: "git",
    name: "Git Lab",
    icon: "git",
    group: "Tools",
    description: "Practice conflicts, rebases, detached HEAD states, and safe recovery workflows.",
    difficulty: "Intermediate",
    estimatedTime: "50 min",
    skills: ["Conflicts", "history", "recovery"],
    challengeCount: 10,
    challenges: [gitChallenge],
  },
  {
    slug: "vscode",
    name: "VS Code Lab",
    icon: "vscode",
    group: "Tools",
    description: "Use an editor-like workspace to diagnose interpreters, extensions, and Problems panel noise.",
    difficulty: "Beginner",
    estimatedTime: "45 min",
    skills: ["Interpreters", "Pylance", "settings"],
    challengeCount: 9,
    challenges: [vscodeChallenge],
  },
  {
    slug: "linux",
    name: "Linux Lab",
    icon: "linux",
    group: "Systems",
    description: "Work through permissions, processes, networking, SSH, and shell failures in a safe terminal.",
    difficulty: "Beginner",
    estimatedTime: "55 min",
    skills: ["Bash", "permissions", "processes"],
    challengeCount: 12,
    challenges: [linuxChallenge],
  },
  {
    slug: "database",
    name: "Database Lab",
    icon: "database",
    group: "Systems",
    description: "Separate connection, authentication, migration, schema, and query failures.",
    difficulty: "Intermediate",
    estimatedTime: "65 min",
    skills: ["PostgreSQL", "migrations", "schema"],
    challengeCount: 11,
    challenges: [databaseChallenge],
  },
  {
    slug: "cloud",
    name: "Cloud Lab",
    icon: "cloud",
    group: "Cloud",
    description: "Recover serverless, deployment, permissions, and production reliability incidents.",
    difficulty: "Advanced",
    estimatedTime: "70 min",
    skills: ["Lambda", "observability", "limits"],
    challengeCount: 8,
    challenges: [cloudChallenge],
  },
  {
    slug: "ai-coding",
    name: "AI Coding Lab",
    icon: "ai",
    group: "AI",
    description: "Debug local models, coding agents, extension setup, provider configuration, and quotas.",
    difficulty: "Beginner",
    estimatedTime: "40 min",
    skills: ["Ollama", "models", "agent setup"],
    challengeCount: 9,
    challenges: [aiCodingChallenge],
  },
];

export function getLab(slug: string) {
  return labs.find((lab) => lab.slug === slug);
}
