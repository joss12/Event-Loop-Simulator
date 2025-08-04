// loop.js
const readline = require("readline");
const { callStack, taskQueue, microtaskQueue } = require("./queue");
const { logState } = require("./utils/logger");

let tickCount = 0;
let autorun = false;
let tickLimit = Infinity;

function setOptions(opts = {}) {
    autorun = opts.autorun ?? false;
    tickLimit = opts.tickLimit ?? Infinity;
}

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
    tickCount++;
    logState(`✅ End of Tick`);

    runMicrotasks();
    runTasks();

    if (tickCount >= tickLimit) {
        console.log(`\n🛑 Tick limit (${tickLimit}) reached.`);
        process.exit(0);
    }

    if (microtaskQueue.length > 0 || taskQueue.length > 0) {
        if (autorun) {
            setTimeout(tick, 300);
        } else {
            waitForInput(tick);
        }
    } else {
        console.log("\n🎉 Simulation complete.");
        process.exit(0);
    }
}
// ✨ Step-by-step pause
function waitForInput(callback) {
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
            autorun = true;
            callback(); //continue immediately
        } else {
            callback(); // next manual tick
        }
    });
}

module.exports = {
    tick,
    setOptions,
};
