import type { ErrorArticle } from "@/lib/types";
import { platformErrorArticles } from "@/lib/platform-errors";

const commonPythonFaqs = [
  {
    question: "Why does it work in one terminal but not another?",
    answer:
      "The terminals are probably using different Python interpreters or virtual environments. Compare the output of `python -c \"import sys; print(sys.executable)\"` in both.",
  },
  {
    question: "Should I install packages globally?",
    answer:
      "Usually no. A project-specific virtual environment keeps dependencies isolated and makes the project easier to reproduce.",
  },
];

const coreErrorArticles: ErrorArticle[] = [
  {
    slug: "python-modulenotfounderror-requests",
    title: "ModuleNotFoundError: No module named 'requests'",
    excerpt:
      "Python cannot find the requests package in the interpreter environment that is running your code.",
    language: "Python",
    category: "Packages and imports",
    severity: "Medium",
    difficulty: "Beginner",
    fixTime: "2-5 min",
    popularity: 98,
    views: 284300,
    trend: 18,
    tags: ["python", "pip", "requests", "virtualenv", "imports"],
    whatItMeans:
      "Python reached an import statement for `requests`, searched the active interpreter's package paths, and did not find an installed module with that name.",
    causes: [
      "The requests package has not been installed.",
      "The package was installed for a different Python interpreter.",
      "Your virtual environment is not active.",
      "The IDE is configured to use a different interpreter than your terminal.",
      "A local file or folder is interfering with package resolution.",
    ],
    aiExplanation:
      "Think of each Python environment as its own toolbox. Your code asked for the `requests` tool, but the toolbox attached to the running Python process does not contain it. Installing the package with that exact interpreter, or switching to the intended environment, resolves the mismatch.",
    quickFix: {
      commands: ["python -m pip install requests", "python -c \"import requests; print(requests.__version__)\""],
      expected: "A version number such as 2.32.5",
    },
    solutions: [
      {
        title: "Install requests with the active interpreter",
        description:
          "Using `python -m pip` ties pip to the same Python executable that will run your application.",
        probability: 88,
        commands: ["python -m pip install requests"],
      },
      {
        title: "Activate the project virtual environment",
        description:
          "If requests is already listed in your project dependencies, activate the environment before running the script.",
        probability: 72,
        commands: [".venv\\Scripts\\activate", "python -m pip install -r requirements.txt"],
      },
      {
        title: "Select the correct IDE interpreter",
        description:
          "Point VS Code, PyCharm, or your editor to the interpreter where requests is installed.",
        probability: 49,
      },
    ],
    alternatives: [
      {
        environment: "Windows",
        commands: ["py -m pip install requests", "py app.py"],
        note: "The Python launcher is often the most reliable command on Windows.",
      },
      {
        environment: "macOS / Linux",
        commands: ["python3 -m pip install requests", "python3 app.py"],
        note: "Use python3 when `python` is not mapped to Python 3.",
      },
      {
        environment: "Virtual environment",
        commands: ["python -m venv .venv", ".venv\\Scripts\\activate", "python -m pip install requests"],
        note: "On macOS or Linux, activate with `source .venv/bin/activate`.",
      },
      {
        environment: "Conda",
        commands: ["conda install requests", "conda run python app.py"],
        note: "Install into the currently selected Conda environment.",
      },
      {
        environment: "Docker",
        commands: ["RUN python -m pip install --no-cache-dir requests"],
        note: "Add the dependency to the image, then rebuild it.",
      },
    ],
    brokenCode: "import requests\n\nresponse = requests.get(\"https://api.example.com\")",
    fixedCode:
      "# requirements.txt\nrequests==2.32.5\n\n# app.py\nimport requests\n\nresponse = requests.get(\"https://api.example.com\", timeout=10)",
    codeLanguage: "python",
    relatedSlugs: [
      "python-modulenotfounderror",
      "python-permission-denied",
    ],
    faqs: [
      ...commonPythonFaqs,
      {
        question: "Why does `pip install requests` say it is already installed?",
        answer:
          "That pip command is likely attached to another interpreter. Run `python -m pip show requests` and compare `python -c \"import sys; print(sys.executable)\"` with your IDE interpreter.",
      },
    ],
    references: [
      {
        label: "Python tutorial: Modules",
        url: "https://docs.python.org/3/tutorial/modules.html",
        type: "Official docs",
      },
      {
        label: "Requests installation guide",
        url: "https://requests.readthedocs.io/en/latest/user/install/",
        type: "Official docs",
      },
      {
        label: "Packaging guide: Installing packages",
        url: "https://packaging.python.org/en/latest/tutorials/installing-packages/",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "javascript-cannot-read-properties-of-undefined",
    title: "TypeError: Cannot read properties of undefined",
    excerpt:
      "JavaScript tried to read a property from a value that is currently undefined.",
    language: "JavaScript",
    category: "Runtime",
    severity: "High",
    difficulty: "Beginner",
    fixTime: "5-15 min",
    popularity: 100,
    views: 491200,
    trend: 24,
    tags: ["javascript", "undefined", "typeerror", "runtime"],
    whatItMeans:
      "An expression on the left side of a property access, such as `user.profile.name`, evaluated to `undefined` before JavaScript could read the next property.",
    causes: [
      "Data has not loaded yet.",
      "An array lookup returned no matching item.",
      "A function returned undefined unexpectedly.",
      "The property path does not match the response shape.",
      "A component rendered before required props were available.",
    ],
    aiExplanation:
      "JavaScript can only read a property from an object-like value. One step in the property chain produced `undefined`, so the next dot access had nowhere to look. Inspect the first missing value, not only the final property named in the message.",
    quickFix: {
      commands: ["console.log({ valueBeforeFailure });", "const name = user?.profile?.name ?? \"Unknown\";"],
      expected: "The page continues rendering while the missing value is handled explicitly.",
    },
    solutions: [
      {
        title: "Guard the missing value",
        description:
          "Use an early return or conditional rendering when the value is genuinely optional or asynchronous.",
        probability: 82,
      },
      {
        title: "Fix the data path",
        description:
          "Log the actual object and update your access path to match its shape.",
        probability: 68,
      },
      {
        title: "Initialize state with a compatible shape",
        description:
          "Choose an initial value that reflects how the component reads the state.",
        probability: 45,
      },
    ],
    alternatives: [
      {
        environment: "Browser JavaScript",
        commands: ["const result = value?.property ?? fallback;"],
        note: "Optional chaining is useful when absence is expected.",
      },
      {
        environment: "Node.js",
        commands: ["if (!config.database) throw new Error(\"Missing database config\");"],
        note: "Fail early for required server configuration.",
      },
      {
        environment: "React",
        commands: ["if (!user) return <Loading />;"],
        note: "Render a loading or empty state before accessing async data.",
      },
    ],
    brokenCode: "const user = users.find((item) => item.id === selectedId);\nconsole.log(user.name);",
    fixedCode:
      "const user = users.find((item) => item.id === selectedId);\n\nif (!user) {\n  console.warn(\"User not found\", { selectedId });\n  return;\n}\n\nconsole.log(user.name);",
    codeLanguage: "javascript",
    relatedSlugs: ["react-too-many-re-renders", "typescript-type-not-assignable"],
    faqs: [
      {
        question: "Does optional chaining fix the underlying bug?",
        answer:
          "Not always. It prevents the crash, but you should still verify whether the value is allowed to be missing. Required data should usually be validated earlier.",
      },
      {
        question: "How do I find which part of a long property chain is undefined?",
        answer:
          "Break the chain into variables or log each level. The first undefined value is the useful debugging target.",
      },
    ],
    references: [
      {
        label: "MDN: TypeError",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError",
        type: "Official docs",
      },
      {
        label: "MDN: Optional chaining",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "nextjs-hydration-failed",
    title: "Hydration failed because the server rendered HTML did not match",
    excerpt:
      "The first client render produced different markup from the HTML generated on the server.",
    language: "TypeScript",
    framework: "Next.js",
    category: "Rendering",
    severity: "High",
    difficulty: "Intermediate",
    fixTime: "10-25 min",
    popularity: 94,
    views: 198700,
    trend: 31,
    tags: ["nextjs", "react", "hydration", "ssr"],
    whatItMeans:
      "React expected to attach event handlers to server-rendered HTML, but the client calculated different content during its first render.",
    causes: [
      "Using `Date.now()`, `Math.random()`, or locale-dependent formatting during render.",
      "Reading browser-only APIs before the component mounts.",
      "Invalid HTML nesting.",
      "Data changed between server rendering and hydration.",
      "A browser extension modified the document.",
    ],
    aiExplanation:
      "Next.js rendered the component once on the server and React rendered it again in the browser. Hydration requires those two snapshots to agree. Any value that changes by time, environment, or browser state can make the snapshots diverge.",
    quickFix: {
      commands: ["Move browser-only values into useEffect.", "Render deterministic placeholder content on the server."],
      expected: "The initial server and client markup match, and the warning disappears.",
    },
    solutions: [
      {
        title: "Make the initial render deterministic",
        description:
          "Pass server-generated values as props or defer volatile values until after mount.",
        probability: 83,
      },
      {
        title: "Move browser-only logic into a client effect",
        description:
          "Access localStorage, window, or navigator after the component mounts.",
        probability: 66,
      },
      {
        title: "Correct invalid HTML nesting",
        description:
          "Inspect the rendered DOM and ensure interactive elements and paragraphs are nested legally.",
        probability: 38,
      },
    ],
    alternatives: [
      {
        environment: "App Router",
        commands: ["Add `\"use client\"` only to the smallest interactive component."],
        note: "Client components are still server-pre-rendered unless dynamically disabled.",
      },
      {
        environment: "Dynamic import",
        commands: ["dynamic(() => import(\"./BrowserOnly\"), { ssr: false })"],
        note: "Use this for genuinely browser-only widgets, not as the first fix for every mismatch.",
      },
    ],
    brokenCode: "export function Clock() {\n  return <time>{new Date().toLocaleTimeString()}</time>;\n}",
    fixedCode:
      "\"use client\";\n\nimport { useEffect, useState } from \"react\";\n\nexport function Clock() {\n  const [time, setTime] = useState<string | null>(null);\n  useEffect(() => setTime(new Date().toLocaleTimeString()), []);\n  return <time>{time ?? \"--:--\"}</time>;\n}",
    codeLanguage: "tsx",
    relatedSlugs: [
      "javascript-cannot-read-properties-of-undefined",
      "react-too-many-re-renders",
      "nextjs-module-not-found",
    ],
    faqs: [
      {
        question: "Can I use suppressHydrationWarning?",
        answer:
          "Use it only for a small, intentionally different text node such as a timestamp. It suppresses the warning but does not repair a structural mismatch.",
      },
      {
        question: "Why does the error appear only in production?",
        answer:
          "Production timing, caching, streaming, and minification can expose nondeterministic renders that are less obvious during local development.",
      },
    ],
    references: [
      {
        label: "Next.js error guide: React hydration error",
        url: "https://nextjs.org/docs/messages/react-hydration-error",
        type: "Official docs",
      },
      {
        label: "React: hydrateRoot",
        url: "https://react.dev/reference/react-dom/client/hydrateRoot",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "docker-daemon-not-running",
    title: "Cannot connect to the Docker daemon",
    excerpt:
      "The Docker client cannot reach the Docker engine socket or service.",
    language: "Docker",
    category: "Containers",
    severity: "High",
    difficulty: "Beginner",
    fixTime: "3-10 min",
    popularity: 96,
    views: 221900,
    trend: 14,
    tags: ["docker", "daemon", "socket", "wsl"],
    whatItMeans:
      "The `docker` command is installed, but the background engine that creates and manages containers is unavailable at the configured endpoint.",
    causes: [
      "Docker Desktop or the Docker service is stopped.",
      "The current user cannot access the Docker socket.",
      "The Docker context points to an unavailable host.",
      "WSL integration is disabled or unhealthy.",
      "The `DOCKER_HOST` environment variable is incorrect.",
    ],
    aiExplanation:
      "The Docker CLI is only a client. It sends requests to a separate engine process. This error means the client started correctly but could not open a connection to that engine.",
    quickFix: {
      commands: ["docker context show", "docker info"],
      expected: "Docker prints server information instead of a connection error.",
    },
    solutions: [
      {
        title: "Start or restart the Docker engine",
        description:
          "Open Docker Desktop, or restart the Docker service on Linux.",
        probability: 84,
        commands: ["sudo systemctl restart docker"],
      },
      {
        title: "Reset the active Docker context",
        description:
          "Switch back to the local default context when the current endpoint is stale.",
        probability: 52,
        commands: ["docker context use default"],
      },
      {
        title: "Fix Linux socket permissions",
        description:
          "Add your user to the docker group, then start a new login session.",
        probability: 36,
        commands: ["sudo usermod -aG docker $USER"],
      },
    ],
    alternatives: [
      {
        environment: "Windows / macOS",
        commands: ["Start Docker Desktop", "docker info"],
        note: "Wait until Docker Desktop reports that the engine is running.",
      },
      {
        environment: "Linux",
        commands: ["sudo systemctl enable --now docker", "sudo systemctl status docker"],
        note: "Check the service logs if the engine exits immediately.",
      },
      {
        environment: "WSL",
        commands: ["wsl --shutdown"],
        note: "Restart Docker Desktop after WSL has fully stopped.",
      },
    ],
    brokenCode: "$ docker compose up\nCannot connect to the Docker daemon at unix:///var/run/docker.sock.",
    fixedCode: "$ sudo systemctl start docker\n$ docker info\nServer:\n Containers: 0\n Images: 12",
    codeLanguage: "shell",
    relatedSlugs: ["kubernetes-crashloopbackoff"],
    faqs: [
      {
        question: "Is running Docker with sudo a permanent fix?",
        answer:
          "It confirms a permission issue, but the long-term fix is to configure socket access correctly instead of prefixing every command with sudo.",
      },
      {
        question: "Why is Docker Desktop open but the daemon unavailable?",
        answer:
          "The UI can be running while the engine is still starting or has failed. Check Docker Desktop diagnostics and `docker context ls`.",
      },
    ],
    references: [
      {
        label: "Docker Engine installation",
        url: "https://docs.docker.com/engine/install/",
        type: "Official docs",
      },
      {
        label: "Docker contexts",
        url: "https://docs.docker.com/engine/manage-resources/contexts/",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "git-non-fast-forward",
    title: "Git push rejected: non-fast-forward",
    excerpt:
      "The remote branch contains commits that are not present in your local branch.",
    language: "Git",
    category: "Version control",
    severity: "Medium",
    difficulty: "Beginner",
    fixTime: "5-15 min",
    popularity: 91,
    views: 176400,
    trend: 8,
    tags: ["git", "push", "non-fast-forward", "rebase"],
    whatItMeans:
      "Git refused to move the remote branch pointer because doing so would ignore commits that already exist on the remote.",
    causes: [
      "Someone pushed to the same branch after your last pull.",
      "You rewrote local history with rebase or amend.",
      "Your local branch tracks the wrong remote branch.",
      "A remote automation committed to the branch.",
    ],
    aiExplanation:
      "Your branch and the remote branch have diverged. Git stops the push because it cannot safely assume whether remote commits should be merged, rebased, or replaced.",
    quickFix: {
      commands: ["git fetch origin", "git pull --rebase origin main", "git push origin main"],
      expected: "The local commits are replayed on top of the remote branch and the push succeeds.",
    },
    solutions: [
      {
        title: "Rebase onto the remote branch",
        description:
          "Best for a clean linear history when your local commits have not been shared.",
        probability: 78,
        commands: ["git pull --rebase origin main", "git push origin main"],
      },
      {
        title: "Merge the remote branch",
        description:
          "Preserve both histories with a merge commit.",
        probability: 56,
        commands: ["git pull --no-rebase origin main", "git push origin main"],
      },
      {
        title: "Force with lease after an intentional rewrite",
        description:
          "Use only when you intentionally rebased shared history and understand which commits will be replaced.",
        probability: 18,
        commands: ["git push --force-with-lease origin main"],
      },
    ],
    alternatives: [
      {
        environment: "Feature branch",
        commands: ["git fetch origin", "git rebase origin/main"],
        note: "Resolve conflicts, continue the rebase, then push.",
      },
      {
        environment: "Shared branch",
        commands: ["git pull --no-rebase"],
        note: "Merging is often safer when multiple developers share the branch.",
      },
    ],
    brokenCode: "$ git push origin main\n! [rejected] main -> main (non-fast-forward)",
    fixedCode:
      "$ git pull --rebase origin main\nSuccessfully rebased and updated refs/heads/main.\n$ git push origin main",
    codeLanguage: "shell",
    relatedSlugs: [],
    faqs: [
      {
        question: "Should I use `git push --force`?",
        answer:
          "Avoid plain force on shared branches. `--force-with-lease` adds a safety check, but it can still replace remote history.",
      },
      {
        question: "Will pull --rebase lose my work?",
        answer:
          "It replays your commits rather than discarding them. Commit or stash uncommitted work first, and resolve any conflicts carefully.",
      },
    ],
    references: [
      {
        label: "Git: Dealing with non-fast-forward errors",
        url: "https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors",
        type: "Official docs",
      },
      {
        label: "Git rebase documentation",
        url: "https://git-scm.com/docs/git-rebase",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "npm-eresolve-dependency-tree",
    title: "npm ERR! ERESOLVE unable to resolve dependency tree",
    excerpt:
      "npm found incompatible peer dependency requirements while building the install plan.",
    language: "JavaScript",
    framework: "npm",
    category: "Packages and imports",
    severity: "Medium",
    difficulty: "Intermediate",
    fixTime: "10-20 min",
    popularity: 95,
    views: 247500,
    trend: 21,
    tags: ["npm", "dependencies", "peer-dependencies", "node"],
    whatItMeans:
      "Two or more packages require incompatible versions of the same dependency, and npm cannot choose a version that satisfies every declared peer range.",
    causes: [
      "A framework was upgraded without upgrading its plugins.",
      "A package declares an outdated peer dependency range.",
      "The lockfile contains a stale resolution.",
      "A prerelease package is mixed with stable dependencies.",
    ],
    aiExplanation:
      "Peer dependencies are compatibility claims between packages. npm found claims that cannot all be true at the same time, so it stopped rather than installing a combination that may break at runtime.",
    quickFix: {
      commands: ["npm explain <package>", "npm outdated", "npm install <compatible-version>"],
      expected: "npm completes the install without an ERESOLVE report.",
    },
    solutions: [
      {
        title: "Align the conflicting package versions",
        description:
          "Read the ERESOLVE report from the first conflict and install versions with overlapping peer ranges.",
        probability: 80,
      },
      {
        title: "Regenerate the lockfile",
        description:
          "Use this after package.json has been corrected but the lockfile still preserves an obsolete resolution.",
        probability: 47,
        commands: ["rm -rf node_modules package-lock.json", "npm install"],
      },
      {
        title: "Use legacy peer dependency behavior temporarily",
        description:
          "This bypasses peer resolution and should be a temporary compatibility measure.",
        probability: 22,
        commands: ["npm install --legacy-peer-deps"],
      },
    ],
    alternatives: [
      {
        environment: "Windows PowerShell",
        commands: ["Remove-Item -Recurse -Force node_modules", "Remove-Item package-lock.json", "npm install"],
        note: "Only regenerate after checking the declared dependency versions.",
      },
      {
        environment: "CI",
        commands: ["npm ci"],
        note: "Commit a valid lockfile and keep CI installs deterministic.",
      },
    ],
    brokenCode: "\"react\": \"19.2.4\",\n\"legacy-plugin\": \"1.0.0\" // peer requires React 17",
    fixedCode: "\"react\": \"19.2.4\",\n\"compatible-plugin\": \"4.2.0\" // supports React 19",
    codeLanguage: "json",
    relatedSlugs: ["nextjs-module-not-found"],
    faqs: [
      {
        question: "Is `--force` safe?",
        answer:
          "It can install a dependency graph that package authors declared incompatible. Prefer version alignment and use force only when you have tested the combination.",
      },
      {
        question: "Why does npm ci fail when npm install works?",
        answer:
          "npm ci strictly follows the committed lockfile. If package.json and package-lock.json disagree, regenerate and commit the lockfile.",
      },
    ],
    references: [
      {
        label: "npm peer dependencies",
        url: "https://docs.npmjs.com/cli/using-npm/config#legacy-peer-deps",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "typescript-type-not-assignable",
    title: "Type is not assignable to type",
    excerpt:
      "A value's inferred or declared shape does not satisfy the type required at that location.",
    language: "TypeScript",
    category: "Types",
    severity: "Medium",
    difficulty: "Intermediate",
    fixTime: "5-20 min",
    popularity: 93,
    views: 202800,
    trend: 13,
    tags: ["typescript", "types", "assignment", "generics"],
    whatItMeans:
      "TypeScript compared the source value with the destination type and found at least one incompatible property, union member, or generic constraint.",
    causes: [
      "A property is missing or has the wrong type.",
      "A string was widened instead of inferred as a literal.",
      "A value can be null or undefined.",
      "Two similar types come from different package versions.",
      "A generic constraint is too narrow.",
    ],
    aiExplanation:
      "TypeScript is showing where the contract and the value disagree. Read the message from the deepest nested incompatibility upward; that final detail is usually more useful than the headline.",
    quickFix: {
      commands: ["Inspect the full compiler message.", "Fix the source value or update the destination contract."],
      expected: "The compiler accepts the assignment without a type assertion.",
    },
    solutions: [
      {
        title: "Make the value satisfy the required type",
        description:
          "Add the missing property or transform the value before assignment.",
        probability: 75,
      },
      {
        title: "Handle nullability explicitly",
        description:
          "Narrow optional values before passing them to code that requires a concrete value.",
        probability: 58,
      },
      {
        title: "Correct the type definition",
        description:
          "If the runtime value is valid, update an inaccurate or overly narrow type.",
        probability: 39,
      },
    ],
    alternatives: [
      {
        environment: "Strict TypeScript",
        commands: ["Use a type guard before assignment."],
        note: "Prefer narrowing over `as` assertions.",
      },
      {
        environment: "External data",
        commands: ["Validate the response at runtime before treating it as typed."],
        note: "Type annotations do not validate API responses.",
      },
    ],
    brokenCode: "type Status = \"open\" | \"closed\";\nconst status: Status = getValue(); // string",
    fixedCode:
      "type Status = \"open\" | \"closed\";\n\nfunction isStatus(value: string): value is Status {\n  return value === \"open\" || value === \"closed\";\n}\n\nconst value = getValue();\nif (isStatus(value)) {\n  const status: Status = value;\n}",
    codeLanguage: "typescript",
    relatedSlugs: ["javascript-cannot-read-properties-of-undefined"],
    faqs: [
      {
        question: "Should I fix this with `as`?",
        answer:
          "A type assertion silences the compiler without changing the runtime value. Use it only when you have stronger knowledge than TypeScript and can justify that knowledge.",
      },
      {
        question: "Why are two types with the same name incompatible?",
        answer:
          "They may come from different package versions or contain private members that make them nominally distinct.",
      },
    ],
    references: [
      {
        label: "TypeScript handbook: Everyday types",
        url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "react-too-many-re-renders",
    title: "Too many re-renders. React limits the number of renders",
    excerpt:
      "A component is updating state during render or triggering an effect loop.",
    language: "JavaScript",
    framework: "React",
    category: "Rendering",
    severity: "High",
    difficulty: "Intermediate",
    fixTime: "5-20 min",
    popularity: 89,
    views: 159100,
    trend: 16,
    tags: ["react", "hooks", "state", "render-loop"],
    whatItMeans:
      "React detected a render-update-render cycle that would continue indefinitely, so it stopped the component.",
    causes: [
      "Calling a state setter directly in the component body.",
      "Invoking an event handler instead of passing a function.",
      "An effect updates a value that is also in its dependency list.",
      "A derived object or function changes on every render.",
    ],
    aiExplanation:
      "Rendering must be a calculation, not an action that immediately schedules another render. A state update in the render path creates a loop: render, update, render again.",
    quickFix: {
      commands: ["Pass event handlers as functions.", "Move synchronization into a correctly-scoped effect."],
      expected: "The component renders a stable result and updates only after an event or dependency change.",
    },
    solutions: [
      {
        title: "Remove state updates from render",
        description:
          "Compute derived values directly or update state from an event handler.",
        probability: 84,
      },
      {
        title: "Fix the effect dependency loop",
        description:
          "Avoid setting a dependency to a new value on every effect run.",
        probability: 59,
      },
      {
        title: "Pass a callback to the event prop",
        description:
          "Use `onClick={() => setOpen(true)}` rather than calling the setter while rendering.",
        probability: 42,
      },
    ],
    alternatives: [
      {
        environment: "React",
        commands: ["const total = items.reduce(...);"],
        note: "Do not store values in state when they can be derived during render.",
      },
      {
        environment: "React effect",
        commands: ["useEffect(() => { /* external sync */ }, [stableDependency]);"],
        note: "Effects are for synchronization with external systems.",
      },
    ],
    brokenCode: "function Panel() {\n  const [open, setOpen] = useState(false);\n  setOpen(true);\n  return <div>{String(open)}</div>;\n}",
    fixedCode:
      "function Panel() {\n  const [open, setOpen] = useState(false);\n  return <button onClick={() => setOpen(true)}>{open ? \"Open\" : \"Closed\"}</button>;\n}",
    codeLanguage: "tsx",
    relatedSlugs: [
      "javascript-cannot-read-properties-of-undefined",
      "nextjs-hydration-failed",
    ],
    faqs: [
      {
        question: "Can useMemo fix a render loop?",
        answer:
          "Only if unstable derived values are retriggering an effect. It will not fix a state setter called directly during render.",
      },
      {
        question: "Why does the loop happen only after adding an effect dependency?",
        answer:
          "The effect probably writes a new value back into that dependency. Reconsider whether the value should be state or derived.",
      },
    ],
    references: [
      {
        label: "React: Components and hooks must be pure",
        url: "https://react.dev/reference/rules/components-and-hooks-must-be-pure",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "postgres-connection-refused",
    title: "PostgreSQL connection refused",
    excerpt:
      "The client reached the host but no PostgreSQL server accepted the connection on that port.",
    language: "PostgreSQL",
    category: "Database",
    severity: "High",
    difficulty: "Intermediate",
    fixTime: "10-30 min",
    popularity: 88,
    views: 134500,
    trend: 11,
    tags: ["postgresql", "connection", "database", "docker"],
    whatItMeans:
      "The network connection was rejected before authentication, usually because PostgreSQL is stopped, listening elsewhere, or unreachable from the current container or host.",
    causes: [
      "The PostgreSQL service is stopped.",
      "The host or port is incorrect.",
      "A container is using localhost to refer to itself instead of the database service.",
      "PostgreSQL is not listening on the required interface.",
      "A firewall or network policy blocks the port.",
    ],
    aiExplanation:
      "This is a transport failure, not a bad password. The application could not establish a TCP connection to PostgreSQL, so database authentication never began.",
    quickFix: {
      commands: ["pg_isready -h localhost -p 5432", "psql \"$DATABASE_URL\""],
      expected: "The server reports that it is accepting connections.",
    },
    solutions: [
      {
        title: "Start PostgreSQL and verify the port",
        description:
          "Check the service status and confirm which address and port it is listening on.",
        probability: 77,
      },
      {
        title: "Use the Docker service name",
        description:
          "Inside Compose, connect to `db:5432` rather than `localhost:5432`.",
        probability: 64,
      },
      {
        title: "Correct the connection URL",
        description:
          "Verify protocol, host, port, database, and SSL settings.",
        probability: 45,
      },
    ],
    alternatives: [
      {
        environment: "Docker Compose",
        commands: ["DATABASE_URL=postgresql://user:pass@db:5432/app"],
        note: "Use the database service name on the Compose network.",
      },
      {
        environment: "Linux",
        commands: ["sudo systemctl status postgresql", "ss -ltnp | grep 5432"],
        note: "Confirm the process is listening.",
      },
      {
        environment: "Supabase",
        commands: ["Use the project connection string and required SSL mode."],
        note: "Use the pooler connection for serverless workloads when appropriate.",
      },
    ],
    brokenCode: "DATABASE_URL=postgresql://app:secret@localhost:5432/app # inside web container",
    fixedCode: "DATABASE_URL=postgresql://app:secret@db:5432/app # Compose service name",
    codeLanguage: "dotenv",
    relatedSlugs: [],
    faqs: [
      {
        question: "Is connection refused caused by a wrong password?",
        answer:
          "Usually no. A wrong password produces an authentication error after the server accepts the connection.",
      },
      {
        question: "Why does localhost fail inside Docker?",
        answer:
          "Inside a container, localhost points to that container. Use the database container's service name or a host gateway.",
      },
    ],
    references: [
      {
        label: "PostgreSQL client connection defaults",
        url: "https://www.postgresql.org/docs/current/libpq-connect.html",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "kubernetes-crashloopbackoff",
    title: "Kubernetes CrashLoopBackOff",
    excerpt:
      "A container repeatedly starts, exits, and is restarted with increasing delay.",
    language: "Kubernetes",
    category: "Orchestration",
    severity: "High",
    difficulty: "Advanced",
    fixTime: "15-45 min",
    popularity: 87,
    views: 126900,
    trend: 19,
    tags: ["kubernetes", "pods", "containers", "crashloopbackoff"],
    whatItMeans:
      "Kubernetes can start the pod, but a container exits repeatedly. The backoff is the delay Kubernetes applies before trying again.",
    causes: [
      "The application crashes during startup.",
      "Required environment variables or secrets are missing.",
      "The command or entrypoint is incorrect.",
      "A liveness probe kills the container.",
      "The process runs out of memory.",
      "A required dependency is unavailable.",
    ],
    aiExplanation:
      "CrashLoopBackOff describes the restart behavior, not the root cause. The useful evidence is in the previous container logs, pod events, exit code, and probe status.",
    quickFix: {
      commands: [
        "kubectl describe pod <pod>",
        "kubectl logs <pod> --previous",
        "kubectl get pod <pod> -o jsonpath='{.status.containerStatuses[*].lastState.terminated.exitCode}'",
      ],
      expected: "The previous logs or termination state reveals the actual application failure.",
    },
    solutions: [
      {
        title: "Read the previous container logs",
        description:
          "The current container may have no useful logs after a restart. `--previous` retrieves the crashed instance.",
        probability: 92,
      },
      {
        title: "Inspect events and probe failures",
        description:
          "Describe the pod to identify mount, scheduling, image, and health-check problems.",
        probability: 73,
      },
      {
        title: "Check exit code and resource limits",
        description:
          "Exit code 137 commonly indicates an out-of-memory kill.",
        probability: 48,
      },
    ],
    alternatives: [
      {
        environment: "Deployment",
        commands: ["kubectl rollout history deployment/<name>", "kubectl rollout undo deployment/<name>"],
        note: "Rollback if the crash began with the latest release.",
      },
      {
        environment: "Debug container",
        commands: ["kubectl debug -it <pod> --image=busybox"],
        note: "Use an ephemeral container when the application image exits too quickly to inspect.",
      },
    ],
    brokenCode: "status:\n  state:\n    waiting:\n      reason: CrashLoopBackOff",
    fixedCode:
      "$ kubectl logs api-7d8f --previous\nError: DATABASE_URL is required\n\n# Add the missing secret and restart the rollout.",
    codeLanguage: "yaml",
    relatedSlugs: ["docker-daemon-not-running", "postgres-connection-refused"],
    faqs: [
      {
        question: "Is CrashLoopBackOff a Kubernetes bug?",
        answer:
          "Usually no. Kubernetes is reporting that the container process keeps exiting. The previous logs and exit code reveal why.",
      },
      {
        question: "How do I reset the backoff timer?",
        answer:
          "Deleting the pod creates a new one, but it will crash again unless the underlying configuration or application failure is fixed.",
      },
    ],
    references: [
      {
        label: "Kubernetes: Pod lifecycle",
        url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
        type: "Official docs",
      },
      {
        label: "Kubernetes: Debug running pods",
        url: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "nextjs-module-not-found",
    title: "Next.js Module not found: Can't resolve",
    excerpt:
      "The bundler cannot resolve an imported package or local file from the importing module.",
    language: "TypeScript",
    framework: "Next.js",
    category: "Build",
    severity: "High",
    difficulty: "Beginner",
    fixTime: "5-15 min",
    popularity: 90,
    views: 148700,
    trend: 17,
    tags: ["nextjs", "webpack", "turbopack", "imports", "build"],
    whatItMeans:
      "Next.js followed an import path during development or build and could not map it to an installed package or an existing file.",
    causes: [
      "The package is not installed.",
      "The relative path or filename casing is wrong.",
      "A path alias is not configured correctly.",
      "A server-only dependency is imported into client code.",
      "The lockfile or node_modules directory is stale.",
    ],
    aiExplanation:
      "The build graph contains an import edge that points nowhere. Check the exact import text, the importing file's location, and whether the target exists with matching letter case.",
    quickFix: {
      commands: ["npm install <missing-package>", "npx tsc --noEmit"],
      expected: "The development server or production build resolves the import.",
    },
    solutions: [
      {
        title: "Install the missing package",
        description:
          "For bare imports, confirm the package is listed in dependencies.",
        probability: 71,
      },
      {
        title: "Correct the path and casing",
        description:
          "Linux and Vercel filesystems are case-sensitive even when local Windows development is not.",
        probability: 62,
      },
      {
        title: "Fix the path alias configuration",
        description:
          "Ensure tsconfig paths and the actual source directory agree.",
        probability: 36,
      },
    ],
    alternatives: [
      {
        environment: "Vercel",
        commands: ["Check filename casing and committed files."],
        note: "A local Windows build can hide casing mistakes.",
      },
      {
        environment: "Monorepo",
        commands: ["Declare the dependency in the package that imports it."],
        note: "Do not rely on an accidentally hoisted transitive dependency.",
      },
    ],
    brokenCode: "import { Search } from \"@/Components/Search\";\n// Actual path: src/components/search.tsx",
    fixedCode: "import { Search } from \"@/components/search\";",
    codeLanguage: "typescript",
    relatedSlugs: ["npm-eresolve-dependency-tree", "nextjs-hydration-failed"],
    faqs: [
      {
        question: "Why does this fail on Vercel but work on Windows?",
        answer:
          "The deployed filesystem is case-sensitive. Match directory and filename casing exactly.",
      },
      {
        question: "Should I delete node_modules?",
        answer:
          "It can repair stale local state, but first verify the package declaration and import path so the underlying issue does not return.",
      },
    ],
    references: [
      {
        label: "Next.js: Module not found",
        url: "https://nextjs.org/docs/messages/module-not-found",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "python-permission-denied",
    title: "PermissionError: [Errno 13] Permission denied",
    excerpt:
      "Python was blocked from reading, writing, or executing a filesystem resource.",
    language: "Python",
    category: "Filesystem",
    severity: "Medium",
    difficulty: "Beginner",
    fixTime: "5-15 min",
    popularity: 79,
    views: 88700,
    trend: 6,
    tags: ["python", "permissions", "files", "windows"],
    whatItMeans:
      "The operating system rejected Python's requested file operation because the process lacks permission, the path is a directory, or another application has locked the file.",
    causes: [
      "The process lacks read or write permission.",
      "The code passed a directory path where a file path was expected.",
      "Another process has locked the file on Windows.",
      "The destination is protected by the operating system.",
      "A container volume has incompatible ownership.",
    ],
    aiExplanation:
      "Python asked the operating system to open a path. The operating system refused before Python could read or write anything. Inspect the exact path and operation mode first.",
    quickFix: {
      commands: ["python -c \"from pathlib import Path; p=Path('output.txt'); print(p.resolve(), p.is_dir())\""],
      expected: "The command confirms the exact resolved path and whether it is a directory.",
    },
    solutions: [
      {
        title: "Use a writable file path",
        description:
          "Write inside the application data directory or a user-owned location.",
        probability: 69,
      },
      {
        title: "Close the program locking the file",
        description:
          "Spreadsheet applications and editors can hold exclusive locks on Windows.",
        probability: 48,
      },
      {
        title: "Correct directory ownership",
        description:
          "Set appropriate ownership for mounted volumes or service directories.",
        probability: 31,
      },
    ],
    alternatives: [
      {
        environment: "Windows",
        commands: ["Close applications using the file", "Choose a path under the user profile"],
        note: "Do not solve routine application writes by always running as Administrator.",
      },
      {
        environment: "Linux",
        commands: ["ls -ld <path>", "chown <service-user> <path>"],
        note: "Prefer correct ownership over broad chmod 777 permissions.",
      },
      {
        environment: "Docker",
        commands: ["RUN chown -R app:app /app/data"],
        note: "Match volume permissions to the non-root runtime user.",
      },
    ],
    brokenCode: "with open(\"C:/Windows/System32/output.txt\", \"w\") as file:\n    file.write(\"done\")",
    fixedCode:
      "from pathlib import Path\n\noutput = Path.home() / \"devfixes\" / \"output.txt\"\noutput.parent.mkdir(parents=True, exist_ok=True)\noutput.write_text(\"done\", encoding=\"utf-8\")",
    codeLanguage: "python",
    relatedSlugs: ["python-modulenotfounderror-requests"],
    faqs: [
      {
        question: "Should I run Python as Administrator or root?",
        answer:
          "Only when the task genuinely requires elevated access. For normal application files, use a user-owned path and correct permissions.",
      },
      {
        question: "Why does opening a folder raise PermissionError?",
        answer:
          "Functions such as `open()` expect a file path. Check `Path(path).is_dir()` and append a filename when needed.",
      },
    ],
    references: [
      {
        label: "Python exceptions: PermissionError",
        url: "https://docs.python.org/3/library/exceptions.html#PermissionError",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
  {
    slug: "python-modulenotfounderror",
    title: "ModuleNotFoundError: No module named ...",
    excerpt:
      "Python cannot resolve an imported package or local module in the active interpreter path.",
    language: "Python",
    category: "Packages and imports",
    severity: "Medium",
    difficulty: "Beginner",
    fixTime: "3-10 min",
    popularity: 97,
    views: 312400,
    trend: 12,
    tags: ["python", "imports", "modules", "pip"],
    whatItMeans:
      "The import system searched the active environment and project path but did not find the requested top-level module.",
    causes: [
      "The package is not installed.",
      "The import name differs from the package installation name.",
      "The project is running from the wrong working directory.",
      "A virtual environment mismatch exists.",
      "A local package is missing an expected project configuration.",
    ],
    aiExplanation:
      "The message names the import Python could not resolve. First determine whether it is a third-party package or your own module, then inspect the active interpreter and import path.",
    quickFix: {
      commands: ["python -c \"import sys; print(sys.executable); print(*sys.path, sep='\\n')\""],
      expected: "The output shows which interpreter and search paths Python is using.",
    },
    solutions: [
      {
        title: "Install the package into the active environment",
        description: "Use the running interpreter to invoke pip.",
        probability: 79,
        commands: ["python -m pip install <package>"],
      },
      {
        title: "Run the project as a module",
        description:
          "For package-relative imports, run from the project root with `python -m package.module`.",
        probability: 45,
      },
      {
        title: "Fix the local package structure",
        description:
          "Verify package directories, project configuration, and import names.",
        probability: 34,
      },
    ],
    alternatives: [
      {
        environment: "Virtual environment",
        commands: ["python -m venv .venv", "python -m pip install -r requirements.txt"],
        note: "Activate the environment before starting the application.",
      },
      {
        environment: "Editable local package",
        commands: ["python -m pip install -e ."],
        note: "Use an editable install for a properly configured local package.",
      },
    ],
    brokenCode: "from myapp.services import billing\n# executed from inside myapp/services",
    fixedCode: "# From the project root:\npython -m myapp.cli",
    codeLanguage: "shell",
    relatedSlugs: ["python-modulenotfounderror-requests", "python-permission-denied"],
    faqs: commonPythonFaqs,
    references: [
      {
        label: "Python import system",
        url: "https://docs.python.org/3/reference/import.html",
        type: "Official docs",
      },
    ],
    verifiedAt: "2026-07-21",
  },
];

export const errorArticles: ErrorArticle[] = [
  ...coreErrorArticles,
  ...platformErrorArticles,
];

export const categoryGroups = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C#", "Go", "Rust", "PHP", "C++"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Vue", "Angular", "Django", "FastAPI", "Laravel", "Spring"],
  },
  {
    label: "Developer tools",
    items: [
      "VS Code",
      "Node.js",
      "GitHub",
      "Cursor",
      "GitHub Copilot",
      "OpenRouter",
      "Ollama",
      "Docker Desktop",
    ],
  },
  {
    label: "DevOps",
    items: ["Docker", "Kubernetes", "Git", "GitHub Actions", "Linux", "Ubuntu", "Windows", "WSL"],
  },
  {
    label: "Cloud",
    items: ["AWS", "Azure", "Google Cloud", "Firebase", "Supabase", "Cloudflare"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"],
  },
];

export const tools = [
  { name: "JSON Formatter", description: "Format, validate, and inspect JSON.", icon: "braces" },
  { name: "Regex Tester", description: "Test patterns with live matches.", icon: "regex" },
  { name: "YAML Validator", description: "Catch indentation and schema issues.", icon: "file-check" },
  { name: "Docker Compose Validator", description: "Validate service definitions.", icon: "container" },
  { name: "Git Command Generator", description: "Build the exact Git command.", icon: "git-branch" },
  { name: "JWT Decoder", description: "Inspect claims without sending tokens.", icon: "key-round" },
  { name: "Cron Generator", description: "Build and explain cron expressions.", icon: "clock-3" },
  { name: "Package Installer", description: "Generate safe install commands.", icon: "package-plus" },
];

export function getErrorBySlug(slug: string) {
  return errorArticles.find((article) => article.slug === slug);
}

export function getRelatedErrors(article: ErrorArticle) {
  return article.relatedSlugs
    .map((slug) => getErrorBySlug(slug))
    .filter((item): item is ErrorArticle => Boolean(item));
}
