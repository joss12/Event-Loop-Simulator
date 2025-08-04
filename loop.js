// loop.js
const readline = require("readline");
const { callStack, taskQueue, microtaskQueue } = require("./queue");
const { logState } = require("./utils/logger");

let autoRun = false;

function simulateFunction(name, fn) {
  callStack.push(name);
  fn();
  callStack.pop();
}

function runMicrotasks() {
  while (microtaskQueue.length > 0) {
    const fn = microtaskQueue.shift();
    simulateFunction(`microtask: ${fn.name}`, fn);
  }
}

function runTasks() {
  if (taskQueue.length > 0) {
    const fn = taskQueue.shift();
    simulateFunction(`task: ${fn.name}`, fn);
  }
}

function tick() {
  logState("🌀 Start of Tick");

  runMicrotasks();
  runTasks();

  logState("✅ End of Tick");

  if (microtaskQueue.length > 0 || taskQueue.length > 0) {
    if (autoRun) {
      setTimeout(tick, 300); // short delay for readability
    } else {
      waitForEnter(tick);
    }
  } else {
    console.log("\n simulation complete.\n");
    process.exit(0);
  }
}

// ✨ Step-by-step pause
function waitForEnter(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Process [enter] = next tick | [s] = auto-run | [q] = quit");

  rl.question("", (input) => {
    rl.close();
    if (input === "q") {
      console.log("\n Quit.");
      process.exit(0);
    } else if (input === "s") {
      autoRun = true;
      callback(); //continue immediately
    } else {
      callback(); // next manual tick
    }
  });
}

module.exports = {
  tick,
};
