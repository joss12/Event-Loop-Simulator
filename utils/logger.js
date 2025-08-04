// utils/logger.js
const { callStack, taskQueue, microtaskQueue } = require("../queue");

let tickCount = 0;

function logSchedule(type, fnName) {
    console.log(`[SCHEDULED] ${type}: "${fnName}"`);
}

function logState(phase) {
    tickCount += 1;

    clearScreen();

    printBox("🧠 Call Stack", callStack.map(String));
    printBox(
        "📦 Microtask Queue",
        microtaskQueue.map((fn) => fn.name),
    );
    printBox(
        "📥 Task Queue",
        taskQueue.map((fn) => fn.name),
    );

    console.log(`🌀 Tick: ${tickCount} | ${phase}`);
}

function printBox(title, lines) {
    const width = Math.max(
        title.length + 4,
        ...lines.map((l) => l.length + 2),
        20,
    );
    const border = "─".repeat(width - 2);
    console.log(`┌${border}┐`);
    console.log(`│ ${title.padEnd(width - 3)}│`);
    console.log(`├${border}┤`);

    if (lines.length === 0) {
        console.log(`│ ${"(empty)".padEnd(width - 3)}│`);
    } else {
        for (let line of lines) {
            console.log(`│ ${line.padEnd(width - 3)}│`);
        }
    }

    console.log(`└${border}┘\n`);
}

function clearScreen() {
    process.stdout.write("\x1Bc"); // ANSI clear
}

module.exports = {
    logSchedule,
    logState,
};
