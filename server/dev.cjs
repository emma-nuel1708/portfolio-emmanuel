const { spawn } = require("node:child_process");

const isWindows = process.platform === "win32";
const npm = isWindows ? "cmd.exe" : "npm";
const npmArgs = (args) => (isWindows ? ["/d", "/s", "/c", "npm.cmd", ...args] : args);
const processes = [
  ["api", npm, npmArgs(["run", "dev:api"])],
  ["web", npm, npmArgs(["run", "dev:web", "--", "--host", "0.0.0.0"])]
];

const children = processes.map(([name, command, args]) => {
  const child = spawn(command, args, {
    stdio: "pipe",
    shell: false,
    env: { ...process.env, FORCE_COLOR: "1" }
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown();
    }
  });

  return child;
});

function shutdown() {
  children.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
