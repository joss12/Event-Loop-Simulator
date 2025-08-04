#!/usr/bin/env node

const scenarios = require("./scenarios");
const { tick } = require("./loop");

const name = process.argv[2] || "nestedClassic";

if (!scenarios[name]) {
    console.log("Usage:\n  evloop <scenarioName>\n");
    console.log("Available scenarios:\n");
    Object.keys(scenarios).forEach((key) => {
        console.log(`  - ${key}`);
    });
    process.exit(1);
}

console.log(`\n▶ Running scenario: ${name}\n`);
scenarios[name]();
tick();
