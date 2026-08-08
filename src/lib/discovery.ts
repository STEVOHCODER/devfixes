export const ecosystemProfiles = [
  {
    id: "python",
    name: "Python",
    query: "Python",
    icon: "braces",
    description: "Imports, virtual environments, permissions, packaging, and tracebacks.",
    errorSlugs: [
      "python-modulenotfounderror-requests",
      "python-modulenotfounderror",
      "python-permission-denied",
    ],
  },
  {
    id: "node",
    name: "Node.js",
    query: "Node.js",
    icon: "hexagon",
    description: "Module resolution, npm dependencies, runtime failures, and build scripts.",
    errorSlugs: [
      "node-err-module-not-found",
      "npm-eresolve-dependency-tree",
      "javascript-cannot-read-properties-of-undefined",
    ],
  },
  {
    id: "git",
    name: "Git",
    query: "Git",
    icon: "git-branch",
    description: "Push rejections, branches, remotes, merges, credentials, and history.",
    errorSlugs: [
      "git-non-fast-forward",
      "github-permission-denied-publickey",
    ],
  },
  {
    id: "github",
    name: "GitHub",
    query: "GitHub",
    icon: "github",
    description: "SSH access, repository permissions, Actions workflows, and CI failures.",
    errorSlugs: [
      "github-permission-denied-publickey",
      "github-actions-process-completed-exit-code-1",
    ],
  },
  {
    id: "vscode",
    name: "VS Code",
    query: "VS Code",
    icon: "code-xml",
    description: "CLI launchers, interpreters, extensions, terminals, and workspace setup.",
    errorSlugs: [
      "vscode-code-command-not-found",
      "python-modulenotfounderror-requests",
      "node-err-module-not-found",
    ],
  },
];

export const trustedRepositories = [
  {
    name: "microsoft/vscode",
    url: "https://github.com/microsoft/vscode",
    technology: "VS Code",
    description:
      "The editor source and issue tracker. Use it to verify regressions, extension-host failures, and platform-specific editor behavior.",
  },
  {
    name: "nodejs/node",
    url: "https://github.com/nodejs/node",
    technology: "Node.js",
    description:
      "The Node.js runtime source. Use it for runtime errors, module-loader behavior, release notes, and confirmed platform bugs.",
  },
  {
    name: "python/cpython",
    url: "https://github.com/python/cpython",
    technology: "Python",
    description:
      "The reference Python implementation. Use it for interpreter behavior, standard-library issues, and version-specific changes.",
  },
  {
    name: "git/git",
    url: "https://github.com/git/git",
    technology: "Git",
    description:
      "The Git source repository. Use it for command behavior, release history, documentation, and low-level repository problems.",
  },
  {
    name: "github/docs",
    url: "https://github.com/github/docs",
    technology: "GitHub",
    description:
      "The source for GitHub documentation. Use it for authentication, repositories, Actions, security, and account workflows.",
  },
  {
    name: "actions/runner",
    url: "https://github.com/actions/runner",
    technology: "GitHub Actions",
    description:
      "The official Actions runner. Use it for runner releases, job execution behavior, labels, and runner-specific failures.",
  },
  {
    name: "vercel/next.js",
    url: "https://github.com/vercel/next.js",
    technology: "Next.js",
    description:
      "The Next.js framework repository. Use it for routing, rendering, hydration, build, caching, and deployment-related framework issues.",
  },
  {
    name: "facebook/react",
    url: "https://github.com/facebook/react",
    technology: "React",
    description:
      "The React source and issue tracker. Use it for rendering behavior, hooks, reconciliation, server components, and release changes.",
  },
  {
    name: "microsoft/TypeScript",
    url: "https://github.com/microsoft/TypeScript",
    technology: "TypeScript",
    description:
      "The TypeScript compiler repository. Use it for diagnostic behavior, language changes, compiler regressions, and type-system edge cases.",
  },
  {
    name: "kubernetes/kubernetes",
    url: "https://github.com/kubernetes/kubernetes",
    technology: "Kubernetes",
    description:
      "The Kubernetes source repository. Use it for workload behavior, API changes, controller issues, and version-specific cluster bugs.",
  },
];
