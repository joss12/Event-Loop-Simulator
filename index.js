#!/usr/bin/env node

const scenarios = require("./scenarios");
const { tick, setOptions } = require("./loop");

const args = process.argv.slice(2);
const name = process.argv[2] || "nestedClassic";

//Simple flag parsing
let autorun = false;
let tickLimit = Infinity;

args.slice(1).forEach((arg) => {
    if (arg == "--autorun") autorun = true;
    if (arg.startsWith("--ticks=")) {
        const n = Number(arg.split("=")[1]);
        if (!isNaN(n)) tickLimit = n;
    }
});

if (!scenarios[name]) {
    console.log("Usage:\n  evloop <scenarioName>\n");
    console.log("Available scenarios:\n");
    Object.keys(scenarios).forEach((key) => {
        console.log(`  - ${key}`);
    });
    process.exit(1);
}

console.log(`\n▶ Running scenario: ${name}\n`);
if (autorun) console.log(" Autorun enable");
if (tickLimit !== Infinity) console.log(`Tick limit: ${tickLimit}\n`);

setOptions({ autorun, tickLimit });
scenarios[name]();
tick();
