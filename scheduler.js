// scheduler.js
const { taskQueue, microtaskQueue } = require("./queue");
const { logSchedule } = require("./utils/logger");

// Simulate setTimeout by pushing to the task queue
function fakeSetTimeout(fn) {
    logSchedule("setTimeout", fn.name);
    taskQueue.push(fn);
}

// Simulate Promise.then by pushing to the microtask queue
function fakePromiseThen(fn) {
    logSchedule("promise.then", fn.name);
    microtaskQueue.push(fn);
}

// Simulate queueMicrotask behavior
function fakeQueueMicrotask(fn) {
    logSchedule("queueMicrotask", fn.name);
    microtaskQueue.push(fn);
}

// Simulated async/await function
// Takes a function name and an array of steps (to simulate await)
function fakeAsync(name, steps) {
    let i = 0;

    function nextStep() {
        if (i < steps.length) {
            const step = steps[i++];
            fakePromiseThen(function stepFn() {
                console.log(`→ (await) ${step.name}`);
                step();

                // Schedule the next step on the microtask queue
                // to match real await behavior (1 step per tick)
                fakeQueueMicrotask(nextStep);
            });
        }
    }

    logSchedule("async", name);
    nextStep(); // Start execution
}

module.exports = {
    fakeSetTimeout,
    fakePromiseThen,
    fakeQueueMicrotask,
    fakeAsync,
};
