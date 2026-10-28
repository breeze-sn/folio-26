import { spawn } from "node:child_process";
import process from "node:process";

const apiPort = process.env.API_PORT || "3001";
const viteArgs = process.argv.slice(2);
const children = [];
let shuttingDown = false;

function stopChildren(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

const api = spawn(process.execPath, ["server.js"], {
  env: { ...process.env, PORT: apiPort },
  stdio: "inherit",
});
children.push(api);

const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js", ...viteArgs], {
  env: { ...process.env, API_PORT: apiPort },
  stdio: "inherit",
});
children.push(vite);

for (const child of children) {
  child.on("error", (error) => {
    console.error("Could not start the local FORM services:", error.message);
    stopChildren(1);
  });
  child.on("exit", (code) => {
    if (!shuttingDown && code !== null) stopChildren(code);
  });
}

process.on("SIGINT", () => stopChildren(0));
process.on("SIGTERM", () => stopChildren(0));
