import "server-only";

import { Sandbox } from "e2b";
import { labs } from "@/lib/labs-data";

type VerificationDefinition = {
  command: string;
  verifier?: string;
};

const verifications: Record<string, VerificationDefinition> = {
  "python-missing-package": {
    command: "python3 verify.py",
    verifier: `from pathlib import Path
import re

content = Path("requirements.txt").read_text()
matched = re.search(r"(?mi)^\\s*requests(?:\\s*[<>=!~]=?\\s*[0-9][^\\s#]*)?\\s*(?:#.*)?$", content)
if not matched:
    raise SystemExit("FAIL: requirements.txt does not declare requests with a valid package specifier")
print("PASS: Python parsed requirements.txt and found a project-scoped requests dependency")
`,
  },
  "react-render-loop": {
    command: "node verify.mjs",
    verifier: `import { readFile } from "node:fs/promises";

const code = await readFile("Counter.jsx", "utf8");
const importsEffect = /import\\s*\\{[^}]*useEffect[^}]*\\}\\s*from\\s*["']react["']/.test(code);
const effectContainsSetter = /useEffect\\s*\\(\\s*\\(\\)\\s*=>\\s*\\{[\\s\\S]*setCount\\s*\\(/.test(code);
const emptyDependencies = /useEffect\\s*\\([\\s\\S]*?\\},\\s*\\[\\s*\\]\\s*\\)/.test(code);
const setterBeforeReturn = code.slice(0, code.indexOf("return")).split(/useEffect/)[0].includes("setCount(");
if (!importsEffect || !effectContainsSetter || !emptyDependencies || setterBeforeReturn) {
  console.error("FAIL: the state update is still in the render path or the effect is not bounded");
  process.exit(1);
}
console.log("PASS: the React fix keeps render pure and bounds the state update to a mount effect");
`,
  },
  "javascript-undefined-property": {
    command: "node profile.js",
  },
  "node-missing-port": {
    command: "node verify.mjs",
    verifier: `import { spawn } from "node:child_process";

const child = spawn(process.execPath, ["server.js"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: "3210", APP_PORT: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
let stdout = "";
let stderr = "";
child.stdout.on("data", (chunk) => { stdout += chunk; });
child.stderr.on("data", (chunk) => { stderr += chunk; });
const deadline = setTimeout(() => child.kill("SIGKILL"), 3500);
try {
  await new Promise((resolve, reject) => {
    const poll = setInterval(async () => {
      if (!/listening on 3210/i.test(stdout)) return;
      clearInterval(poll);
      try {
        const response = await fetch("http://127.0.0.1:3210");
        const body = await response.text();
        if (response.ok && body === "ok") resolve(undefined);
        else reject(new Error("The server did not return the expected response."));
      } catch (error) {
        reject(error);
      }
    }, 80);
    child.once("exit", (code) => reject(new Error(stderr || "Server exited with code " + code)));
    setTimeout(() => reject(new Error(stderr || "Server did not become healthy before the timeout.")), 3000);
  });
  console.log(stdout.trim());
  console.log("PASS: the Node service listened on PORT and returned a healthy response");
} finally {
  clearTimeout(deadline);
  child.kill("SIGKILL");
}
`,
  },
  "docker-port-conflict": {
    command: "python3 verify.py",
    verifier: `from pathlib import Path

content = Path("docker-compose.yml").read_text().replace(" ", "")
if "8081:80" not in content or "8080:80" in content:
    raise SystemExit("FAIL: the compose file still binds the occupied host port 8080")
print("PASS: the compose configuration now maps the service to the free host port 8081")
`,
  },
  "git-conflict-resolution": {
    command: "git init -q && git add src/config.js && git diff --cached --check",
  },
  "vscode-interpreter-mismatch": {
    command: "node verify.mjs",
    verifier: `import { readFile } from "node:fs/promises";

const settings = JSON.parse(await readFile(".vscode/settings.json", "utf8"));
const interpreter = settings["python.defaultInterpreterPath"];
if (interpreter !== "\${workspaceFolder}/.venv/Scripts/python.exe") {
  console.error("FAIL: VS Code is not configured to use the workspace virtual environment");
  process.exit(1);
}
console.log("PASS: settings.json is valid JSON and selects the project .venv interpreter");
`,
  },
  "linux-script-permission": {
    command: "bash verify.sh",
    verifier: `set -eu
printf '#!/bin/sh\necho Deploy complete\n' > deploy.sh
chmod 644 deploy.sh
if ! grep -Fq 'chmod u+x deploy.sh' terminal.sh; then
  echo 'FAIL: add the narrow owner execute permission command'
  exit 1
fi
chmod u+x deploy.sh
test -x deploy.sh
output="$(./deploy.sh)"
printf '%s\n' "$output"
test "$output" = 'Deploy complete'
echo 'PASS: the shell changed the owner execute bit and ran the deployment script'
`,
  },
  "database-missing-migration": {
    command: "python3 verify.py",
    verifier: `from pathlib import Path
import sqlite3

sql = Path("migrations/004_users.sql").read_text().replace("uuid", "text")
connection = sqlite3.connect(":memory:")
try:
    connection.executescript(sql)
    columns = connection.execute("pragma table_info(users)").fetchall()
except Exception as error:
    raise SystemExit(f"FAIL: migration execution failed: {error}")
names = {column[1] for column in columns}
if not {"id", "email"}.issubset(names):
    raise SystemExit("FAIL: users table is missing the id or email column")
print("PASS: a real SQLite database applied the migration and queried the users table")
`,
  },
  "cloud-lambda-timeout": {
    command: "node verify.mjs",
    verifier: `globalThis.loadAllPages = async () => Array.from({ length: 4812 }, (_, index) => index);
let indexed = 0;
globalThis.indexPage = async () => { indexed += 1; };
const { handler } = await import("./handler.mjs");
const result = await Promise.race([
  handler({ accountId: "test" }),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), 2500)),
]);
if (indexed !== 100 || result?.statusCode !== 200) {
  console.error("FAIL: expected 100 indexed pages and status 200, received " + indexed);
  process.exit(1);
}
console.log("Indexed 100 pages");
console.log("PASS: the Lambda handler bounded one invocation to a 100-page batch");
`,
  },
  "ai-model-not-found": {
    command: "node verify.mjs",
    verifier: `import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile("assistant.config.json", "utf8"));
const installedModels = new Set(["qwen2.5:7b"]);
if (config.provider !== "ollama" || !installedModels.has(config.model)) {
  console.error("FAIL: the configured Ollama model is not installed in this environment");
  process.exit(1);
}
console.log("Connected to " + config.model);
console.log("PASS: the assistant configuration uses an installed model tag");
`,
  },
};

