import type { TutorialArticle } from "@/lib/types";

export const tutorialArticles: TutorialArticle[] = [
  {
    slug: "python-modules-imports-and-virtual-environments",
    title: "Python modules, imports, packages, and virtual environments",
    excerpt:
      "Build a reliable mental model for Python imports, install packages into the correct interpreter, and prevent ModuleNotFoundError.",
    technology: "Python",
    category: "Language fundamentals",
    difficulty: "Beginner",
    estimatedTime: "20 min",
    tags: ["python", "modules", "imports", "pip", "virtualenv"],
    prerequisites: [
      "Python 3 is installed.",
      "You can open a terminal and run a Python file.",
    ],
    outcomes: [
      "Explain how Python resolves an import.",
      "Install a package into the interpreter that runs your project.",
      "Create and verify an isolated virtual environment.",
    ],
    body: `## The import model

When Python evaluates an import, it searches the locations listed in \`sys.path\`. Those locations normally include the current project, the standard library, and the active interpreter's package directory.

\`\`\`python
import sys

for location in sys.path:
    print(location)
\`\`\`

A package can be installed on your computer and still be unavailable to the project when \`pip\` and \`python\` point to different installations.

## Confirm the active interpreter

Ask the interpreter for its exact executable path before installing anything.

\`\`\`bash
python -c "import sys; print(sys.executable)"
python -m pip --version
\`\`\`

The two commands should describe the same Python installation. Prefer \`python -m pip\` over a bare \`pip\` command because it ties the package installer to the selected interpreter.

## Create an isolated environment

\`\`\`bash
python -m venv .venv
\`\`\`

Activate it on Windows PowerShell:

\`\`\`powershell
.\\.venv\\Scripts\\Activate.ps1
\`\`\`

Activate it on macOS or Linux:

\`\`\`bash
source .venv/bin/activate
\`\`\`

Now install and verify a dependency:

\`\`\`bash
python -m pip install requests
python -c "import requests; print(requests.__version__)"
\`\`\`

## Make the editor use the same Python

In VS Code, select the interpreter inside \`.venv\`. The terminal, debugger, test runner, and language server should all use that environment. If the terminal succeeds but the editor still reports a missing import, the selected editor interpreter is usually different.

## Prevent the problem

Record project dependencies and recreate environments instead of sharing one global package directory.

\`\`\`bash
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
\`\`\`

Do not commit the \`.venv\` directory. Commit the dependency file and setup instructions instead.`,
    relatedErrorSlugs: [
      "python-modulenotfounderror-requests",
      "python-modulenotfounderror",
    ],
    faqs: [
      {
        question: "Why does pip say a package is installed when Python cannot import it?",
        answer:
          "The pip command probably belongs to a different Python installation. Compare python -m pip --version with the path printed by sys.executable.",
      },
      {
        question: "Should every Python project have its own virtual environment?",
        answer:
          "For application development, yes. Separate environments prevent incompatible package versions from affecting unrelated projects.",
      },
    ],
    references: [
      {
        label: "Python tutorial: Modules",
        url: "https://docs.python.org/3/tutorial/modules.html",
        type: "Official docs",
      },
      {
        label: "Python virtual environments",
        url: "https://docs.python.org/3/library/venv.html",
        type: "Official docs",
      },
    ],
    publishedAt: "2026-07-28",
  },
  {
    slug: "github-ssh-keys-from-zero-to-working-push",
    title: "GitHub SSH keys: from zero to a working git push",
    excerpt:
      "Create an SSH key, load it into the agent, register it with GitHub, and verify which identity Git uses for a repository.",
    technology: "GitHub",
    category: "Authentication",
    difficulty: "Beginner",
    estimatedTime: "15 min",
    tags: ["github", "git", "ssh", "authentication"],
    prerequisites: [
      "Git is installed.",
      "You have access to a GitHub account and repository.",
    ],
    outcomes: [
      "Create and register an Ed25519 SSH key.",
      "Verify GitHub authentication before pushing.",
      "Diagnose repository access and multiple-account problems.",
    ],
    body: `## Check the repository remote

Start by confirming that the repository uses the GitHub host and the intended owner.

\`\`\`bash
git remote -v
\`\`\`

An SSH remote normally looks like \`git@github.com:OWNER/REPOSITORY.git\`.

## Create a key

\`\`\`bash
ssh-keygen -t ed25519 -C "your-email@example.com"
\`\`\`

Accept the default filename unless you already use that key path for another account.

## Load the key

On macOS or Linux:

\`\`\`bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
\`\`\`

On Windows PowerShell, start the OpenSSH authentication agent and add the key from your profile's \`.ssh\` directory.

\`\`\`powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\\.ssh\\id_ed25519
\`\`\`

## Register the public key

Copy the contents of \`id_ed25519.pub\`, then add it to the SSH keys page of the GitHub account that should access the repository. Never upload or share the private file without the \`.pub\` suffix.

## Test before pushing

\`\`\`bash
ssh -T git@github.com
\`\`\`

Successful authentication identifies the GitHub username. It does not automatically grant write permission to every repository, so also confirm organization membership, repository access, and branch protection.

## Correct the remote when necessary

\`\`\`bash
git remote set-url origin git@github.com:OWNER/REPOSITORY.git
git remote -v
\`\`\`

For multiple GitHub accounts, define SSH host aliases and assign a different identity file to each alias.`,
    relatedErrorSlugs: [
      "github-permission-denied-publickey",
      "git-non-fast-forward",
    ],
    faqs: [
      {
        question: "Can one SSH key be used for several repositories?",
        answer:
          "Yes. Repository access is granted to the GitHub account that owns the key, not separately to the key for each repository.",
      },
      {
        question: "Why does ssh -T succeed while git push is rejected?",
        answer:
          "SSH authentication confirms your account identity. The account may still lack write permission, organization authorization, or permission to update the protected branch.",
      },
    ],
    references: [
      {
        label: "GitHub: Connecting with SSH",
        url: "https://docs.github.com/en/authentication/connecting-to-github-with-ssh",
        type: "Official docs",
      },
      {
        label: "Git source repository",
        url: "https://github.com/git/git",
        type: "GitHub",
      },
    ],
    publishedAt: "2026-07-28",
  },
];
