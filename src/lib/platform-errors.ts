import type { ErrorArticle } from "@/lib/types";

export const platformErrorArticles: ErrorArticle[] = [
  {
    slug: "github-permission-denied-publickey",
    title: "git@github.com: Permission denied (publickey)",
    excerpt:
      "GitHub rejected the SSH connection because no uploaded SSH key matched a key offered by your computer.",
    language: "Git",
    framework: "GitHub",
    category: "Authentication",
    severity: "High",
    difficulty: "Intermediate",
    fixTime: "5-15 min",
    popularity: 96,
    views: 338400,
    trend: 27,
    tags: ["github", "git", "ssh", "publickey", "authentication", "remote"],
    whatItMeans:
      "Git reached GitHub over SSH, but GitHub could not associate any key offered by your SSH client with an account that can access the repository.",
    causes: [
      "No SSH key exists on this computer.",
      "The SSH key exists but is not loaded into the SSH agent.",
      "The public key has not been added to the correct GitHub account.",
      "The remote points to a GitHub account or organization you cannot access.",
      "An SSH config rule is offering the wrong key for github.com.",
    ],
    aiExplanation:
      "The repository is not rejecting your Git command itself. The connection fails one layer earlier, during SSH identity verification. First confirm which remote host Git uses, then inspect which keys the SSH client offers, and finally verify that the matching public key belongs to a GitHub account with repository access.",
    quickFix: {
      commands: ["ssh -T git@github.com", "ssh-add -l", "git remote -v"],
      expected:
        "GitHub reports successful authentication, the SSH agent lists a key, and the repository remote points to the intended owner and repository.",
    },
    solutions: [
      {
        title: "Load the correct key into the SSH agent",
        description:
          "If the key exists locally, add it to the active SSH agent before retrying the Git operation.",
        probability: 84,
        commands: ["ssh-add ~/.ssh/id_ed25519", "ssh -T git@github.com"],
      },
      {
        title: "Create and register a new SSH key",
        description:
          "Generate an Ed25519 key, then add the contents of the public .pub file to the SSH keys page of the intended GitHub account.",
        probability: 71,
        commands: [
          "ssh-keygen -t ed25519 -C \"your-email@example.com\"",
          "cat ~/.ssh/id_ed25519.pub",
        ],
      },
      {
        title: "Correct the repository remote",
        description:
          "Verify that origin points to the repository and account you intend to use.",
        probability: 52,
        commands: [
          "git remote -v",
          "git remote set-url origin git@github.com:OWNER/REPOSITORY.git",
        ],
      },
    ],
    alternatives: [
      {
        environment: "Windows PowerShell",
        commands: [
          "Get-Service ssh-agent | Set-Service -StartupType Automatic",
          "Start-Service ssh-agent",
          "ssh-add $env:USERPROFILE\\.ssh\\id_ed25519",
        ],
        note: "Run PowerShell as Administrator only when changing the ssh-agent service startup type.",
      },
      {
        environment: "macOS / Linux",
        commands: ["eval \"$(ssh-agent -s)\"", "ssh-add ~/.ssh/id_ed25519"],
        note: "Use the actual private-key filename when it differs from id_ed25519.",
      },
      {
        environment: "HTTPS remote",
        commands: [
          "git remote set-url origin https://github.com/OWNER/REPOSITORY.git",
          "git remote -v",
        ],
        note: "HTTPS uses a credential manager or personal access token instead of an SSH key.",
      },
      {
        environment: "Multiple GitHub accounts",
        commands: ["ssh -G github.com | grep identityfile", "ssh -vT git@github.com"],
        note: "Use host aliases in ~/.ssh/config when work and personal accounts require different keys.",
      },
    ],
    brokenCode:
      "origin  git@github.com:wrong-account/private-repo.git (fetch)\norigin  git@github.com:wrong-account/private-repo.git (push)",
    fixedCode:
      "origin  git@github.com:correct-account/private-repo.git (fetch)\norigin  git@github.com:correct-account/private-repo.git (push)",
    codeLanguage: "shell",
    relatedSlugs: ["git-non-fast-forward", "github-actions-process-completed-exit-code-1"],
    faqs: [
      {
        question: "Why does SSH authentication work but git push is still denied?",
        answer:
          "Authentication proves who you are. You still need write permission to that repository and branch, and an organization may require SSO authorization for the key.",
      },
      {
        question: "Can I use GitHub without SSH?",
        answer:
          "Yes. Change the remote to HTTPS and authenticate through a credential manager or a personal access token.",
      },
      {
        question: "Which SSH key is GitHub receiving?",
        answer:
          "Run `ssh -vT git@github.com` and inspect the identity files offered by the client. Do not share private-key contents.",
      },
    ],
    references: [
      {
        label: "GitHub SSH connection troubleshooting",
        url: "https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey",
        type: "Official docs",
      },
      {
        label: "GitHub SSH key setup",
        url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh",
        type: "Official docs",
      },
      {
        label: "Git source repository",
        url: "https://github.com/git/git",
        type: "GitHub",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "github-actions-process-completed-exit-code-1",
    title: "Error: Process completed with exit code 1",
    excerpt:
      "A command inside a GitHub Actions step returned a non-zero exit status, so the runner marked the step and job as failed.",
    language: "YAML",
    framework: "GitHub Actions",
    category: "CI and automation",
    severity: "High",
    difficulty: "Intermediate",
    fixTime: "10-30 min",
    popularity: 95,
    views: 302600,
    trend: 29,
    tags: ["github", "github-actions", "ci", "workflow", "exit-code-1", "yaml"],
    whatItMeans:
      "Exit code 1 is a generic failure signal. The useful error is usually earlier in the same step log, where a test, build, linter, shell command, or setup task explains why it stopped.",
    causes: [
      "A test, build, lint, or type-check command failed.",
      "The runner is missing an environment variable, secret, file, or service.",
      "The workflow uses a different runtime or dependency version than local development.",
      "A shell command relies on the wrong working directory or operating system.",
      "An earlier setup step completed incompletely but did not stop the job.",
    ],
    aiExplanation:
      "GitHub Actions is reporting the final process status, not the root cause. Open the first failed step, move upward from the exit-code line, and find the earliest application-specific error. Reproduce that exact command with the same runtime version and environment before changing the workflow.",
    quickFix: {
      commands: [
        "git grep -n \"run:\" .github/workflows",
        "git status --short",
        "npm test",
      ],
      expected:
        "The same command that failed in the workflow completes locally with exit code 0, or produces a specific error you can address.",
    },
    solutions: [
      {
        title: "Find the first real error in the failed step",
        description:
          "Expand the first red workflow step and inspect the lines above the generic exit-code message.",
        probability: 92,
      },
      {
        title: "Reproduce the exact CI command locally",
        description:
          "Use the same runtime version, package manager, working directory, and command defined in the workflow.",
        probability: 78,
        commands: ["node --version", "npm ci", "npm test"],
      },
      {
        title: "Verify secrets and environment variables",
        description:
          "Confirm that required repository or environment secrets exist and are available to this event and job.",
        probability: 57,
      },
    ],
    alternatives: [
      {
        environment: "Node.js workflow",
        commands: ["npm ci", "npm run lint", "npm test", "npm run build"],
        note: "Run commands separately to identify the first script returning a non-zero status.",
      },
      {
        environment: "Python workflow",
        commands: [
          "python -m pip install -r requirements.txt",
          "python -m pytest -vv",
        ],
        note: "Match the Python version declared in actions/setup-python.",
      },
      {
        environment: "Docker workflow",
        commands: ["docker build --progress=plain ."],
        note: "Plain progress output exposes the build command and layer that failed.",
      },
      {
        environment: "Debug logging",
        commands: ["echo \"ACTIONS_STEP_DEBUG=true\""],
        note: "Enable step debug logging through the GitHub Actions secret documented by GitHub, not by printing secrets in the workflow.",
      },
    ],
    brokenCode:
      "steps:\n  - uses: actions/checkout@v4\n  - run: npm test",
    fixedCode:
      "steps:\n  - uses: actions/checkout@v4\n  - uses: actions/setup-node@v4\n    with:\n      node-version: 22\n      cache: npm\n  - run: npm ci\n  - run: npm test",
    codeLanguage: "yaml",
    relatedSlugs: [
      "github-permission-denied-publickey",
      "npm-eresolve-dependency-tree",
      "node-err-module-not-found",
    ],
    faqs: [
      {
        question: "What does exit code 1 mean in GitHub Actions?",
        answer:
          "It means a process failed in a generic way. The lines immediately before it normally contain the specific test, build, shell, or configuration error.",
      },
      {
        question: "Why does the command pass locally but fail in GitHub Actions?",
        answer:
          "The runner may use a different operating system, runtime version, lockfile state, environment variable set, filesystem casing, or working directory.",
      },
      {
        question: "Should I add continue-on-error?",
        answer:
          "Only when failure is intentionally non-blocking. It hides the job failure state and does not fix the underlying command.",
      },
    ],
    references: [
      {
        label: "GitHub Actions workflow commands",
        url: "https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions",
        type: "Official docs",
      },
      {
        label: "GitHub Actions runner repository",
        url: "https://github.com/actions/runner",
        type: "GitHub",
      },
      {
        label: "GitHub Actions documentation source",
        url: "https://github.com/github/docs",
        type: "GitHub",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "vscode-code-command-not-found",
    title: "code: command not found",
    excerpt:
      "The terminal cannot find the Visual Studio Code command-line launcher because its installation folder is missing from PATH.",
    language: "Shell",
    framework: "VS Code",
    category: "Editor and CLI",
    severity: "Low",
    difficulty: "Beginner",
    fixTime: "2-10 min",
    popularity: 90,
    views: 184700,
    trend: 16,
    tags: ["vscode", "visual-studio-code", "code-command", "path", "terminal"],
    whatItMeans:
      "Your shell searched every directory listed in the PATH environment variable and did not find the `code` launcher used to open Visual Studio Code from a terminal.",
    causes: [
      "The VS Code command-line launcher was not added to PATH.",
      "The terminal was opened before VS Code updated PATH.",
      "VS Code is installed for another user or in a non-standard directory.",
      "A WSL or remote terminal is trying to use the host command incorrectly.",
      "The installation is incomplete or the launcher file was removed.",
    ],
    aiExplanation:
      "VS Code may be installed and open normally while the shell still cannot launch it. The graphical application and the terminal command are separate entry points. Install or expose the `code` launcher for the current shell, restart that shell, and verify which executable resolves.",
    quickFix: {
      commands: ["code --version", "where.exe code"],
      expected:
        "The command prints a VS Code version and the path to the code launcher. On macOS or Linux, use `command -v code` instead of `where.exe code`.",
    },
    solutions: [
      {
        title: "Install the code command from VS Code",
        description:
          "On macOS, run 'Shell Command: Install code command in PATH' from the VS Code Command Palette, then reopen the terminal.",
        probability: 87,
      },
      {
        title: "Restart the terminal after installation",
        description:
          "Existing terminal processes keep their old PATH value until they are restarted.",
        probability: 70,
        commands: ["code --version"],
      },
      {
        title: "Add the VS Code bin directory to PATH",
        description:
          "Locate the installation's bin directory and add it to the current user's PATH.",
        probability: 54,
      },
    ],
    alternatives: [
      {
        environment: "Windows",
        commands: [
          "where.exe code",
          "& \"$env:LOCALAPPDATA\\Programs\\Microsoft VS Code\\bin\\code.cmd\" .",
        ],
        note: "Re-run the installer with the Add to PATH option if the direct launcher works.",
      },
      {
        environment: "macOS",
        commands: ["command -v code", "code --version"],
        note: "Use the Command Palette action that installs the shell command, then open a new terminal.",
      },
      {
        environment: "Linux",
        commands: ["command -v code", "/usr/bin/code --version"],
        note: "Package-manager installations normally create /usr/bin/code automatically.",
      },
      {
        environment: "WSL",
        commands: ["code .", "which code"],
        note: "Install the VS Code Remote - WSL integration and launch from the WSL project directory.",
      },
    ],
    brokenCode: "$ code .\nbash: code: command not found",
    fixedCode:
      "$ command -v code\n/usr/local/bin/code\n$ code .\n# Visual Studio Code opens the current folder",
    codeLanguage: "shell",
    relatedSlugs: [
      "python-modulenotfounderror-requests",
      "node-err-module-not-found",
    ],
    faqs: [
      {
        question: "Why does VS Code open from the Start menu but not the terminal?",
        answer:
          "The graphical shortcut knows the application path, while the terminal only searches directories listed in PATH.",
      },
      {
        question: "Why is `code` still missing after I added it to PATH?",
        answer:
          "Close and reopen the terminal, then inspect PATH and run `where.exe code` or `command -v code` again.",
      },
      {
        question: "Does this error mean my project is broken?",
        answer:
          "No. It only means the shell cannot locate the VS Code launcher. Your project files are unaffected.",
      },
    ],
    references: [
      {
        label: "Visual Studio Code command-line interface",
        url: "https://code.visualstudio.com/docs/configure/command-line",
        type: "Official docs",
      },
      {
        label: "Visual Studio Code repository",
        url: "https://github.com/microsoft/vscode",
        type: "GitHub",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "node-err-module-not-found",
    title: "Error [ERR_MODULE_NOT_FOUND]: Cannot find package",
    excerpt:
      "Node.js could not resolve an imported package or file from the current project and module system.",
    language: "JavaScript",
    framework: "Node.js",
    category: "Packages and imports",
    severity: "High",
    difficulty: "Beginner",
    fixTime: "5-15 min",
    popularity: 97,
    views: 371900,
    trend: 32,
    tags: ["nodejs", "node", "err-module-not-found", "esm", "npm", "imports"],
    whatItMeans:
      "The Node.js module loader followed an `import` statement and could not map its package name or file path to an installed, exported, and readable module.",
    causes: [
      "The dependency is missing from node_modules or package.json.",
      "The import contains the wrong package name, path, letter casing, or file extension.",
      "Dependencies were installed in another workspace or directory.",
      "The package exports map does not expose the imported subpath.",
      "CommonJS and ES module configuration are being mixed incorrectly.",
    ],
    aiExplanation:
      "Node resolves package imports from the current project boundary and local dependency tree. For a bare package name, verify installation and workspace location. For a relative import, verify the exact path, casing, extension, and module format. The URL shown in the error identifies the resolution point that failed.",
    quickFix: {
      commands: ["npm install", "npm ls --depth=0", "node -p \"process.version\""],
      expected:
        "Dependencies install without errors, the required package appears in npm ls, and the application starts without ERR_MODULE_NOT_FOUND.",
    },
    solutions: [
      {
        title: "Install the missing package in the active project",
        description:
          "Run the package manager from the directory containing the package.json used by the application.",
        probability: 86,
        commands: ["npm install <package>", "npm ls <package>"],
      },
      {
        title: "Correct the relative import path",
        description:
          "Match the real filename, letter casing, and required extension for the current Node.js module mode.",
        probability: 69,
      },
      {
        title: "Repair the workspace dependency install",
        description:
          "Use the repository's lockfile and package manager from the monorepo root.",
        probability: 48,
        commands: ["npm ci", "npm run build"],
      },
    ],
    alternatives: [
      {
        environment: "npm",
        commands: ["npm install", "npm ls <package>"],
        note: "Use npm when package-lock.json is the committed lockfile.",
      },
      {
        environment: "pnpm",
        commands: ["pnpm install", "pnpm why <package>"],
        note: "Run from the workspace root when pnpm-workspace.yaml is present.",
      },
      {
        environment: "Yarn",
        commands: ["yarn install", "yarn why <package>"],
        note: "Keep the Yarn version aligned with the repository configuration.",
      },
      {
        environment: "ES modules",
        commands: ["node --input-type=module -e \"import('./src/index.js')\""],
        note: "Relative ESM imports commonly require explicit file extensions.",
      },
    ],
    brokenCode:
      "import { createServer } from \"./server\";\n\ncreateServer();",
    fixedCode:
      "import { createServer } from \"./server.js\";\n\ncreateServer();",
    codeLanguage: "javascript",
    relatedSlugs: [
      "npm-eresolve-dependency-tree",
      "nextjs-module-not-found",
      "vscode-code-command-not-found",
    ],
    faqs: [
      {
        question: "Why does the package exist in package.json but Node cannot find it?",
        answer:
          "node_modules may be missing, the install may have failed, or the process may be running from a different workspace than the package.json you inspected.",
      },
      {
        question: "Why does the import work on Windows but fail on Linux?",
        answer:
          "Linux filesystems are usually case-sensitive. Match the exact casing of every directory and filename in the import.",
      },
      {
        question: "Do ES module imports need a file extension?",
        answer:
          "Relative ES module imports in Node.js normally need the exact filename including its extension unless a supported loader or build tool rewrites them.",
      },
    ],
    references: [
      {
        label: "Node.js ECMAScript modules",
        url: "https://nodejs.org/api/esm.html",
        type: "Official docs",
      },
      {
        label: "Node.js modules documentation",
        url: "https://nodejs.org/api/modules.html",
        type: "Official docs",
      },
      {
        label: "Node.js repository",
        url: "https://github.com/nodejs/node",
        type: "GitHub",
      },
    ],
    verifiedAt: "2026-07-21",
  },
];