function trimOutput(value: string) {
  return value.trim().slice(0, 12_000);
}

export function labRunnerConfigured() {
  return Boolean(process.env.E2B_API_KEY);
}

export async function runLabChallenge(
  labSlug: string,
  challengeId: string,
  editor: string,
) {
  const lab = labs.find((item) => item.slug === labSlug);
  const challenge = lab?.challenges.find((item) => item.id === challengeId);
  const verification = verifications[challengeId];
  if (!lab || !challenge || !verification) {
    throw new Error("Unknown lab challenge.");
  }

  const apiKey = process.env.E2B_API_KEY;
  if (!apiKey) throw new Error("The isolated lab runner is not configured.");

  const sandbox = await Sandbox.create({
    apiKey,
    timeoutMs: 60_000,
    allowInternetAccess: false,
    metadata: { product: "devfixes", lab: lab.slug, challenge: challenge.id },
  });

  try {
    const workspace = "/tmp/devfixes";
    await sandbox.files.write(`${workspace}/package.json`, '{"type":"module"}\n');
    await sandbox.files.write(`${workspace}/${challenge.fileName}`, editor);
    if (verification.verifier) {
      const extension = verification.command.startsWith("python3")
        ? "py"
        : verification.command.startsWith("bash")
          ? "sh"
          : "mjs";
      await sandbox.files.write(`${workspace}/verify.${extension}`, verification.verifier);
    }

    try {
      const result = await sandbox.commands.run(verification.command, {
        cwd: workspace,
        timeoutMs: 12_000,
      });
      return {
        passed: result.exitCode === 0,
        exitCode: result.exitCode,
        stdout: trimOutput(result.stdout),
        stderr: trimOutput(result.stderr),
      };
    } catch (error) {
      const result = error as {
        exitCode?: number;
        stdout?: string;
        stderr?: string;
        message?: string;
      };
      return {
        passed: false,
        exitCode: result.exitCode ?? 1,
        stdout: trimOutput(result.stdout ?? ""),
        stderr: trimOutput(result.stderr ?? result.message ?? "Verification failed."),
      };
    }
  } finally {
    await sandbox.kill().catch(() => false);
  }
}
